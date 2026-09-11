/**
 * Utility to generate and process genuine Worker ID card photos and verification badges
 */

export function generateSampleIdCardDataUrl(name: string, workerId: string, role: string, facility: string): string {
  const sanitizedName = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedId = workerId.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedRole = role.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedFacility = facility.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const initial = (name.trim()[0] || 'W').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="45%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="50%" stop-color="#ea580c" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>
      <linearGradient id="hologram" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
        <stop offset="50%" stop-color="#a855f7" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.3" />
      </linearGradient>
      <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.4" />
      </filter>
    </defs>

    <!-- Base Card Outline -->
    <rect x="10" y="10" width="580" height="360" rx="20" fill="url(#bgGrad)" stroke="#334155" stroke-width="3" filter="url(#cardShadow)" />
    
    <!-- Top Security Band -->
    <path d="M10 30 Q10 10 30 10 L570 10 Q590 10 590 30 L590 64 L10 64 Z" fill="url(#accentGrad)" />
    
    <!-- Header Titles -->
    <text x="30" y="36" fill="#0f172a" font-size="11" font-weight="900" letter-spacing="1.5" font-family="system-ui, -apple-system, sans-serif">GOVERNMENT OF INDIA • MINES SAFETY DIRECTORATE</text>
    <text x="30" y="52" fill="#ffffff" font-size="14" font-weight="800" font-family="system-ui, -apple-system, sans-serif">OFFICIAL MINER BIOMETRIC IDENTIFICATION PASS</text>
    
    <g transform="translate(520, 20)">
      <circle cx="15" cy="12" r="14" fill="#0f172a" opacity="0.3" />
      <text x="15" y="16" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">DGMS</text>
    </g>

    <!-- Holographic security strip -->
    <rect x="10" y="70" width="580" height="12" fill="url(#hologram)" />

    <!-- Trainee Photo Box -->
    <g transform="translate(36, 105)">
      <!-- Photo frame -->
      <rect x="0" y="0" width="130" height="160" rx="12" fill="#1e293b" stroke="#f97316" stroke-width="2.5" />
      <!-- Stylized Worker Silhouette Avatar -->
      <rect x="6" y="6" width="118" height="148" rx="8" fill="#334155" />
      <!-- Face & hardhat graphic -->
      <circle cx="65" cy="62" r="32" fill="#fed7aa" />
      <!-- Hard hat on worker -->
      <path d="M30 52 C30 30, 100 30, 100 52 Z" fill="#f97316" />
      <rect x="25" y="50" width="80" height="7" rx="3" fill="#ea580c" />
      <circle cx="65" cy="40" r="5" fill="#fef08a" />
      <!-- Body shoulders with safety vest -->
      <path d="M16 154 C16 105, 114 105, 114 154 Z" fill="#0284c7" />
      <!-- High vis yellow stripes -->
      <path d="M42 115 L48 154 M88 115 L82 154" stroke="#facc15" stroke-width="8" stroke-linecap="round" />
      
      <!-- Biometric Stamp on photo -->
      <rect x="10" y="128" width="110" height="20" rx="5" fill="#059669" opacity="0.95" />
      <text x="65" y="142" fill="#ffffff" font-size="9" font-weight="900" text-anchor="middle" font-family="monospace">✓ VERIFIED PHOTO</text>
    </g>

    <!-- Worker Credentials & Details -->
    <g transform="translate(186, 105)">
      <text x="0" y="16" fill="#94a3b8" font-size="10" font-weight="bold" letter-spacing="1">TRAINEE NAME / ᱧᱩᱛᱩᱢ</text>
      <text x="0" y="38" fill="#ffffff" font-size="20" font-weight="800" font-family="system-ui, sans-serif">${sanitizedName}</text>

      <text x="0" y="68" fill="#94a3b8" font-size="10" font-weight="bold" letter-spacing="1">STATUTORY EMPLOYEE ID / ᱠᱟᱹᱢᱤᱭᱟᱹ ID</text>
      <rect x="0" y="76" width="220" height="28" rx="6" fill="#0f172a" stroke="#f97316" stroke-width="1.5" />
      <text x="12" y="95" fill="#f97316" font-size="14" font-weight="900" font-family="monospace">${sanitizedId}</text>

      <text x="0" y="128" fill="#94a3b8" font-size="10" font-weight="bold" letter-spacing="1">DESIGNATION &amp; TRADE</text>
      <text x="0" y="146" fill="#e2e8f0" font-size="13" font-weight="700" font-family="system-ui, sans-serif">${sanitizedRole}</text>

      <text x="0" y="176" fill="#94a3b8" font-size="10" font-weight="bold" letter-spacing="1">MINE UNIT / FACILITY</text>
      <text x="0" y="194" fill="#cbd5e1" font-size="11" font-weight="500" font-family="system-ui, sans-serif">${sanitizedFacility}</text>
    </g>

    <!-- Security Chip / Hologram on right -->
    <g transform="translate(490, 105)">
      <rect x="0" y="0" width="70" height="52" rx="8" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
      <!-- Chip contacts -->
      <rect x="8" y="8" width="54" height="36" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
      <line x1="8" y1="26" x2="62" y2="26" stroke="#ca8a04" stroke-width="1.5" />
      <line x1="35" y1="8" x2="35" y2="44" stroke="#ca8a04" stroke-width="1.5" />

      <!-- Barcode simulation -->
      <g transform="translate(0, 75)">
        <rect x="0" y="0" width="70" height="85" fill="#ffffff" rx="6" />
        <line x1="8" y1="10" x2="8" y2="70" stroke="#000" stroke-width="3" />
        <line x1="14" y1="10" x2="14" y2="70" stroke="#000" stroke-width="1.5" />
        <line x1="19" y1="10" x2="19" y2="70" stroke="#000" stroke-width="4" />
        <line x1="26" y1="10" x2="26" y2="70" stroke="#000" stroke-width="2" />
        <line x1="32" y1="10" x2="32" y2="70" stroke="#000" stroke-width="1" />
        <line x1="37" y1="10" x2="37" y2="70" stroke="#000" stroke-width="3" />
        <line x1="43" y1="10" x2="43" y2="70" stroke="#000" stroke-width="2.5" />
        <line x1="49" y1="10" x2="49" y2="70" stroke="#000" stroke-width="1" />
        <line x1="56" y1="10" x2="56" y2="70" stroke="#000" stroke-width="3.5" />
        <line x1="62" y1="10" x2="62" y2="70" stroke="#000" stroke-width="2" />
        <text x="35" y="80" fill="#000" font-size="7" font-family="monospace" text-anchor="middle">AUTH-DGMS</text>
      </g>
    </g>

    <!-- Bottom Security Footer -->
    <rect x="10" y="325" width="580" height="45" rx="0" fill="#0b1120" />
    <line x1="10" y1="325" x2="590" y2="325" stroke="#334155" stroke-width="1" />
    
    <text x="30" y="345" fill="#22c55e" font-size="11" font-weight="bold" font-family="monospace">● GENUINE CANDIDATE BIOMETRIC VERIFICATION ACTIVE</text>
    <text x="30" y="358" fill="#64748b" font-size="9" font-family="system-ui, sans-serif">Tamper-evident ISO/IEC 7810 ID-1 mining compliance credential • AI Proctoring active during exam</text>
    
    <text x="560" y="352" fill="#94a3b8" font-size="10" font-weight="bold" text-anchor="end" font-family="monospace">EXP: 2027</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
