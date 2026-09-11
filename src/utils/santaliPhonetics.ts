// Comprehensive Ol Chiki to phonetic transliteration utility for web speech synthesis engines.
// This allows browser TTS (which lacks raw Unicode Ol Chiki fonts/parsers) to pronounce fluent, natural Santali speech.

const OL_CHIKI_MAP: Record<string, string> = {
  // Ol Chiki Vowels and Consonants (U+1C50 to U+1C7F)
  'ᱚ': 'o',      // LA (o as in hot / open o)
  'ᱛ': 't',      // AT (dental t)
  'ᱜ': 'g',      // AG (g)
  'ᱝ': 'ng',     // ANG
  'ᱞ': 'l',      // AL
  'ᱟ': 'aa',     // AAK (a)
  'ᱠ': 'k',      // AAK
  'ᱡ': 'j',      // AAJ
  'ᱢ': 'm',      // AAM
  'ᱣ': 'w',      // AAW
  'ᱤ': 'i',      // LI (i)
  'ᱥ': 's',      // IS
  'ᱦ': 'h',      // IH
  'ᱧ': 'ny',     // INY
  'ᱨ': 'r',      // IR
  'ᱩ': 'u',      // LU (u)
  'ᱪ': 'ch',     // UCH
  'ᱫ': 'd',      // UD
  'ᱬ': 'n',      // ENN
  'ᱭ': 'y',      // UY
  'ᱮ': 'e',      // LE (e)
  'ᱯ': 'p',      // EP
  'ᱰ': 'd',      // EDD
  'ᱱ': 'n',      // EN
  'ᱲ': 'r',      // ERR (flapped r)
  'ᱳ': 'o',      // LO (close o)
  'ᱴ': 't',      // OTT (retroflex t)
  'ᱵ': 'b',      // OB
  'ᱶ': 'v',      // OV
  'ᱷ': 'h',      // OH (aspirated)
  
  // Modifiers & Punctuation
  'ᱸ': 'n',      // Mu TTT (nasal)
  'ᱹ': '',       // Gahu TTT (low tone)
  'ᱺ': 'n',      // Mu-Gahu
  'ᱻ': '',       // Ahla (length)
  'ᱼ': ' ',      // Pharka (syllable break)
  'ᱽ': '',       // Ohod (deglottalizer)
  '᱾': '.',      // Mucad (period)
  '᱿': '.',      // Double Mucad
  
  // Ol Chiki Digits
  '᱐': '0',
  '᱑': '1',
  '᱒': '2',
  '᱓': '3',
  '᱔': '4',
  '᱕': '5',
  '᱖': '6',
  '᱗': '7',
  '᱘': '8',
  '᱙': '9'
};

// High-frequency Santali industrial and safety vocabulary dictionary for pristine phonetic pronunciation
const SANTALI_VOCAB_PHONETICS: Record<string, string> = {
  'ᱥᱮᱸᱜᱮᱞ': 'sengel',             // Fire
  'ᱤᱬᱤᱡ': 'inij',                 // Extinguish / put out
  'ᱢᱤᱥᱤᱱ': 'masheen',              // Machine
  'ᱫᱟᱜ': 'daah',                  // Water
  'ᱠᱟᱨᱮᱱᱴ': 'current',            // Current
  'ᱵᱤᱡᱽᱞᱤ': 'bijli',              // Electricity
  'ᱨᱩᱠᱷᱤᱭᱟᱹ': 'rukhiya',          // Safety
  'ᱠᱷᱟᱫᱟᱱ': 'khaadan',            // Mine
  'ᱜᱮᱥ': 'gas',                   // Gas
  'ᱫᱩᱣᱟᱹᱨ': 'duwaar',             // Door / exit
  'ᱚᱰᱚᱠᱚᱜ': 'odokok',              // Evacuate / go out
  'ᱦᱚᱲᱢᱚ': 'hormo',               // Body
  'ᱵᱚᱛᱚᱨ': 'botor',               // Danger
  'ᱦᱟᱹᱨᱤᱭᱟᱹᱲ': 'hariyar',         // Green
  'ᱟᱨᱟᱜ': 'arag',                 // Red
  'ᱥᱟᱥᱟᱝ': 'sasang',              // Yellow
  'ᱚᱛ': 'ot',                     // Ground / floor
  'ᱠᱟᱹᱢᱤᱭᱟᱹ': 'kamiya',           // Worker
  'ᱜᱟᱛᱮ': 'gaate',                // Friend / buddy
  'ᱟᱞᱟᱨᱢ': 'alarm',               // Alarm
  'ᱚᱛᱟᱭ ᱢᱮ': 'otay me',           // Press / push
  'ᱚᱨ ᱢᱮ': 'or me',               // Pull
  'ᱪᱤᱱᱦᱟᱹᱣ': 'chinhaw',            // Identify
  'ᱵᱟᱪᱷᱟᱣ': 'bachhaw',            // Select / choose
  'ᱵᱟᱪᱷᱟᱣ ᱢᱮ': 'bachhaw me',       // Select it
  'ᱦᱟᱨᱱᱮᱥ': 'harness',            // Harness
  'ᱞᱟᱹᱠᱛᱤᱭᱟ': 'laaktiya',          // Required
  'ᱵᱟᱝ': 'baang',                 // No / not
  'ᱪᱮᱫᱟᱜ': 'chedaak',             // Why
  'ᱪᱮᱫ': 'ched',                  // What
  'ᱞᱚᱜᱚᱱ': 'logon',               // Quickly / immediately
  'ᱠᱩᱠᱞᱤ': 'kukli',               // Question
  'ᱯᱩᱭᱞᱩ': 'puylu',               // First / Option 1
  'ᱫᱚᱥᱟᱨ': 'dosar',               // Second / Option 2
  'ᱛᱮᱥᱟᱨ': 'tesar',               // Third / Option 3
  'ᱯᱩᱱᱟᱜ': 'punag',               // Fourth / Option 4
  'ᱴᱷᱤᱠ': 'thik',                 // Correct
  'ᱵᱷᱩᱞ': 'bhul',                 // Wrong / incorrect
  'ᱠᱚᱭᱞᱟ': 'koyla',               // Coal
  'ᱠᱷᱟᱫᱟᱱ ᱨᱮ': 'khaadan re',      // In the mine
  'ᱡᱚᱦᱟᱨ': 'johar'                // Greetings / Namaste
};

/**
 * Transliterates text containing Ol Chiki characters or Santali phrases
 * into high-fidelity phonetic Latin/Devanagari strings that standard SpeechSynthesis
 * engines (e.g., hi-IN or en-IN) can fluently pronounce.
 */
export function transliterateSantaliForSpeech(text: string): string {
  if (!text) return '';

  let processed = text;

  // 1. Replace pre-mapped compound vocabulary words
  for (const [olChikiWord, phonetic] of Object.entries(SANTALI_VOCAB_PHONETICS)) {
    processed = processed.split(olChikiWord).join(phonetic + ' ');
  }

  // 2. Transliterate any remaining individual Ol Chiki characters
  let charResult = '';
  for (let i = 0; i < processed.length; i++) {
    const char = processed[i];
    if (OL_CHIKI_MAP[char] !== undefined) {
      charResult += OL_CHIKI_MAP[char];
    } else {
      charResult += char;
    }
  }

  // 3. Clean up duplicate spaces and format for smooth cadence
  return charResult
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*/g, '$1 ')
    .trim();
}
