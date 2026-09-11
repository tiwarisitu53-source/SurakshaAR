// Suraksha AR Native Mobile Haptics & Tactile Feedback Engine
import { audioAssistant } from './audioAssistant';

export type HapticPattern =
  // Core UI & Navigation
  | 'tap'
  | 'step'
  | 'success'
  | 'warning'
  | 'error'
  | 'alarm'
  | 'scan'
  | 'plane_lock'
  // Distinct Safety Component Actions
  | 'loto_lock'          // Mechanical lockout hasp and padlock clamp
  | 'pin_pull'           // Extinguisher tamper seal break and safety pin pull
  | 'extinguisher_squeeze' // Nozzle/handle squeeze trigger
  | 'spray_burst'        // Pressurized sweeping discharge pulse
  | 'ppe_equip'          // Dual buckle/harness snap (SCBA, Arc Suit, harness)
  | 'gas_sample'         // Multi-gas probe aspiration & strata sensing pulse
  | 'buddy_lifeline'     // Heavy forged steel snap hook / carabiner click
  | 'blower_start'       // Axial industrial blower startup & duct surge
  | 'voltage_probe'      // Hot stick dielectric capacitive test chirp/pulse
  | 'rescue_hook'        // Dielectric rescue hook engagement
  | 'e_stop'             // Emergency pull-cord / E-stop high impact trip
  | 'anchor_test'        // Overhead 22.2 kN anchor point load test
  | 'trauma_strap'       // Suspension trauma relief strap deployment
  | 'scaffold_inspect';  // Scaffold green tag audit verification

export interface HapticEvent {
  pattern: HapticPattern;
  label: {
    en: string;
    hi: string;
    sat: string;
  };
  customLabel?: string;
  timestamp: number;
}

export type HapticListener = (event: HapticEvent) => void;

// Physical hardware vibration sequences (in milliseconds)
const HAPTIC_SEQUENCES: Record<HapticPattern, number | number[]> = {
  tap: 15,
  step: [20, 30, 20],
  success: [30, 50, 40, 50, 80],
  warning: [80, 50, 80],
  error: [120, 40, 120, 40, 150],
  alarm: [200, 100, 200, 100, 300],
  scan: 50,
  plane_lock: [25, 40, 60],
  // Distinct Industrial Safety Patterns
  loto_lock: [35, 45, 90],             // Guide click, brief gap, heavy padlock shackle clamp
  pin_pull: [30, 35, 75],              // Resistance against seal, then sudden release snap
  extinguisher_squeeze: [35, 25, 45],  // Valve lever spring compression resistance
  spray_burst: [20, 20, 35, 20, 50],   // Chemical agent pressurized propellant discharge
  ppe_equip: [35, 40, 30, 40, 70],     // Dual chest & waist buckle clicks + snug harness fit
  gas_sample: [20, 30, 25, 30, 45],    // Motorized sampling pump suction blip + electronic capture
  buddy_lifeline: [25, 30, 80],        // Forged steel carabiner gate snapping firmly into lifeline
  blower_start: [30, 35, 45, 35, 85],  // Heavy power toggle & industrial axial fan acceleration
  voltage_probe: [20, 25, 20, 25, 60], // Non-contact capacitive dielectric detection pulse
  rescue_hook: [45, 35, 80],           // Solid fiberglass dielectric hook extraction grasp
  e_stop: [90, 35, 120],               // High-force mechanical detent trip
  anchor_test: [50, 40, 75, 40, 110],  // 22.2 kN tensile tug test on structural beam anchor
  trauma_strap: [25, 30, 25, 30, 40],  // Webbing tear-away release tick
  scaffold_inspect: [30, 40, 30]       // Safety certification stamp
};

// Descriptive localized metadata for UI alerts, tooltips and screen readers
export const HAPTIC_METADATA: Record<HapticPattern, { en: string; hi: string; sat: string; icon: string }> = {
  tap: {
    en: 'Tap',
    hi: 'टैप',
    sat: 'ᱴᱮᱯ',
    icon: '👆'
  },
  step: {
    en: 'Next Step',
    hi: 'अगला चरण',
    sat: 'ᱫᱚᱥᱟᱨ ᱫᱷᱟᱯ',
    icon: '⏩'
  },
  success: {
    en: 'Task Complete',
    hi: 'कार्य संपन्न',
    sat: 'ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ',
    icon: '✅'
  },
  warning: {
    en: 'Caution Alert',
    hi: 'चेतावनी अलर्ट',
    sat: 'ᱦᱩᱥᱤᱭᱟᱹᱨ',
    icon: '⚠️'
  },
  error: {
    en: 'Incorrect Action',
    hi: 'त्रुटिपूर्ण कार्रवाई',
    sat: 'ᱵᱷᱩᱞ ᱠᱟᱹᱢᱤ',
    icon: '❌'
  },
  alarm: {
    en: 'Emergency Alarm',
    hi: 'आपातकालीन अलार्म',
    sat: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱟᱞᱟᱨᱢ',
    icon: '🚨'
  },
  scan: {
    en: 'Scanning Surface',
    hi: 'सतह स्कैनिंग',
    sat: 'ᱚᱛ ᱥᱠᱮᱱ',
    icon: '📡'
  },
  plane_lock: {
    en: 'AR Spatial Surface Locked',
    hi: 'AR सतह लॉक हुई',
    sat: 'AR ᱚᱛ ᱞᱚᱠ ᱮᱱᱟ',
    icon: '🎯'
  },
  loto_lock: {
    en: 'LOTO Padlock & Hasp Clamped',
    hi: 'LOTO सुरक्षा ताला व हैस्प लगा',
    sat: 'LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱮᱱᱟ',
    icon: '🔒'
  },
  pin_pull: {
    en: 'Safety Pin & Seal Pulled',
    hi: 'अग्निशामक सुरक्षा पिन निकाला',
    sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱯᱤᱱ ᱚᱨ ᱮᱱᱟ',
    icon: '🧯'
  },
  extinguisher_squeeze: {
    en: 'Discharge Lever Squeezed',
    hi: 'डिस्चार्ज लीवर दबाया',
    sat: 'ᱦᱮᱱᱰᱮᱞ ᱚᱛᱟ ᱮᱱᱟ',
    icon: '✊'
  },
  spray_burst: {
    en: 'Pressurized Agent Discharged',
    hi: 'अग्नि बुझाने वाला पाउडर/गैस छूटा',
    sat: 'ᱜᱮᱥ ᱥᱮ ᱫᱟᱜ ᱟᱲᱟᱜ ᱮᱱᱟ',
    icon: '💨'
  },
  ppe_equip: {
    en: 'Safety Gear & Harness Latched',
    hi: 'सुरक्षा किट व हार्नेस सुरक्षित पहना',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱟᱥᱠ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱮᱱᱟ',
    icon: '🦺'
  },
  gas_sample: {
    en: 'Stratified Gas Sample Captured',
    hi: 'गैस स्तर (CH4/O2/H2S) विश्लेषित',
    sat: 'ᱜᱮᱥ ᱡᱟᱸᱪ ᱦᱩᱭ ᱮᱱᱟ',
    icon: '🔬'
  },
  buddy_lifeline: {
    en: 'Lifeline Carabiner Locked',
    hi: 'लाइफलाइन सुरक्षा हुक लॉक हुआ',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ ᱦᱩᱠ ᱡᱚᱲᱟᱣ ᱮᱱᱟ',
    icon: '🪝'
  },
  blower_start: {
    en: '4500 CFM Air Blower Purge Active',
    hi: '4500 CFM ब्लोअर हवा शुद्ध कर रहा है',
    sat: 'ᱦᱚᱭ ᱵᱽᱞᱳᱣᱟᱨ ᱪᱟᱹᱞᱩ ᱮᱱᱟ',
    icon: '🌀'
  },
  voltage_probe: {
    en: 'Hot Stick Zero Voltage Confirmed',
    hi: 'हॉट स्टिक शून्य वोल्टेज सत्यापित',
    sat: 'ᱠᱟᱨᱮᱱᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ (0.0 kV) ᱴᱷᱤᱠ ᱮᱱᱟ',
    icon: '⚡'
  },
  rescue_hook: {
    en: 'Insulated Rescue Hook Deployed',
    hi: 'इंसुलेटेड रेस्क्यू हुक तैनात',
    sat: 'ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱞᱟᱜᱟᱣ ᱮᱱᱟ',
    icon: '🛟'
  },
  e_stop: {
    en: 'Emergency Trip Switch Activated',
    hi: 'आपातकालीन ट्रिप स्विच सक्रिय',
    sat: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱣᱤᱪ ᱪᱟᱹᱞᱩ ᱮᱱᱟ',
    icon: '🛑'
  },
  anchor_test: {
    en: 'Anchor 22.2 kN Load Verified',
    hi: 'एंकर 22.2 kN लोड क्षमता पास',
    sat: 'एंकर 22.2 kN ᱞᱳᱰ ᱯᱟᱥ ᱮᱱᱟ',
    icon: '⚓'
  },
  trauma_strap: {
    en: 'Trauma Relief Webbing Deployed',
    hi: 'सस्पेंशन ट्रॉमा रिलीफ स्ट्रैप खुला',
    sat: 'ᱴᱨᱚᱢᱟ ᱥᱴᱨᱮᱯ ᱠᱷᱩᱞᱟᱹ ᱮᱱᱟ',
    icon: '🪜'
  },
  scaffold_inspect: {
    en: 'Scaffold Green Tag Certified',
    hi: 'मचान ग्रीन टैग सत्यापित',
    sat: 'ᱥᱠᱮᱯᱷᱳᱞᱰᱤᱝ ᱜᱽᱨᱤᱱ ᱴᱮᱜᱽ ᱴᱷᱤᱠ ᱮᱱᱟ',
    icon: '🏷️'
  }
};

class HapticManager {
  private enabled: boolean = true;
  private listeners: Set<HapticListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('suraksha_haptics_enabled');
      this.enabled = stored !== 'false';
    }
  }

  public subscribe(listener: HapticListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('suraksha_haptics_enabled', enable ? 'true' : 'false');
    }
  }

  public toggleEnabled(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    if (next) {
      this.trigger('tap', 'Haptics Enabled');
    }
    return next;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Triggers a distinct haptic feedback pattern.
   * 1. Fires physical vibration via navigator.vibrate on mobile devices.
   * 2. Synthesizes an acoustic micro-haptic click/thump for universal feedback.
   * 3. Dispatches event to registered UI listeners for visual ripple confirmation.
   */
  public trigger(
    pattern: HapticPattern = 'tap',
    customLabel?: string,
    options: { playAudioTactile?: boolean } = { playAudioTactile: true }
  ) {
    if (!this.enabled) {
      return;
    }

    // 1. Physical mobile vibration pattern
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        const sequence = HAPTIC_SEQUENCES[pattern] ?? 20;
        navigator.vibrate(sequence);
      } catch (e) {
        // Ignore vibration errors on unsupported or user-restricted devices
      }
    }

    // 2. Synthesized acoustic micro-haptic for all devices/browsers
    if (options.playAudioTactile !== false) {
      try {
        audioAssistant.playTactileFeedback(pattern);
      } catch (e) {
        // Ignore audio errors
      }
    }

    // 3. Notify registered UI subscribers (e.g. for on-screen tactile ripples/badges)
    const meta = HAPTIC_METADATA[pattern] ?? HAPTIC_METADATA.tap;
    const event: HapticEvent = {
      pattern,
      label: {
        en: meta.en,
        hi: meta.hi,
        sat: meta.sat
      },
      customLabel,
      timestamp: Date.now()
    };

    this.listeners.forEach(fn => {
      try {
        fn(event);
      } catch (e) {
        // Ignore listener error
      }
    });
  }
}

export const haptics = new HapticManager();
