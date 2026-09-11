import { CertificateRecord, OfflineSyncItem } from '../types';
import { initialCertificatesDatabase } from '../data/mockCertificates';

const CERT_STORAGE_KEY = 'suraksha_ar_certificates';
const PENDING_SYNC_KEY = 'suraksha_ar_pending_sync';
const OFFLINE_OVERRIDE_KEY = 'suraksha_offline_override';

export class OfflineStorageManager {
  private static instance: OfflineStorageManager;
  private listeners: Array<() => void> = [];

  private constructor() {
    this.initializeStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange());
      window.addEventListener('offline', () => this.handleNetworkChange());
    }
  }

  public static getInstance(): OfflineStorageManager {
    if (!OfflineStorageManager.instance) {
      OfflineStorageManager.instance = new OfflineStorageManager();
    }
    return OfflineStorageManager.instance;
  }

  private initializeStorage() {
    if (typeof window === 'undefined') return;
    try {
      const storedCerts = localStorage.getItem(CERT_STORAGE_KEY);
      if (!storedCerts) {
        localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify([]));
      } else {
        // Sanitize any legacy mock certificates that were automatically granted in earlier builds
        try {
          const parsed = JSON.parse(storedCerts);
          if (Array.isArray(parsed)) {
            const legacyIds = [
              'SURAKSHA-IND-2026-FIRE-8921B',
              'SURAKSHA-IND-2026-GAS-4390A',
              'SURAKSHA-IND-2026-FIRE-1029C',
              'SURAKSHA-IND-2026-GAS-7721D',
              'SURAKSHA-IND-2026-FIRE-5512E'
            ];
            const cleaned = parsed.filter((c: any) => !legacyIds.includes(c?.certificateId));
            localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(cleaned));
          }
        } catch (e) {
          localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify([]));
        }
      }
      const storedPending = localStorage.getItem(PENDING_SYNC_KEY);
      if (!storedPending) {
        localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify([]));
      }
    } catch (e) {
      console.error('Failed to init local storage', e);
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public isSimulatedOffline(): boolean {
    if (typeof window === 'undefined') return false;
    const manualOffline = localStorage.getItem(OFFLINE_OVERRIDE_KEY) === 'true';
    const browserOffline = !navigator.onLine;
    return manualOffline || browserOffline;
  }

  public setSimulatedOffline(isOffline: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(OFFLINE_OVERRIDE_KEY, isOffline ? 'true' : 'false');
    this.notify();
  }

  private handleNetworkChange() {
    this.notify();
  }

  public getCertificates(): CertificateRecord[] {
    if (typeof window === 'undefined') return initialCertificatesDatabase;
    try {
      const data = localStorage.getItem(CERT_STORAGE_KEY);
      return data ? JSON.parse(data) : initialCertificatesDatabase;
    } catch (e) {
      return initialCertificatesDatabase;
    }
  }

  public getPendingSyncItems(): OfflineSyncItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(PENDING_SYNC_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  public saveCertificate(cert: CertificateRecord): { synced: boolean; certificate: CertificateRecord } {
    const isOffline = this.isSimulatedOffline();
    const updatedCert: CertificateRecord = {
      ...cert,
      synced: !isOffline
    };

    const certs = this.getCertificates();
    // Add to front
    const filtered = certs.filter(c => c.certificateId !== cert.certificateId);
    const newCerts = [updatedCert, ...filtered];
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(newCerts));

    if (isOffline) {
      // Queue for offline sync
      const syncItem: OfflineSyncItem = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: 'certificate_generation',
        payload: updatedCert,
        timestamp: new Date().toISOString(),
        synced: false
      };
      const pending = this.getPendingSyncItems();
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify([syncItem, ...pending]));
      this.notify();
      return { synced: false, certificate: updatedCert };
    } else {
      // Direct async sync to server registry
      this.syncDirectToServer(updatedCert);
      this.notify();
      return { synced: true, certificate: updatedCert };
    }
  }

  private async syncDirectToServer(cert: CertificateRecord) {
    try {
      await fetch('/api/certificates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cert)
      });
    } catch (e) {
      console.warn('Server direct sync failed, keeping local copy', e);
    }
  }

  public async syncPendingNow(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    const pending = this.getPendingSyncItems();
    if (pending.length === 0) {
      return { success: true, syncedCount: 0, message: 'All local compliance records are already up to date.' };
    }

    try {
      const certsToSync = pending
        .filter(item => item.type === 'certificate_generation')
        .map(item => item.payload);

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateRecords: certsToSync,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Clear pending queue and mark certs as synced
        localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify([]));
        
        const currentCerts = this.getCertificates().map(c => ({
          ...c,
          synced: true
        }));
        localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(currentCerts));

        this.notify();
        return {
          success: true,
          syncedCount: pending.length,
          message: `Successfully synchronized ${pending.length} offline records with central compliance database.`
        };
      } else {
        throw new Error('Sync server rejected payload');
      }
    } catch (e) {
      return {
        success: false,
        syncedCount: 0,
        message: 'Network offline or central server unreachable. Offline records remain safe on device.'
      };
    }
  }

  public clearAllCertificates() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify([]));
    this.notify();
  }

  public deleteCertificate(certId: string) {
    if (typeof window === 'undefined') return;
    const certs = this.getCertificates().filter(c => c.certificateId !== certId);
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
    this.notify();
  }
}

export const offlineStorage = OfflineStorageManager.getInstance();
