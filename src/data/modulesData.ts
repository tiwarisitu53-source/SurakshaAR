import { SafetyModule } from '../types';

export const safetyModules: SafetyModule[] = [
  {
    id: 'fire_explosion',
    badge: '🔥 Module 1',
    durationMinutes: 8,
    hazardCategory: 'Flammable Liquids & Electrical Fire (Class B/C)',
    isAvailable: true,
    requiredPassingScore: 70,
    title: {
      en: 'Fire & Explosion Emergency Response',
      hi: 'अग्नि एवं विस्फोट आपातकालीन प्रतिक्रिया',
      sat: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱚᱢᱵᱽ ᱵᱚᱛᱚᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ (Fire & Explosion)'
    },
    description: {
      en: 'Learn to scan industrial environments, classify electrical/chemical fires, perform the P.A.S.S. extinguisher sequence, and evacuate via the correct clear exit.',
      hi: 'औद्योगिक संयंत्र में आग को पहचानना, सही अग्निशामक का चुनाव, PASS विधि से आग बुझाना और सुरक्षित आपातकालीन निकास से बाहर निकलना सीखें।',
      sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ, ᱴᱷᱤᱠ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ, PASS ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱩᱣᱟᱹᱨ ᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱪᱮᱫᱚᱜ ᱢᱮ।'
    },
    steps: [
      {
        id: 'fe_step_1',
        stepNumber: 1,
        title: {
          en: 'Scan Industrial Floor & Detect AR Plane',
          hi: 'फर्श को स्कैन करें और AR धरातल स्थापित करें',
          sat: 'ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ ᱟᱨ AR ᱴᱷᱟᱶ ᱵᱮᱱᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Aim your camera towards the floor and move slowly in a circular motion until the green grid reticle anchors on the surface.',
          hi: 'अपने कैमरे को फर्श की ओर घुमाएं जब तक कि हरी AR ग्रिड धरातल पर स्थिर न हो जाए।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ ᱡᱟᱦᱟᱸ ᱛᱤᱱ ᱦᱟᱹᱵᱤᱡ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱜᱽᱨᱤᱰ AR ᱚᱛ ᱨᱮ ᱵᱟᱝ ᱴᱷᱟᱶᱚᱜ-ᱟ᱾'
        },
        audioPrompt: {
          en: 'Point the camera at the workshop floor. Move it slowly to lock the AR ground surface.',
          hi: 'कैमरे को कार्यशाला के फर्श की ओर करें और धीरे-धीरे घुमाकर सतह को लॉक करें।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ ᱟᱨ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱴᱷᱟᱶ ᱛᱮᱭᱟᱨ ᱢᱮ᱾'
        },
        actionRequired: 'scan_floor',
        hint: {
          en: 'Ensure adequate lighting and keep phone tilted at 45 degrees towards the floor.',
          hi: 'पर्याप्त रोशनी रखें और फोन को फर्श की ओर 45 डिग्री झुकाएं।',
          sat: 'ᱢᱟᱨᱥᱟᱞ ᱴᱷᱟᱶ ᱨᱮ ᱠᱮᱢᱮᱨᱟ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'AR Spatial anchor locked! Simulated fire outbreak detected.',
          hi: 'धरातल लॉक हो गया! सिमुलेटेड आग का प्रकोप पाया गया।',
          sat: 'AR ᱴᱷᱟᱶ ᱞᱟᱜᱟᱣ ᱮᱱᱟ! ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱧᱟᱢ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Keep camera steady towards the floor.',
          hi: 'कैमरे को फर्श की ओर स्थिर रखें।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱥᱚᱡᱷᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        }
      },
      {
        id: 'fe_step_2',
        stepNumber: 2,
        title: {
          en: 'Analyze Fire Class & Activate Alarm',
          hi: 'आग की श्रेणी पहचानें और आपातकालीन अलार्म बजाएं',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ ᱟᱨ ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ'
        },
        instruction: {
          en: 'The fire originates from an energized 440V transformer panel and hydraulic oil barrels (Class B & C). Tap the Emergency Alarm station immediately.',
          hi: 'यह आग 440V विद्युत ट्रांसफार्मर और हाइड्रो लिक तेल (Class B & C) में लगी है। तुरंत लाल आपातकालीन अलार्म बटन दबाएं।',
          sat: 'ᱱᱚᱶᱟ ᱥᱮᱸᱜᱮᱞ ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱛᱮᱞ (Class B & C) ᱠᱷᱚᱱ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾ ᱞᱚᱜᱚᱱ ᱟᱞᱟᱨᱢ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        warning: {
          en: 'DANGER: NEVER use water on live electrical or flammable oil fires!',
          hi: 'सावधान: बिजली या तेल की आग पर कभी भी पानी न डालें, भारी झटका या विस्फोट होगा!',
          sat: 'ᱥᱟᱹᱠᱷᱭᱟᱹᱛ: ᱵᱤᱡᱽᱞᱤ ᱥᱮ ᱛᱮᱞ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱟᱞᱚᱢ ᱫᱩᱞᱟ, ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣᱜ-ᱟ!'
        },
        audioPrompt: {
          en: 'Electrical transformer fire detected. Press the emergency alarm switch to alert your co-workers.',
          hi: 'विद्युत ट्रांसफार्मर में आग लगी है। सभी साथियों को सावधान करने के लिए तुरंत लाल अलार्म दबाएं।',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱮᱱᱟ᱾ ᱜᱟᱛᱮ ᱠᱚ ᱦᱚᱦᱚᱣᱟᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        actionRequired: 'raise_alarm',
        hint: {
          en: 'Tap the glowing red manual pull station box in the AR view.',
          hi: 'AR स्क्रीन में चमकते हुए लाल अलार्म बॉक्स पर टैप करें।',
          sat: 'AR ᱨᱮ ᱟᱨᱟᱜ ᱟᱞᱟᱨᱢ ᱵᱚᱠᱥ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Facility evacuation siren activated! Plant safety control room alerted.',
          hi: 'संयंत्र सायरन बज उठा! आपातकालीन नियंत्रण कक्ष को सूचना मिल गई।',
          sat: 'ᱟᱞᱟᱨᱢ ᱥᱟᱰᱮ ᱮᱱᱟ! ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱵᱟᱰᱟᱭ ᱧᱟᱢ ᱠᱮᱫ-ᱟ᱾'
        },
        feedbackWrong: {
          en: 'You must sound the alarm before attempting suppression!',
          hi: 'आग बुझाने से पहले अलार्म बजाना अनिवार्य है!',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱟᱬᱟᱝ ᱨᱮ ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ!'
        }
      },
      {
        id: 'fe_step_3',
        stepNumber: 3,
        title: {
          en: 'Select the Correct Fire Extinguisher',
          hi: 'उचित अग्निशामक यंत्र (Extinguisher) चुनें',
          sat: 'ᱴᱷᱤᱠ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Examine the 3 extinguishers in the AR rack: Water (Red/Blue), Carbon Dioxide CO2 (Black Label), and Dry Chemical Powder DCP (Blue/Yellow). Select the correct non-conductive agent.',
          hi: 'तीन यंत्रों में से सही चुनें: पानी, CO2 (कार्बन डाइऑक्साइड) या सूखा पाउडर (DCP)। बिजली की आग के लिए CO2 या DCP चुनें।',
          sat: 'ᱯᱮᱭᱟ ᱢᱤᱥᱤᱱ ᱢᱩᱫᱽ ᱨᱮ CO2 ᱥᱮ DCP ᱵᱟᱪᱷᱟᱣ ᱢᱮ, ᱫᱟᱜ ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱨᱮ ᱵᱟᱝ ᱜᱟᱱᱚᱜ-ᱟ᱾'
        },
        audioPrompt: {
          en: 'Select the Dry Chemical Powder or CO2 extinguisher. Do not choose water.',
          hi: 'सूखा पाउडर (DCP) या CO2 अग्निशामक चुनें। पानी का यंत्र कभी न चुनें।',
          sat: 'DCP ᱥᱮ CO2 ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾'
        },
        actionRequired: 'select_extinguisher',
        hint: {
          en: 'Tap on the Dry Chemical Powder (DCP) or CO2 cylinder.',
          hi: 'DCP या CO2 वाले सिलेंडर पर टैप करें।',
          sat: 'DCP ᱥᱮ CO2 ᱴᱤᱬ ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Correct choice! DCP / CO2 is safe for energized electrical panels & fuel fires.',
          hi: 'सही चुनाव! DCP/CO2 बिजली और तेल की आग के लिए पूर्णतः सुरक्षित है।',
          sat: 'ᱴᱷᱤᱠ ᱵᱟᱪᱷᱟᱣ! DCP/CO2 ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱥᱩᱨᱚᱠᱥᱤᱛ ᱜᱮᱭᱟ᱾'
        },
        feedbackWrong: {
          en: 'Incorrect! Water conducts electricity and will electrocute the operator.',
          hi: 'गलत! पानी से करंट लग सकता है और तेल फैलकर आग बढ़ा देगा।',
          sat: 'ᱵᱷᱩᱞ! ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣᱜ-ᱟ᱾'
        }
      },
      {
        id: 'fe_step_4',
        stepNumber: 4,
        title: {
          en: 'Perform P.A.S.S. Extinguishing Sequence',
          hi: 'PASS विधि द्वारा आग बुझाने का अभ्यास करें',
          sat: 'PASS ᱱᱤᱭᱚᱢ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱮ (Pull-Aim-Squeeze-Sweep)'
        },
        instruction: {
          en: 'Execute the 4 steps in exact order:\n1. PULL the safety pin\n2. AIM low at the base of flames\n3. SQUEEZE the lever handle\n4. SWEEP side-to-side across the base until fire is suppressed.',
          hi: 'क्रम से चारों चरण पूरे करें:\n1. पिन खींचें (PULL)\n2. आग की जड़ पर निशाना लगाएं (AIM)\n3. लीवर दबाएं (SQUEEZE)\n4. झाड़ू की तरह दाएं-बाएं घुमाएं (SWEEP)',
          sat: 'ᱯᱩᱱᱭᱟᱹ ᱠᱟᱹᱢᱤ ᱞᱟᱦᱟ-ᱛᱟᱭᱚᱢ ᱠᱚᱨᱟᱣ ᱢᱮ:\n1. ᱯᱤᱱ ᱚᱨ ᱢᱮ (Pull)\n2. ᱥᱮᱸᱜᱮᱞ ᱵᱩᱴᱟᱹ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱢᱮ (Aim)\n3. ᱦᱮᱱᱰᱮᱞ ᱚᱛᱟᱭ ᱢᱮ (Squeeze)\n4. ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱟᱹᱪᱩᱨ ᱢᱮ (Sweep)'
        },
        audioPrompt: {
          en: 'Perform PASS: Pull pin, Aim at base, Squeeze lever, Sweep side to side.',
          hi: 'PASS विधि: पिन खींचें, आग की जड़ पर निशाना लगाएं, हैंडल दबाएं और झाड़ू की तरह घुमाएं।',
          sat: 'PASS ᱠᱚᱨᱟᱣ ᱢᱮ: ᱯᱤᱱ ᱚᱨ ᱢᱮ, ᱞᱟᱛᱟᱨ ᱨᱮ ᱥᱚᱡᱷᱮ ᱢᱮ, ᱦᱮᱱᱰᱮᱞ ᱚᱛᱟᱭ ᱢᱮ, ᱟᱹᱪᱩᱨ ᱢᱮ᱾'
        },
        actionRequired: 'pass_sweep',
        hint: {
          en: 'Use the interactive AR buttons: Pull -> Aim -> Squeeze -> Sweep.',
          hi: 'स्क्रीन पर दिए गए 4 चरणों को क्रम से दबाएं।',
          sat: 'ᱥᱠᱨᱤᱱ ᱨᱮ Pull -> Aim -> Squeeze -> Sweep ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Fire successfully extinguished! Chemical blanket deployed over the fuel source.',
          hi: 'शानदार! आग पूरी तरह बुझ गई है और रासायनिक परत ने ईंधन को ढक दिया है।',
          sat: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Follow exact PASS order: Pull -> Aim -> Squeeze -> Sweep.',
          hi: 'क्रम का ध्यान रखें: पहले पिन निकालें, फिर निशाना लगाएं, फिर दबाएं और घुमाएं।',
          sat: 'ᱴᱷᱤᱠ ᱥᱤᱨᱤᱡᱽ ᱛᱮ ᱠᱚᱨᱟᱣ ᱢᱮ: Pull -> Aim -> Squeeze -> Sweep'
        }
      },
      {
        id: 'fe_step_5',
        stepNumber: 5,
        title: {
          en: 'Identify the Safe Emergency Evacuation Exit',
          hi: 'सुरक्षित आपातकालीन निकास द्वार की पहचान करें',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱫᱩᱣᱟᱹᱨ (Exit) ᱯᱟᱸᱡᱟᱭ ᱢᱮ'
        },
        instruction: {
          en: 'Look around in the AR space. Exit 1 is blocked by collapsed steel beams. Exit 3 leads into the combustible chemical storage. Tap Exit 2 (Green emergency illuminated exit leading to assembly ground).',
          hi: 'AR कक्ष में निकास पहचानें। निकास 1 मलबे से बंद है। निकास 3 में रासायनिक गैस है। हरा चमकता निकास 2 (Exit 2) चुनें।',
          sat: 'AR ᱨᱮ Exit ᱯᱟᱸᱡᱟᱭ ᱢᱮ᱾ Exit 1 ᱫᱚ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ, Exit 3 ᱫᱚ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ᱾ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱵᱟᱹᱛᱤ ᱡᱩᱞᱩᱜ ᱠᱟᱱ Exit 2 ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Identify and tap the unobstructed green illuminated Exit 2 to safely evacuate.',
          hi: 'सुरक्षित बाहर निकलने के लिए हरे रंग के प्रकाशित निकास 2 पर टैप करें।',
          sat: 'ᱦᱟᱹᱨᱤᱭᱟᱹᱲ Exit 2 ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱛᱟ ᱠᱟᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ᱾'
        },
        actionRequired: 'select_safe_exit',
        hint: {
          en: 'Tap on Exit Door #2 marked with illuminated green running-man sign.',
          hi: 'हरे आपातकालीन संकेत वाले निकास द्वार #2 पर टैप करें।',
          sat: 'ᱦᱟᱹᱨᱤᱭᱟᱹᱲ Exit 2 ᱫᱩᱣᱟᱹᱨ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Evacuation Successful! You have reached the Safe Assembly Muster Point.',
          hi: 'सफल निकास! आप सुरक्षित एकत्रण स्थल (Assembly Point) पर पहुँच गए हैं।',
          sat: 'ᱥᱩᱨᱚᱠᱥᱤᱛ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱮᱱᱟᱢ! ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ᱾'
        },
        feedbackWrong: {
          en: 'Hazard! That exit is either blocked by smoke or dangerous machinery.',
          hi: 'खतरा! वह द्वार बंद है या वहां जहरीला धुआं भरा है।',
          sat: 'ᱵᱚᱛᱚᱨ! ᱚᱱᱟ ᱫᱩᱣᱟᱹᱨ ᱫᱚ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ ᱥᱮ ᱥᱮᱸᱜᱮᱞ ᱢᱮᱱᱟᱜ-ᱟ᱾'
        }
      }
    ],
    assessmentQuestions: [
      {
        id: 'fe_q1',
        type: 'mcq',
        prompt: {
          en: 'Why must you NEVER use a Water Extinguisher on a Class C Electrical Panel Fire?',
          hi: 'Class C विद्युत पैनल की आग पर पानी के अग्निशामक का प्रयोग क्यों कभी नहीं करना चाहिए?',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ (Class C) ᱨᱮ ᱫᱟᱜ ᱪᱮᱫᱟᱜ ᱵᱟᱝ ᱫᱩᱞ ᱞᱟᱹᱠᱛᱤᱭᱟ?'
        },
        audioPrompt: {
          en: 'Why should you never use water on an electrical panel fire?',
          hi: 'बिजली की आग पर पानी क्यों नहीं डालना चाहिए?',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱪᱮᱫᱟᱜ ᱵᱟᱝ ᱞᱟᱜᱟᱣ ᱫᱚᱨᱠᱟᱨ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Water is conductive and can cause fatal electrocution to the firefighter',
              hi: 'पानी विद्युत का सुचालक है जिससे प्राणघातक करंट लग सकता है',
              sat: 'ᱫᱟᱜ ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱥᱟᱵᱟ, ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱟᱨᱮᱱᱴ ᱛᱮ ᱜᱩᱡᱩᱜ-ᱟ'
            },
            isCorrect: true,
            explanation: {
              en: 'Water conducts electric current back through the stream, causing lethal shock.',
              hi: 'पानी की धार से करंट प्रवाहित होकर ऑपरेटर को मार सकता है।',
              sat: 'ᱫᱟᱜ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱦᱚᱲᱢᱚ ᱨᱮ ᱯᱟᱥᱱᱟᱣᱜ-ᱟ᱾'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Water creates too much steam which makes the room humid',
              hi: 'पानी से अत्यधिक भाप बनती है जिससे कमरा गर्म हो जाता है',
              sat: 'ᱫᱟᱜ ᱛᱮ ᱵᱷᱟᱯ ᱵᱮᱱᱟᱣᱜ-ᱟ'
            },
            isCorrect: false,
            explanation: {
              en: 'Steam is not the primary life-threatening hazard.',
              hi: 'यह मुख्य खतरा नहीं है।',
              sat: 'ᱱᱚᱶᱟ ᱫᱚ ᱢᱩᱬᱩᱛ ᱠᱟᱨᱚᱱ ᱵᱟᱝ ᱠᱟᱱᱟ᱾'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Water extinguishes fires too fast and damages the metal paint',
              hi: 'पानी आग को बहुत जल्दी बुझाकर पेंट खराब कर देता है',
              sat: 'ᱫᱟᱜ ᱛᱮ ᱨᱚᱝ ᱠᱷᱟᱨᱟᱯᱚᱜ-ᱟ'
            },
            isCorrect: false,
            explanation: {
              en: 'Incorrect logic.',
              hi: 'गलत उत्तर।',
              sat: 'ᱵᱷᱩᱞ ᱩᱛᱟᱹᱨ᱾'
            }
          }
        ],
        explanation: {
          en: 'Always use Dry Chemical Powder (ABC/DCP) or Carbon Dioxide (CO2) on energized electrical equipment to prevent electrocution.',
          hi: 'विद्युत उपकरणों पर हमेशा DCP या CO2 का उपयोग करें ताकि करंट न लगे।',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱡᱟᱣᱜᱮ DCP ᱥᱮ CO2 ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾'
        }
      },
      {
        id: 'fe_q2',
        type: 'sequence',
        prompt: {
          en: 'Arrange the correct P.A.S.S. fire extinguishing sequence in order:',
          hi: 'अग्निशामक चलाने की सही PASS विधि को सही क्रम में व्यवस्थित करें:',
          sat: 'PASS ᱱᱤᱭᱚᱢ ᱨᱮᱭᱟᱜ ᱥᱤᱨᱤᱡᱽ ᱴᱷᱤᱠ ᱞᱮᱠᱟᱛᱮ ᱥᱟᱡᱟᱣ ᱢᱮ:'
        },
        audioPrompt: {
          en: 'Order the PASS sequence: Pull, Aim, Squeeze, Sweep.',
          hi: 'PASS का सही क्रम चुनें: पिन निकालें, निशाना लगाएं, दबाएं, घुमाएं।',
          sat: 'PASS ᱨᱮᱭᱟᱜ ᱥᱤᱨᱤᱡᱽ ᱴᱷᱤᱠ ᱢᱮ᱾'
        },
        sequenceItems: [
          {
            id: 'seq_p',
            text: {
              en: '1. PULL the safety pin and seal',
              hi: '1. PULL: सुरक्षा पिन और सील को खींचकर निकालें',
              sat: '1. PULL: ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱤᱱ ᱚᱨ ᱚᱰᱚᱠ ᱢᱮ'
            },
            correctOrder: 1
          },
          {
            id: 'seq_a',
            text: {
              en: '2. AIM low at the base of the fire (not top of flames)',
              hi: '2. AIM: आग की जड़/निचले हिस्से पर निशाना लगाएं',
              sat: '2. AIM: ᱥᱮᱸᱜᱮᱞ ᱵᱩᱴᱟᱹ/ᱞᱟᱛᱟᱨ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱢᱮ'
            },
            correctOrder: 2
          },
          {
            id: 'seq_s1',
            text: {
              en: '3. SQUEEZE the operating lever smoothly',
              hi: '3. SQUEEZE: ऑपरेटिंग लीवर को दबाएं',
              sat: '3. SQUEEZE: ᱦᱮᱱᱰᱮᱞ ᱚᱛᱟᱭ ᱢᱮ'
            },
            correctOrder: 3
          },
          {
            id: 'seq_s2',
            text: {
              en: '4. SWEEP the nozzle side-to-side across the fuel',
              hi: '4. SWEEP: नोजल को दाएं-बाएं झाड़ू की तरह घुमाएं',
              sat: '4. SWEEP: ᱱᱳᱡᱚᱞ ᱫᱚ ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱟᱹᱪᱩᱨ ᱢᱮ'
            },
            correctOrder: 4
          }
        ],
        explanation: {
          en: 'P.A.S.S. stands for Pull, Aim at base, Squeeze lever, Sweep side-to-side.',
          hi: 'PASS का पूर्ण रूप है: Pull (पिन निकालें), Aim (निशाना), Squeeze (दबाएं), Sweep (झाड़ू की तरह घुमाएं)।',
          sat: 'PASS ᱢᱮᱱᱮᱛ: Pull, Aim, Squeeze, Sweep ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'fe_q3',
        type: 'mcq',
        prompt: {
          en: 'When evacuating a smoky industrial hall, what is the safest posture?',
          hi: 'धुएं से भरे औद्योगिक हॉल से बाहर निकलते समय शरीर की सबसे सुरक्षित मुद्रा क्या है?',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱯᱮᱨᱮᱡ ᱠᱟᱹᱨᱜᱟᱲ ᱠᱷᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱡᱚᱠᱷᱮᱡ ᱪᱮᱫ ᱞᱮᱠᱟ ᱥᱮᱱᱚᱜ ᱞᱟᱹᱠᱛᱤ?'
        },
        audioPrompt: {
          en: 'What is the safest posture when moving through heavy smoke?',
          hi: 'भारी धुएं में चलते समय सबसे सुरक्षित तरीका क्या है?',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱛᱟᱞᱟ ᱛᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱚᱰᱚᱠᱚᱜ ᱫᱚᱨᱠᱟᱨ?'
        },
        options: [
          {
            id: 'opt_crawl',
            text: {
              en: 'Stay low and crawl (Clean breathable air stays in the lower 12-24 inches)',
              hi: 'नीचे झुककर या रेंगकर चलें (साफ हवा फर्श से 1-2 फीट ऊपर रहती है)',
              sat: 'ᱞᱟᱛᱟᱨ ᱠᱩᱵᱽᱡᱟᱹ ᱠᱟᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ (ᱯᱷᱟᱨᱪᱟ ᱦᱚᱭ ᱚᱛ ᱪᱮᱛᱟᱱ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ)'
            },
            isCorrect: true,
            explanation: {
              en: 'Heated toxic gases rise to the ceiling; breathable oxygen remains closest to the floor.',
              hi: 'जहरीली गैसें गर्म होकर ऊपर उठती हैं, शुद्ध हवा नीचे फर्श के पास रहती है।',
              sat: 'ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ, ᱚᱛ ᱥᱩᱨ ᱨᱮ ᱯᱷᱟᱨᱪᱟ ᱦᱚᱭ ᱛᱟᱦᱮᱸᱱᱟ᱾'
            }
          },
          {
            id: 'opt_run_fast',
            text: {
              en: 'Stand tall and sprint as fast as possible',
              hi: 'सीधे खड़े होकर पूरी ताकत से दौड़ें',
              sat: 'ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱞᱚᱜᱚᱱ ᱫᱟᱹᱲ ᱢᱮ'
            },
            isCorrect: false,
            explanation: {
              en: 'Standing exposes lungs to superheated carbon monoxide and cyanide smoke.',
              hi: 'खड़े होकर चलने से जहरीली गैसें फेफड़ों में भर जाएंगी।',
              sat: 'ᱛᱤᱸᱜᱩ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱥᱟᱦᱮᱫ ᱨᱮ ᱵᱚᱞᱚᱜ-ᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Crawl below the smoke layer to prevent toxic asphyxiation.',
          hi: 'धुएं के नीचे झुककर चलने से दम घुटने से बचा जा सकता है।',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱞᱟᱛᱟᱨ ᱛᱮ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱢᱮ᱾'
        }
      },
      {
        id: 'fe_q4',
        type: 'mcq',
        prompt: {
          en: 'Scenario: You detect an industrial transformer sparking violently with transformer oil burning. What is the MANDATORY first step before attempting fire suppression?',
          hi: 'परिदृश्य: आप एक औद्योगिक ट्रांसफार्मर में तेज चिंगारियों के साथ तेल में आग लगी देखते हैं। आग बुझाने का प्रयास करने से पहले अनिवार्य पहला कदम क्या है?',
          sat: 'ᱥᱤᱱᱟᱨᱤᱭᱳ: 440V ᱴᱨᱟᱱᱥᱯᱷᱚᱨᱢᱟᱨ ᱨᱮ ᱥᱯᱟᱨᱠ ᱟᱨ ᱥᱩᱱᱩᱢ ᱡᱩᱞᱩᱜ ᱠᱟᱱᱟ᱾ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱞᱟᱦᱟ ᱨᱮ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱚᱨᱟᱣ ᱞᱟᱹᱠᱛᱤ?'
        },
        audioPrompt: {
          en: 'What is the mandatory first step when encountering a transformer electrical fire?',
          hi: 'ट्रांसफार्मर में आग लगने पर सबसे पहला कदम क्या होना चाहिए?',
          sat: 'ᱴᱨᱟᱱᱥᱯᱷᱚᱨᱢᱟᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱚᱨᱟᱣ ᱫᱚᱨᱠᱟᱨ?'
        },
        options: [
          {
            id: 'fe4_opt_alarm',
            text: {
              en: 'Sound the manual fire alarm call point & notify electrical control room to isolate power',
              hi: 'मैनुअल फायर अलार्म दबाएं और बिजली काटने के लिए नियंत्रण कक्ष को तुरंत सूचित करें',
              sat: 'ᱢᱮᱱᱩᱣᱟᱞ ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ ᱟᱨ ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱠᱚᱱᱴᱨᱳᱞ ᱨᱩᱢ ᱠᱷᱚᱵᱚᱨ ᱮᱢᱟᱭ ᱢᱮ'
            },
            isCorrect: true,
            explanation: {
              en: 'Raising the plant-wide alarm and cutting energized circuits is mandatory before approaching any electrical fire.',
              hi: 'विद्युत आग के पास जाने से पहले अलार्म बजाना और बिजली काटी जाना सबसे महत्वपूर्ण है।',
              sat: 'ᱟᱞᱟᱨᱢ ᱵᱟᱡᱟᱣ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱜᱮ ᱯᱩᱭᱞᱩ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾'
            }
          },
          {
            id: 'fe4_opt_alone',
            text: {
              en: 'Pick up any available extinguisher and run directly into the smoke alone without sounding an alarm',
              hi: 'अलार्म बजाए बिना अकेले ही किसी भी अग्निशामक को लेकर धुएं में दौड़ जाएं',
              sat: 'ᱟᱞᱟᱨᱢ ᱵᱟᱝ ᱵᱟᱡᱟᱣ ᱠᱟᱛᱮ ᱮᱠᱞᱟ ᱜᱮ ᱫᱷᱩᱶᱟᱹ ᱛᱮ ᱫᱟᱹᱲ ᱢᱮ'
            },
            isCorrect: false,
            explanation: {
              en: 'Never fight industrial fires alone without sounding the plant alarm first.',
              hi: 'अलार्म बजाए बिना अकेले आग बुझाने की कोशिश करना अत्यंत घातक है।',
              sat: 'ᱟᱞᱟᱨᱢ ᱵᱟᱝ ᱵᱟᱡᱟᱣ ᱠᱟᱛᱮ ᱮᱠᱞᱟ ᱥᱮᱸᱜᱮᱞ ᱥᱟᱶ ᱞᱟᱹᱲᱦᱟᱹᱭ ᱵᱟᱝ ᱴᱷᱤᱠᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Emergency notification and isolating live voltage circuits protect both emergency responders and plant personnel.',
          hi: 'आपातकालीन सूचना और विद्युत विच्छेदन जीवन रक्षा के लिए अनिवार्य है।',
          sat: 'ᱞᱟᱦᱟ ᱨᱮ ᱟᱞᱟᱨᱢ ᱵᱟᱡᱟᱣ ᱟᱨ ᱠᱟᱨᱮᱱᱴ ᱠᱟᱴᱟᱣ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱡᱟᱹᱨᱩᱲ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'fe_q5',
        type: 'mcq',
        prompt: {
          en: 'Safety Decision: A Dry Chemical Powder (DCP) extinguisher has its pressure gauge needle in the RED recharge section. Can you safely rely on it?',
          hi: 'सुरक्षा निर्णय: एक DCP अग्निशामक का प्रेशर गेज कांटा लाल (RED Recharge) क्षेत्र में है। क्या आप इस पर भरोसा कर सकते हैं?',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱪᱟᱹᱨ: ᱢᱤᱫᱴᱟᱝ DCP ᱤᱬᱤᱡᱤᱡ ᱨᱮᱭᱟᱜ ᱜᱮᱡᱽ ᱠᱟᱸᱴᱟ ᱟᱨᱟᱜ (RED) ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ᱾ ᱱᱚᱶᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱜᱟᱱᱚᱜ-ᱟ?'
        },
        audioPrompt: {
          en: 'Can you use a fire extinguisher if its pressure needle is in the red zone?',
          hi: 'यदि प्रेशर गेज लाल क्षेत्र में हो तो क्या अग्निशामक का उपयोग किया जा सकता है?',
          sat: 'ᱜᱮᱡᱽ ᱠᱟᱸᱴᱟ ᱟᱨᱟᱜ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱨᱮ ᱪᱮᱫ ᱱᱚᱶᱟ ᱵᱮᱵᱷᱟᱨ ᱜᱟᱱᱚᱜ-ᱟ?'
        },
        options: [
          {
            id: 'fe5_opt_red_unsafe',
            text: {
              en: 'No, depressurized cylinders will fail to expel chemical powder onto the flame base',
              hi: 'नहीं, कम दबाव वाला सिलेंडर रासायनिक पाउडर बाहर नहीं फेंक पाएगा और आग नहीं बुझेगी',
              sat: 'ᱵᱟᱝ, ᱯᱨᱮᱥᱟᱨ ᱠᱚᱢ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱹᱛᱤᱨ ᱠᱮᱢᱤᱠᱟᱞ ᱯᱟᱣᱰᱟᱨ ᱵᱟᱦᱨᱮ ᱵᱟᱝ ᱚᱰᱚᱠᱚᱜ-ᱟ'
            },
            isCorrect: true,
            explanation: {
              en: 'Gauge needle in red indicates lost nitrogen expellant charge. Cylinder must be tagged Out of Service.',
              hi: 'लाल क्षेत्र का मतलब है नाइट्रोजन गैस का दबाव खत्म हो चुका है। इसे तुरंत सर्विस के लिए भेजें।',
              sat: 'ᱟᱨᱟᱜ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱯᱨᱮᱥᱟᱨ ᱪᱟᱵᱟ ᱟᱠᱟᱱᱟ, ᱱᱚᱶᱟ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ᱾'
            }
          },
          {
            id: 'fe5_opt_red_safe',
            text: {
              en: 'Yes, as long as the cylinder is heavy you can shake it upside-down and use it',
              hi: 'हाँ, अगर सिलेंडर भारी है तो इसे उल्टा हिलाकर इस्तेमाल किया जा सकता है',
              sat: 'ᱦᱚᱭ, ᱩᱞᱴᱟᱹ ᱦᱤᱞᱟᱹᱣ ᱠᱟᱛᱮ ᱵᱮᱵᱷᱟᱨ ᱜᱟᱱᱚᱜ-ᱟ'
            },
            isCorrect: false,
            explanation: {
              en: 'Shaking does not restore pneumatic pressure needed to spray powder.',
              hi: 'हिलाने से दबाव वापस नहीं आता।',
              sat: 'ᱦᱤᱞᱟᱹᱣ ᱞᱮᱠᱷᱟᱱ ᱯᱨᱮᱥᱟᱨ ᱵᱟᱝ ᱦᱤᱡᱩᱜ-ᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Only extinguishers with the pressure needle in the GREEN zone have sufficient working pressure.',
          hi: 'केवल हरे (GREEN) क्षेत्र में सुई होने पर ही अग्निशामक सही काम करेगा।',
          sat: 'ᱡᱟᱦᱟᱸ ᱨᱮ ᱠᱟᱸᱴᱟ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ (GREEN) ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ, ᱚᱱᱟ ᱜᱮ ᱴᱷᱤᱠ ᱠᱟᱹᱢᱤᱭᱟ᱾'
        }
      }
    ]
  },
  {
    id: 'gas_confined_space',
    badge: '⚠️ Module 2',
    durationMinutes: 9,
    hazardCategory: 'Toxic Gases (H2S, CH4, CO) & Confined Space Safety',
    isAvailable: true,
    requiredPassingScore: 70,
    title: {
      en: 'Gas Leak & Confined Space Protocol',
      hi: 'गैस रिसाव एवं संकीर्ण स्थान (Confined Space) सुरक्षा',
      sat: 'ᱵᱤᱥ ᱦᱚᱭ (Gas Leak) ᱟᱨ ᱥᱟᱸᱜᱤᱧ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ'
    },
    description: {
      en: 'Master multi-gas atmospheric testing, Self-Contained Breathing Apparatus (SCBA) inspection, Standby Buddy communication, and explosive limit hazard identification in underground mines.',
      hi: 'मल्टी-गैस डिटेक्टर से जहरीली गैस जांचना, SCBA श्वसन किट पहनना, बडी (साथी) प्रणाली और संकीर्ण खदान में सुरक्षित प्रवेश का अभ्यास करें।',
      sat: 'ᱢᱟᱞᱴᱤ-ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱧᱮᱞ, SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ, ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱶ ᱡᱚᱯᱲᱟᱣ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱥᱮᱪᱮᱫ।'
    },
    steps: [
      {
        id: 'gl_step_1',
        stepNumber: 1,
        title: {
          en: 'Scan Confined Chamber Entrance',
          hi: 'संकीर्ण कक्ष / मैनहोल प्रवेश द्वार को स्कैन करें',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱫᱩᱣᱟᱹᱨ ᱥᱠᱮᱱ ᱢᱮ ᱟᱨ AR ᱴᱷᱟᱶ ᱵᱮᱱᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Point camera at the underground mine shaft entry portal and establish the AR spatial coordinate plane.',
          hi: 'कैमरे को भूमिगत खदान या संकीर्ण प्रवेश द्वार की ओर घुमाएं और AR धरातल लॉक करें।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱫᱩᱣᱟᱹᱨ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ ᱟᱨ ᱴᱷᱟᱶ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Scan the chamber portal to initialize the gas testing environment.',
          hi: 'गैस जांच वातावरण शुरू करने के लिए प्रवेश द्वार को स्कैन करें।',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱫᱩᱣᱟᱹᱨ ᱥᱠᱮᱱ ᱠᱟᱛᱮ AR ᱴᱷᱟᱶ ᱛᱮᱭᱟᱨ ᱢᱮ᱾'
        },
        actionRequired: 'scan_floor',
        hint: {
          en: 'Keep camera focused on the entrance boundary.',
          hi: 'कैमरे को प्रवेश द्वार के चारों ओर केंद्रित रखें।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱫᱩᱣᱟᱹᱨ ᱥᱮᱫ ᱥᱚᱡᱷᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Chamber portal anchored! Gas stratification simulation initiated.',
          hi: 'प्रवेश द्वार लॉक हो गया! गैस फैलाव सिमुलेशन शुरू हुआ।',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱫᱩᱣᱟᱹᱨ ᱞᱟᱜᱟᱣ ᱮᱱᱟ! ᱜᱮᱥ ᱧᱮᱞ ᱮᱦᱚᱵ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Scan the floor area near the entrance.',
          hi: 'प्रवेश द्वार के पास के फर्श को स्कैन करें।',
          sat: 'ᱫᱩᱣᱟᱹᱨ ᱥᱩᱨ ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ᱾'
        }
      },
      {
        id: 'gl_step_2',
        stepNumber: 2,
        title: {
          en: 'Calibrate & Read Multi-Gas Detector',
          hi: 'मल्टी-गैस डिटेक्टर से वायुमंडलीय परीक्षण करें',
          sat: 'ᱢᱟᱞᱴᱤ-ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱯᱟᱲᱦᱟᱣ ᱢᱮ (Gas Detector)'
        },
        instruction: {
          en: 'Lower the AR gas detector probe into the chamber. Observe:\n• Oxygen (O2): 16.8% (DEFICIENT! Normal: 20.9%)\n• Hydrogen Sulfide (H2S): 24 PPM (LETHAL TOXIC! Limit: 10 PPM)\n• Methane (CH4): 22% LEL (EXPLOSION RISK!).',
          hi: 'गैस डिटेक्टर की जांच करें:\n• ऑक्सीजन (O2): 16.8% (गंभीर कमी!)\n• H2S जहरीली गैस: 24 PPM (घातक! सीमा 10 PPM)\n• मीथेन CH4: 22% LEL (विस्फोट का खतरा!)।',
          sat: 'ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱧᱮᱞ ᱢᱮ:\n• ᱚᱠᱥᱤᱡᱮᱱ (O2): 16.8% (ᱟᱹᱰᱤ ᱠᱚᱢ!)\n• H2S ᱵᱤᱥ ᱜᱮᱥ: 24 PPM (ᱜᱩᱡᱩᱜ ᱵᱚᱛᱚᱨ!)\n• ᱢᱤᱛᱷᱮᱱ CH4: 22% LEL (ᱵᱚᱢᱵᱽ ᱞᱮᱠᱟ ᱯᱷᱟᱴᱟᱜ ᱨᱤᱥᱠ!)᱾'
        },
        warning: {
          en: 'ATMOSPHERE IDLH (Immediately Dangerous to Life and Health). Entry strictly forbidden without SCBA!',
          hi: 'चेतावनी: यह वातावरण जीवन के लिए अत्यंत घातक है। SCBA के बिना प्रवेश निषेध है!',
          sat: 'ᱥᱟᱹᱠᱷᱭᱟᱹᱛ: ᱱᱚᱶᱟ ᱦᱚᱭ ᱫᱚ ᱡᱤᱣᱤ ᱞᱟᱹᱜᱤᱫ ᱟᱹᱰᱤ ᱵᱚᱛᱚᱨ! SCBA ᱵᱮᱜᱚᱨ ᱵᱟᱝ ᱵᱚᱞᱚᱱ ᱜᱟᱱᱚᱜ-ᱟ!'
        },
        audioPrompt: {
          en: 'Warning! Oxygen is low and toxic H2S gas is above safe limits. Do not enter unprotected.',
          hi: 'चेतावनी! ऑक्सीजन बहुत कम है और जहरीली H2S गैस सीमा से अधिक है। बिना सुरक्षा किट के प्रवेश न करें।',
          sat: 'ᱦᱩᱥᱤᱭᱟᱹᱨ! ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱜᱮᱭᱟ ᱟᱨ ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱹᱥᱛᱤ ᱢᱮᱱᱟᱜ-ᱟ᱾'
        },
        actionRequired: 'read_gas_meter',
        hint: {
          en: 'Tap on the flashing 4-Gas Detector on the AR toolbelt.',
          hi: 'स्क्रीन पर चमकते हुए गैस डिटेक्टर पर टैप करें।',
          sat: 'AR ᱨᱮ ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Atmospheric hazard logged in digital entry permit system.',
          hi: 'गैस खतरे का विवरण डिजिटल परमिट में दर्ज कर लिया गया।',
          sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱨᱮᱭᱟᱜ ᱦᱟᱞᱚᱛ ᱨᱮᱠᱚᱨᱰ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'You must test the air at top, middle, and bottom before entering.',
          hi: 'प्रवेश से पहले ऊपर, मध्य और नीचे तीनों स्तरों पर गैस जांचें।',
          sat: 'ᱪᱮᱛᱟᱱ, ᱛᱟᱞᱟ ᱟᱨ ᱞᱟᱛᱟᱨ ᱡᱚᱛᱚ ᱴᱷᱟᱶ ᱨᱮ ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱧᱮᱞ ᱢᱮ᱾'
        }
      },
      {
        id: 'gl_step_3',
        stepNumber: 3,
        title: {
          en: 'Select & Don Appropriate PPE Kit',
          hi: 'उचित व्यक्तिगत सुरक्षा उपकरण (PPE) का चयन करें',
          sat: 'ᱴᱷᱤᱠ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ (PPE) ᱵᱟᱪᱷᱟᱣ ᱟᱨ ᱦᱚᱨᱚᱜ ᱢᱮ'
        },
        instruction: {
          en: 'For oxygen-deficient (<19.5%) and toxic gas zones, a regular N95/cloth mask is USELESS. Select the Positive-Pressure Self-Contained Breathing Apparatus (SCBA) + 5-Point Full Body Harness + Anti-static Boots.',
          hi: 'ऑक्सीजन की कमी वाले क्षेत्र में साधारण कपड़ा या N95 मास्क बेकार है। पॉजिटिव प्रेशर SCBA श्वसन किट + 5-पॉइंट बॉडी हार्नेस + एंटी-स्टैटिक जूते चुनें।',
          sat: 'ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱴᱷᱟᱶ ᱨᱮ ᱞᱩᱜᱽᱲᱤ ᱢᱟᱥᱠ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ᱾ SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ + ᱦᱟᱨᱱᱮᱥ + ᱵᱩᱴ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Equip the SCBA breathing apparatus and full body safety harness.',
          hi: 'SCBA श्वसन किट और सेफ्टी हार्नेस का चयन करें।',
          sat: 'SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱢᱮ᱾'
        },
        actionRequired: 'select_correct_ppe',
        hint: {
          en: 'Tap the yellow SCBA oxygen cylinder and safety harness.',
          hi: 'पीले रंग के SCBA ऑक्सीजन सिलेंडर और हार्नेस पर टैप करें।',
          sat: 'ᱥᱟᱥᱟᱝ SCBA ᱥᱤᱞᱤᱱᱰᱚᱨ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'SCBA positive pressure seal confirmed at 300 Bar. Body harness fitted.',
          hi: 'SCBA सील 300 बार पर सुरक्षित। हार्नेस सही तरीके से बंध गया।',
          sat: 'SCBA ᱢᱟᱥᱠ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱴᱷᱤᱠ ᱞᱟᱜᱟᱣ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Fatal Error: Dust masks or filter cartridges cannot provide oxygen in deficient atmospheres!',
          hi: 'गंभीर भूल: साधारण धूल मास्क ऑक्सीजन नहीं बना सकते, ऑपरेटर का दम घुट जाएगा!',
          sat: 'ᱵᱷᱩᱞ! ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱟᱥᱠ ᱛᱮ ᱚᱠᱥᱤᱡᱮᱱ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾'
        }
      },
      {
        id: 'gl_step_4',
        stepNumber: 4,
        title: {
          en: 'Establish Standby Buddy & Lifeline Connection',
          hi: 'स्टैंडबाय बडी (साथी) और लाइफलाइन सुरक्षा रस्सी जोड़ें',
          sat: 'ᱥᱴᱮᱱᱰᱵᱟᱭ ᱜᱟᱛᱮ (Buddy) ᱟᱨ ᱫᱟᱹᱲᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱚᱲᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Rule: NEVER enter a confined space alone. Connect your harness D-ring to the mechanical retrieval winch and establish hand/radio signals with your Standby Attendant outside.',
          hi: 'नियम: कभी भी अकेले संकीर्ण स्थान में न जाएं। अपनी हार्नेस को बाहर खड़े स्टैंडबाय अटेंडेंट की सुरक्षा रस्सी (Lifeline) से जोड़ें।',
          sat: 'ᱱᱤᱭᱚᱢ: ᱮᱠᱞᱟ ᱛᱤᱥ ᱦᱚᱸ ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾ ᱵᱟᱦᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱜᱟᱛᱮ ᱥᱟᱶ ᱞᱟᱭᱤᱯᱷᱞᱟᱭᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ ᱡᱚᱲᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Connect the safety lifeline to your buddy at the portal before entering.',
          hi: 'प्रवेश करने से पहले अपने साथी के साथ सुरक्षा रस्सी को कनेक्ट करें।',
          sat: 'ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱨᱮ ᱜᱟᱛᱮ ᱥᱟᱶ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ ᱡᱚᱲᱟᱣ ᱢᱮ᱾'
        },
        actionRequired: 'verify_buddy',
        hint: {
          en: 'Tap on the Standby Buddy Sentinel standing outside the entrance.',
          hi: 'प्रवेश द्वार के बाहर खड़े साथी (Buddy) पर टैप करें।',
          sat: 'ᱵᱟᱦᱨᱮ ᱛᱤᱸᱜᱩ ᱟᱠᱟᱱ ᱜᱟᱛᱮ (Buddy) ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Lifeline anchored to retrieval tripod winch. Continuous 2-way comms verified.',
          hi: 'सुरक्षा रस्सी और वॉकी-टॉकी संचार सफलतापूर्वक स्थापित हुआ।',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ ᱟᱨ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱡᱚᱲᱟᱣ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Entry without a trained standby attendant violates DGMS/OSHA mandates.',
          hi: 'बाहरी साथी के बिना प्रवेश करना सुरक्षा नियमों का गंभीर उल्लंघन है।',
          sat: 'ᱜᱟᱛᱮ ᱵᱮᱜᱚᱨ ᱵᱚᱞᱚᱱ ᱫᱚ ᱟᱹᱱ ᱵᱤᱨᱩᱫᱷ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'gl_step_5',
        stepNumber: 5,
        title: {
          en: 'Identify Spark Hazards & Perform LOTO Isolation',
          hi: 'चिंगारी के खतरों को चिह्नित करें एवं LOTO लॉक लगाएं',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱯᱟᱨᱠ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ ᱵᱷᱟᱞᱵᱽ ᱞᱚᱠ (LOTO) ᱢᱮ'
        },
        instruction: {
          en: 'Methane CH4 is near lower explosive limits. Identify the non-intrinsically safe halogen lamp (SPARK HAZARD) and apply the Lockout-Tagout (LOTO) padlock on the flammable gas pipeline valve.',
          hi: 'मीथेन गैस विस्फोट सीमा पर है। गैर-सुरक्षित हैलोजन लैंप (चिंगारी का खतरा) को पहचानें और गैस पाइपलाइन वाल्व पर LOTO ताला लगाएं।',
          sat: 'ᱢᱤᱛᱷᱮᱱ ᱯᱷᱟᱴᱟᱜ ᱨᱤᱥᱠ ᱢᱮᱱᱟᱜ-ᱟ᱾ ᱥᱯᱟᱨᱠ ᱦᱩᱭᱩᱜ ᱵᱟᱹᱛᱤ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ ᱟᱨ ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱵᱷᱟᱞᱵᱽ ᱨᱮ ᱛᱟᱞᱟ (LOTO) ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Identify the spark source and apply the red LOTO lockout clamp to the gas valve.',
          hi: 'चिंगारी वाले बल्ब को चिह्नित करें और लाल LOTO ताला वाल्व पर लगाएं।',
          sat: 'ᱥᱯᱟᱨᱠ ᱵᱟᱹᱛᱤ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ ᱟᱨ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        actionRequired: 'mark_hazard_zone',
        hint: {
          en: 'Tap the glowing red gas isolation valve to apply LOTO.',
          hi: 'गैस वाल्व पर टैप करके LOTO लॉक लगाएं।',
          sat: 'ᱜᱮᱥ ᱵᱷᱟᱞᱵᱽ ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱛᱟ ᱠᱟᱛᱮ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Gas line isolated & tagged with Lock #LOTO-881. Atmosphere cleared for safe work!',
          hi: 'गैस पाइप सुरक्षित रूप से लॉक कर दिया गया। संकीर्ण स्थान अब सुरक्षित है!',
          sat: 'ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱞᱚᱠ ᱮᱱᱟ᱾ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ!'
        },
        feedbackWrong: {
          en: 'Failing to isolate live fuel lines can lead to catastrophic underground blast.',
          hi: 'वाल्व लॉक न करने से भूमिगत विस्फोट हो सकता है।',
          sat: 'ᱵᱷᱟᱞᱵᱽ ᱵᱟᱝ ᱞᱚᱠ ᱞᱮᱠᱷᱟᱱ ᱠᱷᱟᱫᱟᱱ ᱯᱷᱟᱴᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾'
        }
      }
    ],
    assessmentQuestions: [
      {
        id: 'gl_q1',
        type: 'mcq',
        prompt: {
          en: 'What is the minimum safe oxygen (O2) concentration for entry without SCBA under DGMS/OSHA standards?',
          hi: 'DGMS/OSHA मानकों के अनुसार बिना SCBA के प्रवेश के लिए न्यूनतम सुरक्षित ऑक्सीजन (O2) स्तर क्या है?',
          sat: 'SCBA ᱵᱮᱜᱚᱨ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱠᱚᱢ ᱚᱠᱥᱤᱡᱮᱱ (O2) ᱛᱤᱱᱟᱹᱜ ᱞᱟᱹᱠᱛᱤ?'
        },
        audioPrompt: {
          en: 'What is the minimum safe oxygen level for normal breathing?',
          hi: 'सुरक्षित सांस लेने के लिए न्यूनतम ऑक्सीजन स्तर क्या होना चाहिए?',
          sat: 'ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱠᱚᱢ ᱚᱠᱥᱤᱡᱮᱱ ᱛᱤᱱᱟᱹᱜ ᱫᱚᱨᱠᱟᱨ?'
        },
        options: [
          {
            id: 'opt_19_5',
            text: {
              en: '19.5% Vol (Normal atmospheric level is 20.9%)',
              hi: '19.5% (सामान्य वायुमंडल स्तर 20.9% होता है)',
              sat: '19.5% (ᱥᱟᱫᱷᱟᱨᱚᱱ ᱦᱚᱭ ᱨᱮ 20.9% ᱛᱟᱦᱮᱸᱱᱟ)'
            },
            isCorrect: true,
            explanation: {
              en: 'Any atmosphere with less than 19.5% oxygen is classified as oxygen-deficient and requires supplied air.',
              hi: '19.5% से कम ऑक्सीजन को ऑक्सीजन की कमी माना जाता है और SCBA अनिवार्य होता है।',
              sat: '19.5% ᱠᱷᱚᱱ ᱠᱚᱢ ᱚᱠᱥᱤᱡᱮᱱ ᱨᱮ SCBA ᱵᱮᱵᱷᱟᱨ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾'
            }
          },
          {
            id: 'opt_14_0',
            text: {
              en: '14.0% Vol',
              hi: '14.0%',
              sat: '14.0%'
            },
            isCorrect: false,
            explanation: {
              en: 'At 14% O2, rapid unconsciousness and brain damage occur within minutes.',
              hi: '14% पर कुछ ही मिनटों में बेहोशी और मृत्यु हो सकती है।',
              sat: '14% ᱨᱮ ᱦᱚᱲ ᱵᱮᱦᱚᱸᱥ ᱠᱟᱛᱮ ᱜᱩᱡᱩᱜ-ᱟ᱾'
            }
          },
          {
            id: 'opt_10_0',
            text: {
              en: '10.0% Vol',
              hi: '10.0%',
              sat: '10.0%'
            },
            isCorrect: false,
            explanation: {
              en: '10% is immediately fatal.',
              hi: 'यह अत्यंत घातक स्तर है।',
              sat: 'ᱱᱚᱶᱟ ᱫᱚ ᱜᱩᱡᱩᱜ ᱨᱮᱭᱟᱜ ᱦᱟᱞᱚᱛ ᱠᱟᱱᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Normal air contains 20.9% O2. The safe entry threshold is 19.5% to 23.5%.',
          hi: 'सुरक्षित प्रवेश सीमा 19.5% से 23.5% के बीच होती है।',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱠᱥᱤᱡᱮᱱ ᱞᱮᱵᱷᱮᱞ 19.5% ᱠᱷᱚᱱ 23.5% ᱦᱩᱭᱩᱜ ᱫᱚᱨᱠᱟᱨ᱾'
        }
      },
      {
        id: 'gl_q2',
        type: 'sequence',
        prompt: {
          en: 'Arrange the correct Confined Space Entry procedure in order:',
          hi: 'संकीर्ण स्थान (Confined Space) में प्रवेश की सही कार्यप्रणाली को क्रम से लगाएं:',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱨᱮᱭᱟᱜ ᱱᱤᱭᱚᱢ ᱥᱤᱨᱤᱡᱽ ᱞᱮᱠᱟᱛᱮ ᱥᱟᱡᱟᱣ ᱢᱮ:'
        },
        audioPrompt: {
          en: 'Order the confined space steps: Test Air, Ventilate, Don SCBA, Connect Lifeline to Buddy, Enter.',
          hi: 'संकीर्ण स्थान प्रक्रिया का क्रम लगाएं: हवा जांचें, वेंटिलेशन चालू करें, SCBA पहनें, साथी से रस्सी जोड़ें, प्रवेश करें।',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱥᱤᱨᱤᱡᱽ ᱴᱷᱤᱠ ᱢᱮ᱾'
        },
        sequenceItems: [
          {
            id: 'cs_1',
            text: {
              en: '1. Atmospheric Multi-Gas Testing (Top, Middle, Bottom)',
              hi: '1. मल्टी-गैस डिटेक्टर से हवा की जांच (ऊपर, मध्य, नीचे)',
              sat: '1. ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱛᱮ ᱦᱚᱭ ᱡᱟᱸᱪ (ᱪᱮᱛᱟᱱ, ᱛᱟᱞᱟ, ᱞᱟᱛᱟᱨ)'
            },
            correctOrder: 1
          },
          {
            id: 'cs_2',
            text: {
              en: '2. Mechanical Forced Air Ventilation purge',
              hi: '2. पंखे/ब्लोअर से ताजी हवा का वेंटिलेशन चालू करना',
              sat: '2. ᱯᱷᱮᱱ ᱛᱮ ᱯᱷᱟᱨᱪᱟ ᱦᱚᱭ ᱵᱚᱞᱚ ᱦᱚᱪᱚ'
            },
            correctOrder: 2
          },
          {
            id: 'cs_3',
            text: {
              en: '3. Don Positive-Pressure SCBA & Full Body Harness',
              hi: '3. SCBA श्वसन किट और सेफ्टी हार्नेस पहनना',
              sat: '3. SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ'
            },
            correctOrder: 3
          },
          {
            id: 'cs_4',
            text: {
              en: '4. Connect Retrieval Lifeline to Standby Attendant (Buddy)',
              hi: '4. बाहर तैनात स्टैंडबाय बडी (साथी) से सुरक्षा रस्सी जोड़ना',
              sat: '4. ᱵᱟᱦᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱜᱟᱛᱮ ᱥᱟᱶ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ ᱡᱚᱲᱟᱣ'
            },
            correctOrder: 4
          }
        ],
        explanation: {
          en: 'Always Test first -> Ventilate -> Don SCBA -> Connect Lifeline with Standby Buddy before entering.',
          hi: 'हमेशा पहले गैस जांचें -> वेंटिलेशन करें -> SCBA पहनें -> साथी से रस्सी जोड़कर ही प्रवेश करें।',
          sat: 'ᱡᱟᱣᱜᱮ ᱯᱩᱭᱞᱩ ᱜᱮᱥ ᱡᱟᱸᱪ -> ᱦᱚᱭ ᱯᱷᱟᱨᱪᱟ -> SCBA ᱦᱚᱨᱚᱜ -> ᱜᱟᱛᱮ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱢᱮ᱾'
        }
      },
      {
        id: 'gl_q3',
        type: 'mcq',
        prompt: {
          en: 'If a worker collapses inside a confined gas leak area, what must the standby buddy do FIRST?',
          hi: 'यदि संकीर्ण स्थान में कोई श्रमिक बेहोश हो जाए, तो बाहर खड़े साथी (बडी) को सबसे पहले क्या करना चाहिए?',
          sat: 'ᱡᱩᱫᱤ ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱮᱦᱚᱸᱥ ᱮᱱᱟᱭ, ᱵᱟᱦᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱜᱟᱛᱮ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱮ ᱠᱚᱨᱟᱣᱟ?'
        },
        audioPrompt: {
          en: 'What should the standby attendant do first if a co-worker collapses inside?',
          hi: 'साथी के बेहोश होने पर बाहर खड़े व्यक्ति को पहले क्या करना चाहिए?',
          sat: 'ᱜᱟᱛᱮ ᱵᱮᱦᱚᱸᱥ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱚᱨᱟᱣ ᱞᱟᱹᱠᱛᱤ?'
        },
        options: [
          {
            id: 'opt_alarm_retrieval',
            text: {
              en: 'Raise emergency rescue alarm and operate the external mechanical retrieval winch (DO NOT rush in unprotected)',
              hi: 'आपातकालीन बचाव अलार्म बजाएं और बाहरी चरखी (Winch) से खींचें (बिना सुरक्षा के अंदर कभी न कूदें)',
              sat: 'ᱨᱮᱥᱠᱤᱭᱩ ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ ᱟᱨ ᱵᱟᱦᱨᱮ ᱣᱤᱸᱪ ᱛᱮ ᱚᱨ ᱚᱰᱚᱠᱮᱢ (ᱵᱮᱜᱚᱨ SCBA ᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱫᱟᱹᱲᱟ)'
            },
            isCorrect: true,
            explanation: {
              en: 'Over 60% of confined space fatalities are would-be rescuers rushing in without breathing apparatus and succumbing to the same toxic gas.',
              hi: '60% से अधिक मौतें बिना तैयारी के अंदर कूदने वाले सहायकों की होती हैं जो उसी गैस की चपेट में आ जाते हैं।',
              sat: '᱖᱐% ᱜᱩᱡᱩᱜ ᱫᱚ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱜᱚᱨ ᱢᱟᱥᱠ ᱛᱮ ᱵᱚᱞᱚᱱ ᱦᱚᱲᱟᱜ ᱦᱩᱭᱩᱜ-ᱟ᱾'
            }
          },
          {
            id: 'opt_rush_in',
            text: {
              en: 'Immediately hold breath and run inside to carry the worker',
              hi: 'तुरंत सांस रोककर अंदर दौड़ें और साथी को उठाकर लाएं',
              sat: 'ᱥᱟᱦᱮᱫ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱫᱟᱹᱲ ᱢᱮ'
            },
            isCorrect: false,
            explanation: {
              en: 'Holding breath is ineffective against lethal H2S/methane atmospheres and causes immediate unconsciousness.',
              hi: 'सांस रोकना खतरनाक है, जहरीली गैस एक ही झटके में बेहोश कर देगी।',
              sat: 'ᱥᱟᱦᱮᱫ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱫᱚ ᱟᱹᱰᱤ ᱵᱚᱛᱚᱨ ᱜᱮᱭᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Never enter a lethal atmosphere to rescue someone without full SCBA rescue gear. Always use the mechanical retrieval line and sound the emergency rescue alarm.',
          hi: 'बिना SCBA के कभी भी बचाव के लिए अंदर न कूदें। हमेशा बाहरी चरखी और बचाव दल की सहायता लें।',
          sat: 'ᱵᱮᱜᱚᱨ SCBA ᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾ ᱵᱟᱦᱨᱮ ᱣᱤᱸᱪ ᱟᱨ ᱨᱮᱥᱠᱤᱭᱩ ᱴᱤᱢ ᱦᱚᱦᱚᱣᱟᱠᱚᱢ᱾'
        }
      },
      {
        id: 'gl_q4',
        type: 'mcq',
        prompt: {
          en: 'Scenario: Your multi-gas detector sounds a high alarm for Hydrogen Sulfide (H2S at 24 PPM). You initially smell rotten eggs, but after 30 seconds the smell completely disappears. What has occurred?',
          hi: 'परिदृश्य: आपका गैस डिटेक्टर H2S (24 PPM) का अलार्म बजाता है। पहले आपको सड़े अंडे जैसी गंध आती है, लेकिन 30 सेकंड बाद गंध पूरी तरह गायब हो जाती है। क्या हुआ है?',
          sat: 'ᱥᱤᱱᱟᱨᱤᱭᱳ: ᱢᱟᱞᱴᱤ-ᱜᱮᱥ ᱢᱤᱴᱟᱨ H2S ᱞᱟᱹᱜᱤᱫ 24 PPM ᱟᱞᱟᱨᱢ ᱵᱟᱡᱟᱣ ᱠᱮᱫ-ᱟ᱾ ᱮᱛᱚᱦᱚᱵ ᱨᱮ ᱥᱤᱸᱭᱟᱹ ᱵᱤᱞᱤ ᱞᱮᱠᱟ ᱥᱚ ᱦᱮᱡ ᱞᱮᱱᱟ, ᱢᱮᱱᱠᱷᱟᱱ 30 ᱥᱮᱠᱮᱱᱰ ᱛᱟᱭᱚᱢ ᱥᱚ ᱪᱟᱵᱟ ᱮᱱᱟ᱾ ᱪᱮᱫ ᱦᱩᱭ ᱟᱠᱟᱱᱟ?'
        },
        audioPrompt: {
          en: 'Why did the rotten egg smell disappear during the toxic H2S leak?',
          hi: 'H2S रिसाव के दौरान सड़े अंडे की गंध अचानक क्यों गायब हो गई?',
          sat: 'H2S ᱜᱮᱥ ᱨᱮᱭᱟᱜ ᱥᱚ ᱪᱮᱫᱟᱜ ᱟᱪᱠᱟ ᱵᱚᱸᱫᱽ ᱮᱱᱟ?'
        },
        options: [
          {
            id: 'gl4_opt_olfactory_fatigue',
            text: {
              en: 'Olfactory Fatigue: High H2S paralyzes the human olfactory nerve rapidly. The lethal hazard has escalated!',
              hi: 'सूंघने की क्षमता का पक्षाघात: H2S तंत्रिका को सुन्न कर देती है। खतरा खत्म नहीं हुआ बल्कि और बढ़ गया है!',
              sat: 'ᱢᱩᱸ ᱨᱮᱭᱟᱜ ᱥᱚ ᱥᱟᱵ ᱫᱟᱲᱮ ᱵᱚᱸᱫᱽ ᱮᱱᱟ: H2S ᱱᱟᱨᱵᱷ ᱮ ᱵᱚᱸᱫᱽ ᱠᱮᱫ-ᱟ, ᱵᱚᱛᱚᱨ ᱟᱨᱦᱚᱸ ᱰᱷᱮᱨ ᱮᱱᱟ!'
            },
            isCorrect: true,
            explanation: {
              en: 'H2S causes rapid olfactory paralysis at concentrations above 20 PPM. Never rely on smell.',
              hi: 'H2S गैस 20 PPM से ऊपर सूंघने की नस को सुन्न कर देती है। कभी भी अपनी नाक पर भरोसा न करें।',
              sat: 'H2S ᱫᱚ ᱢᱩᱸ ᱨᱮᱭᱟᱜ ᱫᱟᱲᱮ ᱠᱷᱟᱨᱟᱯ ᱜᱚᱫ ᱠᱟᱜ-ᱟ᱾ ᱛᱤᱥ ᱦᱚᱸ ᱢᱩᱸ ᱛᱮ ᱥᱚ ᱧᱮᱞ ᱟᱞᱚᱢ ᱯᱟᱹᱛᱭᱟᱹᱣᱟ᱾'
            }
          },
          {
            id: 'gl4_opt_vented',
            text: {
              en: 'The toxic gas has naturally vented out and you can safely remove your breathing apparatus',
              hi: 'जहरीली गैस अपने आप बाहर निकल गई है और आप अपना मास्क उतार सकते हैं',
              sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱵᱟᱦᱨᱮ ᱪᱟᱞᱟᱣ ᱮᱱᱟ ᱟᱨ ᱢᱟᱥᱠ ᱚᱰᱚᱠ ᱜᱟᱱᱚᱜ-ᱟ'
            },
            isCorrect: false,
            explanation: {
              en: 'Fatal misconception that causes instant collapse and death.',
              hi: 'यह घातक भ्रम है जिससे तुरंत मृत्यु हो सकती है।',
              sat: 'ᱱᱚᱶᱟ ᱵᱷᱩᱞ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱚᱲ ᱠᱚ ᱜᱩᱡᱩᱜ-ᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Hydrogen Sulfide paralyzes olfactory receptors almost immediately. Rely exclusively on calibrated electronic gas sensors.',
          hi: 'H2S गंध की क्षमता को तुरंत खत्म कर देती है। केवल इलेक्ट्रॉनिक गैस डिटेक्टर पर भरोसा करें।',
          sat: 'H2S ᱜᱮᱥ ᱥᱚ ᱵᱚᱸᱫᱽ ᱠᱟᱜ-ᱟ, ᱡᱟᱣᱜᱮ ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ᱾'
        }
      },
      {
        id: 'gl_q5',
        type: 'mcq',
        prompt: {
          en: 'Safety Decision: What is the DGMS/OSHA regulatory requirement for Lockout-Tagout (LOTO) on flammable gas valves prior to hot work or entry?',
          hi: 'सुरक्षा निर्णय: संकीर्ण स्थान में प्रवेश या वेल्डिंग से पहले ज्वलनशील गैस वाल्व पर LOTO का कानूनी नियम क्या है?',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱪᱟᱹᱨ: ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱨᱮ ᱜᱮᱥ ᱵᱷᱟᱞᱵᱽ ᱪᱮᱛᱟᱱ ᱨᱮ LOTO ᱨᱮᱭᱟᱜ ᱟᱹᱱ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        audioPrompt: {
          en: 'What is required for Lockout-Tagout on flammable gas isolation valves?',
          hi: 'गैस वाल्व पर LOTO लगाने का सही कानूनी तरीका क्या है?',
          sat: 'ᱜᱮᱥ ᱵᱷᱟᱞᱵᱽ ᱞᱚᱠ (LOTO) ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱞᱟᱹᱠᱛᱤᱭᱟ?'
        },
        options: [
          {
            id: 'gl5_opt_physical_padlock',
            text: {
              en: 'Apply a physical red lockout padlock + Danger Tag with worker ID, and verify zero residual energy/pressure',
              hi: 'एक भौतिक लाल पैडलॉक + खतरे का टैग (श्रमिक आईडी सहित) लगाएं और शून्य दबाव (Zero Energy) सत्यापित करें',
              sat: 'ᱟᱨᱟᱜ ᱛᱟᱞᱟ (Padlock) + ᱵᱚᱛᱚᱨ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱢᱮ ᱟᱨ ᱜᱮᱥ ᱯᱨᱮᱥᱟᱨ ᱥᱩᱱ (0) ᱦᱩᱭ ᱟᱠᱟᱱᱟ ᱥᱮ ᱵᱟᱝ ᱧᱮᱞ ᱢᱮ'
            },
            isCorrect: true,
            explanation: {
              en: 'OSHA 1910.147 requires positive physical locking, individual danger tags, and verification of zero energy state.',
              hi: 'भौतिक ताला, व्यक्तिगत डेंजर टैग और शून्य ऊर्जा का सत्यापन अनिवार्य है।',
              sat: 'ᱟᱥᱚᱞ ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ, ᱴᱮᱜᱽ ᱟᱨ ᱯᱨᱮᱥᱟᱨ ᱪᱟᱵᱟ ᱟᱠᱟᱱ ᱵᱤᱰᱟᱹᱣ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾'
            }
          },
          {
            id: 'gl5_opt_verbal',
            text: {
              en: 'A verbal agreement with the shift mate to remember not to turn the valve handle',
              hi: 'सहकर्मी के साथ मौखिक सहमति कि वह वाल्व को न छुए',
              sat: 'ᱜᱟᱛᱮ ᱥᱟᱶ ᱨᱚᱲ ᱠᱟᱛᱮ ᱠᱟᱛᱷᱟ ᱫᱚᱦᱚ ᱡᱮ ᱵᱷᱟᱞᱵᱽ ᱟᱞᱚᱭ ᱟᱹᱪᱩᱨ'
            },
            isCorrect: false,
            explanation: {
              en: 'Verbal agreements violate safety protocols and lead to accidental valve openings.',
              hi: 'मौखिक सहमति नियमों के खिलाफ है और दुर्घटना का कारण बनती है।',
              sat: 'ᱨᱚᱲ ᱠᱟᱛᱷᱟ ᱫᱚ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ, ᱟᱹᱱ ᱵᱤᱨᱩᱫᱷ ᱠᱟᱱᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Only standardized lockout hasps, padlocks, and danger tags physically prevent hazardous energy discharge.',
          hi: 'केवल मानकीकृत LOTO ताला और डेंजर टैग ही आकस्मिक गैस रिसाव को रोक सकते हैं।',
          sat: 'LOTO ᱛᱟᱞᱟ ᱟᱨ ᱴᱮᱜᱽ ᱜᱮ ᱜᱮᱥ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱠᱷᱚᱱ ᱮ ᱮᱥᱮᱫ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾'
        }
      }
    ]
  },
  // Module 3: Machinery Safety & Lockout-Tagout (LOTO)
  {
    id: 'machinery_safety',
    badge: '⚙️ Module 3',
    durationMinutes: 7,
    hazardCategory: 'Heavy Machinery, Conveyor Belts & Lockout-Tagout (LOTO)',
    isAvailable: true,
    requiredPassingScore: 70,
    title: {
      en: 'Machinery Safety & Conveyor LOTO Isolation',
      hi: 'भारी मशीनरी सुरक्षा, कन्वेयर निप पॉइंट्स एवं LOTO',
      sat: 'ᱢᱟᱨᱟᱝ ᱢᱤᱥᱤᱱ, ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱟᱨ LOTO (Machinery)'
    },
    description: {
      en: 'Scan coal handling conveyor belts, identify rotating crush nip points, activate emergency tripwire switches, and apply 6-step LOTO isolation on 415V MCC motor drives.',
      hi: 'कोयला कन्वेयर बेल्ट के निप पॉइंट्स की पहचान, आपातकालीन पुल-कॉर्ड ट्रिपवायर और 415V मोटर पर LOTO ताला लगाने का AR अभ्यास।',
      sat: 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱤᱥᱤᱱ ᱨᱮᱭᱟᱜ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱧᱮᱞ, ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱫᱟᱹᱲᱤ ᱚᱨ ᱟᱨ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱥᱮᱪᱮᱫ।'
    },
    steps: [
      {
        id: 'ms_step_1',
        stepNumber: 1,
        title: {
          en: 'Scan Floor & Anchor Conveyor Drive Model',
          hi: 'फर्श को स्कैन करें और कन्वेयर मॉडल स्थापित करें',
          sat: 'ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ ᱟᱨ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱤᱥᱤᱱ ᱴᱷᱟᱶ ᱵᱮᱱᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Point phone camera at the workshop floor to anchor the industrial 500 TPH heavy-duty coal conveyor belt system.',
          hi: 'अपने कैमरे को फर्श की ओर घुमाएं जब तक कि कन्वेयर बेल्ट सिस्टम AR में स्थिर न हो जाए।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱤᱥᱤᱱ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ᱾'
        },
        audioPrompt: {
          en: 'Point camera at the floor to anchor the industrial conveyor belt.',
          hi: 'कन्वेयर बेल्ट को स्थिर करने के लिए कैमरे को फर्श की ओर घुमाएं।',
          sat: 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱤᱥᱤᱱ ᱞᱟᱹᱜᱤᱫ ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ᱾'
        },
        actionRequired: 'scan_floor',
        hint: {
          en: 'Keep phone tilted at 45 degrees towards the floor.',
          hi: 'फोन को फर्श की ओर 45 डिग्री झुकाएं।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Conveyor drive system anchored! In-running nip point hazard simulated.',
          hi: 'कन्वेयर बेल्ट स्थापित हो गई! रोलर खतरा सक्रिय है।',
          sat: 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱤᱥᱤᱱ AR ᱨᱮ ᱞᱟᱜᱟᱣ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Aim at the floor.',
          hi: 'कैमरा फर्श की ओर रखें।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        }
      },
      {
        id: 'ms_step_2',
        stepNumber: 2,
        title: {
          en: 'Identify Rotating In-Running Nip Point Hazard',
          hi: 'घूमने वाले रोलर के निप पॉइंट (क्रश खतरा) को पहचानें',
          sat: 'ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱ ᱨᱳᱞᱟᱨ ᱱᱤᱯ ᱯᱚᱭᱮᱱᱴ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Inspect the unguarded head pulley. Tap the flashing red target to mark the dangerous in-running nip point where hands or clothing can be drawn in.',
          hi: 'घूमते हुए हेड पुली रोलर की जांच करें और चमकते लाल लक्ष्य पर टैप करके खतरनाक निप पॉइंट को चिह्नित करें।',
          sat: 'ᱪᱟᱹᱞᱩ ᱢᱤᱥᱤᱱ ᱨᱮ ᱟᱨᱟᱜ ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱱᱤᱯ ᱯᱚᱭᱮᱱᱴ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾'
        },
        warning: {
          en: 'DANGER: Never reach across or clean moving conveyor belts with hands or scrapers!',
          hi: 'खतरा: चलती बेल्ट के रोलर के पास कभी भी हाथ या कपड़े न ले जाएं!',
          sat: 'ᱦᱩᱥᱤᱭᱟᱹᱨ: ᱪᱟᱹᱞᱩ ᱢᱤᱥᱤᱱ ᱨᱮ ᱛᱤ ᱟᱞᱚᱢ ᱞᱟᱜᱟᱣᱟ, ᱛᱤ ᱨᱟᱹᱯᱩᱫᱚᱜ-ᱟ!'
        },
        audioPrompt: {
          en: 'Tap the rotating nip point to mark the pinch hazard.',
          hi: 'खतरनाक निप पॉइंट को चिह्नित करने के लिए उस पर टैप करें।',
          sat: 'ᱵᱚᱛᱚᱨ ᱱᱤᱯ ᱯᱚᱭᱮᱱᱴ ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        actionRequired: 'inspect_pinch_point',
        hint: {
          en: 'Tap on the flashing red hazard circle on the conveyor pulley.',
          hi: 'घूमते हुए रोलर पर चमकते लाल घेरे पर टैप करें।',
          sat: 'ᱟᱨᱟᱜ ᱜᱩᱞᱟᱹᱭ ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Hazard logged! Unguarded nip point flagged for immediate machine guarding.',
          hi: 'खतरा दर्ज हुआ! सुरक्षा जाली लगाने की आवश्यकता है।',
          sat: 'ᱱᱤᱯ ᱯᱚᱭᱮᱱᱴ ᱨᱮᱠᱚᱨᱰ ᱮᱱᱟ! ᱜᱟᱨᱰ ᱞᱟᱜᱟᱣ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾'
        },
        feedbackWrong: {
          en: 'Identify the rotating pinch point.',
          hi: 'घूमने वाले रोलर को चिह्नित करें।',
          sat: 'ᱟᱹᱪᱩᱨᱚᱜ ᱨᱳᱞᱟᱨ ᱚᱛᱟᱭ ᱢᱮ᱾'
        }
      },
      {
        id: 'ms_step_3',
        stepNumber: 3,
        title: {
          en: 'Pull Emergency Cord Tripwire Switch (E-Stop)',
          hi: 'आपातकालीन स्टॉप पुल-कॉर्ड रस्सी खींचें',
          sat: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱫᱟᱹᱲᱤ (Pull-Cord) ᱚᱨ ᱢᱮ'
        },
        instruction: {
          en: 'Simulate a conveyor belt emergency stop. Pull the red emergency pull-cord wire to instantly trip the 415V drive motor to 0 RPM.',
          hi: 'कन्वेयर को तुरंत रोकने के लिए लाल आपातकालीन पुल-कॉर्ड तार खींचें।',
          sat: 'ᱢᱤᱥᱤᱱ ᱞᱚᱜᱚᱱ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱟᱨᱟᱜ ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱫᱟᱹᱲᱤ ᱚᱨ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Pull the emergency tripwire cord to halt the conveyor motor.',
          hi: 'कन्वेयर मोटर को तुरंत रोकने के लिए लाल रस्सी खींचें।',
          sat: 'ᱢᱤᱥᱤᱱ ᱛᱤᱸᱜᱩ ᱞᱟᱹᱜᱤᱫ ᱟᱨᱟᱜ ᱫᱟᱹᱲᱤ ᱚᱨ ᱢᱮ᱾'
        },
        actionRequired: 'pull_emergency_cord',
        hint: {
          en: 'Tap the PULL EMERGENCY CORD button.',
          hi: 'स्क्रीन पर PULL CABLE बटन दबाएं।',
          sat: 'ᱥᱠᱨᱤᱱ ᱨᱮ PULL CABLE ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Emergency Stop Tripped! Conveyor drive halted to 0 RPM.',
          hi: 'इमरजेंसी स्टॉप सक्रिय! कन्वेयर मोटर पूरी तरह रुक गई।',
          sat: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ ᱮᱱᱟ! ᱢᱤᱥᱤᱱ ᱛᱤᱸᱜᱩ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Pull the emergency cable.',
          hi: 'इमरजेंसी तार खींचें।',
          sat: 'ᱫᱟᱹᱲᱤ ᱚᱨ ᱢᱮ᱾'
        }
      },
      {
        id: 'ms_step_4',
        stepNumber: 4,
        title: {
          en: 'Apply 6-Step LOTO Lockout Hasp & Padlock',
          hi: '415V स्विच पर LOTO ताला और डेंजर टैग लगाएं',
          sat: '415V ᱥᱣᱤᱪ ᱨᱮ LOTO ᱛᱟᱞᱟ ᱟᱨ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Isolate main 415V power MCC breaker. Apply your personal red safety padlock and danger tag #LOTO-415V onto the multi-lock hasp.',
          hi: '415V मुख्य ब्रेकर को बंद करें और उस पर अपना व्यक्तिगत लाल ताला और डेंजर टैग लगाएं।',
          sat: '415V ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ ᱟᱨ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Apply your personal LOTO padlock and danger tag to the electrical isolator.',
          hi: 'इलेक्ट्रिकल स्विच पर अपना LOTO ताला और खतरा टैग लगाएं।',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱨᱮ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        actionRequired: 'apply_loto_hasp',
        hint: {
          en: 'Tap the Apply LOTO Padlock button.',
          hi: 'LOTO ताला लगाने के लिए बटन दबाएं।',
          sat: 'LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'LOTO Padlock #LOTO-415V secured! Energy source positively isolated.',
          hi: 'LOTO ताला और टैग सुरक्षित रूप से लग गया!',
          sat: 'LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱮᱱᱟ! ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱮᱱᱟ᱾'
        },
        feedbackWrong: {
          en: 'Attach your personal padlock.',
          hi: 'अपना ताला लगाएं।',
          sat: 'ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        }
      }
    ],
    assessmentQuestions: [
      {
        id: 'ms_q1',
        type: 'mcq',
        prompt: {
          en: 'What is the Golden Rule of Lockout-Tagout (LOTO) before maintaining machinery?',
          hi: 'मशीनरी रखरखाव शुरू करने से पहले LOTO का स्वर्णिम नियम क्या है?',
          sat: 'ᱢᱤᱥᱤᱱ ᱥᱟᱯᱷᱟ ᱥᱮ ᱢᱮᱨᱟᱢᱚᱛ ᱢᱟᱬᱟᱝ ᱨᱮ LOTO ᱨᱮᱭᱟᱜ ᱢᱩᱬᱩᱛ ᱱᱤᱭᱚᱢ ᱪᱮᱫ?'
        },
        audioPrompt: {
          en: 'What is the golden rule of LOTO?',
          hi: 'LOTO का सबसे मुख्य नियम क्या है?',
          sat: 'LOTO ᱨᱮᱭᱟᱜ ᱢᱩᱬᱩᱛ ᱱᱤᱭᱚᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_one_lock',
            text: {
              en: 'One Person, One Lock, One Key (Only the person who placed the lock may remove it)',
              hi: 'एक व्यक्ति, एक ताला, एक चाबी (जिसने ताला लगाया है केवल वही उसे हटा सकता है)',
              sat: 'ᱢᱤᱫ ᱦᱚᱲ, ᱢᱤᱫ ᱛᱟᱞᱟ, ᱢᱤᱫ ᱪᱟᱹᱵᱷᱤ (ᱡᱟᱦᱟᱸᱭ ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱫᱟᱭ ᱩᱱᱤ ᱜᱮ ᱠᱷᱩᱞᱟᱹᱭᱟ)'
            },
            isCorrect: true,
            explanation: {
              en: 'Personal lock ownership ensures machinery cannot be accidentally re-energized while a technician is inside.',
              hi: 'व्यक्तिगत ताला सुनिश्चित करता है कि जब कोई कर्मचारी अंदर काम कर रहा हो तो कोई दूसरा मशीन चालू न कर सके।',
              sat: 'ᱱᱚᱶᱟ ᱛᱮ ᱮᱴᱟᱜ ᱦᱚᱲ ᱢᱤᱥᱤᱱ ᱵᱟᱝ ᱠᱚ ᱪᱟᱹᱞᱩ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾'
            }
          },
          {
            id: 'opt_share_key',
            text: {
              en: 'Leave the master key hanging on the switchboard for anyone to use',
              hi: 'मास्टर चाबी को स्विचबोर्ड पर टांग दें ताकि कोई भी खोल सके',
              sat: 'ᱪᱟᱹᱵᱷᱤ ᱵᱚᱰ ᱨᱮ ᱴᱟᱸᱜᱟᱣ ᱫᱚᱦᱚᱭ ᱢᱮ'
            },
            isCorrect: false,
            explanation: {
              en: 'Fatal violation of safety mandates.',
              hi: 'यह सुरक्षा नियमों का गंभीर उल्लंघन है।',
              sat: 'ᱱᱚᱶᱟ ᱫᱚ ᱵᱷᱩᱞ ᱠᱟᱱᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Always maintain personal custody of your lockout padlock key to ensure complete safety.',
          hi: 'सुरक्षा के लिए अपनी चाबी हमेशा अपने पास रखें।',
          sat: 'ᱪᱟᱹᱵᱷᱤ ᱡᱟᱣᱜᱮ ᱟᱯᱱᱟᱨ ᱴᱷᱮᱱ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        }
      },
      {
        id: 'ms_q2',
        type: 'sequence',
        prompt: {
          en: 'Arrange the 4 core steps of Lockout-Tagout (LOTO) in correct sequential order:',
          hi: 'LOTO की 4 मुख्य प्रक्रियाओं को सही क्रम में व्यवस्थित करें:',
          sat: 'LOTO ᱨᱮᱭᱟᱜ ᱯᱩᱱᱭᱟᱹ ᱱᱤᱭᱚᱢ ᱥᱤᱨᱤᱡᱽ ᱞᱮᱠᱟᱛᱮ ᱥᱟᱡᱟᱣ ᱢᱮ:'
        },
        audioPrompt: {
          en: 'Order the LOTO steps: Notify, Shutdown, Lock & Tag, Verify Zero Energy.',
          hi: 'LOTO का सही क्रम लगाएं: सूचना दें, बंद करें, ताला लगाएं, शून्य ऊर्जा जांचें।',
          sat: 'LOTO ᱥᱤᱨᱤᱡᱽ ᱴᱷᱤᱠ ᱢᱮ᱾'
        },
        sequenceItems: [
          {
            id: 'loto_seq_1',
            text: {
              en: '1. Notify affected operators of upcoming shutdown',
              hi: '1. प्रभावित सभी श्रमिकों को शटडाउन की पूर्व सूचना देना',
              sat: '1. ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱨᱮᱭᱟᱜ ᱠᱷᱚᱵᱚᱨ ᱮᱢ'
            },
            correctOrder: 1
          },
          {
            id: 'loto_seq_2',
            text: {
              en: '2. Perform controlled equipment shutdown & isolate power',
              hi: '2. उपकरण को नियमानुसार बंद करना और मुख्य बिजली काटना',
              sat: '2. ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱠᱟᱴᱟᱣ'
            },
            correctOrder: 2
          },
          {
            id: 'loto_seq_3',
            text: {
              en: '3. Apply personal red LOTO Padlock and Danger Tag',
              hi: '3. व्यक्तिगत लाल LOTO ताला और डेंजर टैग लगाना',
              sat: '3. LOTO ᱛᱟᱞᱟ ᱟᱨ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ'
            },
            correctOrder: 3
          },
          {
            id: 'loto_seq_4',
            text: {
              en: '4. Verify Zero Energy State (Test start buttons & bleed pressure)',
              hi: '4. शून्य ऊर्जा स्थिति की जांच करना (स्टार्ट बटन दबाकर देखना)',
              sat: '4. Zero Energy ᱡᱟᱸᱪ (ᱥᱴᱟᱨᱴ ᱵᱚᱴᱚᱱ ᱚᱛᱟ ᱠᱟᱛᱮ ᱧᱮᱞ)'
            },
            correctOrder: 4
          }
        ],
        explanation: {
          en: 'Correct sequence: Notify -> Shutdown -> Lock & Tag -> Verify Zero Energy.',
          hi: 'सही क्रम: सूचना दें -> बंद करें -> ताला लगाएं -> शून्य ऊर्जा की पुष्टि करें।',
          sat: 'ᱥᱤᱨᱤᱡᱽ: ᱠᱷᱚᱵᱚᱨ ᱮᱢ -> ᱵᱚᱸᱫᱽ -> ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ -> ᱡᱟᱸᱪ ᱢᱮ᱾'
        }
      }
    ]
  },

  // Module 4: Working at Heights & Fall Protection
  {
    id: 'ppe_hazard',
    badge: '🦺 Module 4',
    durationMinutes: 6,
    hazardCategory: 'Fall Protection, Scaffolding & High-Risk PPE',
    isAvailable: true,
    requiredPassingScore: 70,
    title: {
      en: 'Working at Heights & Fall Protection',
      hi: 'ऊंचाई पर कार्य एवं फॉल प्रोटेक्शन सुरक्षा',
      sat: 'ᱩᱥᱩᱞ ᱴᱷᱟᱶ ᱨᱮ ᱠᱟᱹᱢᱤ ᱟᱨ ᱧᱩᱨᱩᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ (Height Safety)'
    },
    description: {
      en: 'Inspect scaffolding green safety tags, don 5-point full body harnesses, execute 100% continuous double-lanyard tie-off, and deploy suspension trauma relief straps.',
      hi: 'मचान ग्रीन टैग का निरीक्षण, फुल बॉडी हार्नेस पहनना, 100% डबल लैनयार्ड टाई-ऑफ और सस्पेंशन ट्रॉमा स्ट्रैप का अभ्यास।',
      sat: 'ᱥᱠᱮᱯᱷᱳᱞᱰ ᱴᱮᱜᱽ ᱧᱮᱞ, ᱥᱮᱯᱷᱴᱤ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ, ᱵᱟᱱᱟᱨ ᱦᱩᱠ ᱞᱟᱜᱟᱣ ᱟᱨ ᱴᱨᱳᱢᱟ ᱫᱟᱹᱲᱤ ᱥᱮᱪᱮᱫ।'
    },
    steps: [
      {
        id: 'ht_step_1',
        stepNumber: 1,
        title: {
          en: 'Scan Elevation & Anchor Scaffolding Grid',
          hi: 'ऊंचाई का धरातल स्कैन करें और मचान मॉडल स्थापित करें',
          sat: 'ᱩᱥᱩᱞ ᱴᱷᱟᱶ ᱥᱠᱮᱱ ᱢᱮ ᱟᱨ AR ᱢᱟᱪᱟ ᱵᱮᱱᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Point phone camera towards the elevated staging structure to calibrate height coordinates.',
          hi: 'कैमरे को मचान प्लेटफॉर्म की ओर रखें ताकि AR ऊंचाई मॉडल स्थिर हो सके।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱩᱥᱩᱞ ᱢᱟᱪᱟ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ ᱴᱷᱟᱶ ᱵᱮᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ᱾'
        },
        audioPrompt: {
          en: 'Point camera towards the vertical scaffold structure.',
          hi: 'मचान संरचना की ओर कैमरा घुमाएं।',
          sat: 'ᱢᱟᱪᱟ ᱥᱮᱫ ᱠᱮᱢᱮᱨᱟ ᱟᱹᱪᱩᱨ ᱢᱮ᱾'
        },
        actionRequired: 'scan_floor',
        hint: {
          en: 'Keep camera focused on the vertical elevation.',
          hi: 'ऊंचाई वाले हिस्से पर कैमरा केंद्रित रखें।',
          sat: 'ᱩᱥᱩᱞ ᱥᱮᱫ ᱠᱮᱢᱮᱨᱟ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Scaffold structure spatial coordinates locked!',
          hi: 'मचान मॉडल AR में स्थापित हो गया!',
          sat: 'ᱢᱟᱪᱟ ᱴᱷᱟᱶ ᱞᱟᱜᱟᱣ ᱮᱱᱟ!'
        },
        feedbackWrong: {
          en: 'Scan the elevation.',
          hi: 'ऊंचाई को स्कैन करें।',
          sat: 'ᱩᱥᱩᱞ ᱥᱠᱮᱱ ᱢᱮ᱾'
        }
      },
      {
        id: 'ht_step_2',
        stepNumber: 2,
        title: {
          en: 'Inspect Scaffolding Green Safety Tag',
          hi: 'मचान के ग्रीन सुरक्षा टैग का निरीक्षण करें',
          sat: 'ᱥᱠᱮᱯᱷᱳᱞᱰ ᱨᱮᱭᱟᱜ ᱜᱽᱨᱤᱱ ᱥᱮᱯᱷᱴᱤ ᱴᱮᱜᱽ ᱧᱮᱞ ᱢᱮ'
        },
        instruction: {
          en: 'Inspect Tag #SCAF-9041. Confirm presence of guardrails, mid-rails, toe-boards, and safe working load (450 KG). Tap to approve.',
          hi: 'टैग #SCAF-9041 की जांच करें। रेलिंग, टो-बोर्ड और लोड क्षमता की पुष्टि करके टैग स्वीकृत करें।',
          sat: 'ᱴᱮᱜᱽ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱮᱱᱛᱮ ᱯᱟᱥ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Inspect and approve the scaffold green tag.',
          hi: 'मचान के ग्रीन टैग की जांच करें और स्वीकृत करें।',
          sat: 'ᱜᱽᱨᱤᱱ ᱴᱮᱜᱽ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱯᱟᱥ ᱢᱮ᱾'
        },
        actionRequired: 'inspect_scaffold_tag',
        hint: {
          en: 'Tap on the Inspect Green Tag button.',
          hi: 'ग्रीन टैग स्वीकृत बटन दबाएं।',
          sat: 'ᱜᱽᱨᱤᱱ ᱴᱮᱜᱽ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Green Tag Approved! Platform verified safe for work at heights.',
          hi: 'ग्रीन टैग स्वीकृत! ऊंचाई पर काम के लिए मंच सुरक्षित है।',
          sat: 'ᱜᱽᱨᱤᱱ ᱴᱮᱜᱽ ᱯᱟᱥ ᱮᱱᱟ! ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ᱾'
        },
        feedbackWrong: {
          en: 'Approve green tag.',
          hi: 'टैग की पुष्टि करें।',
          sat: 'ᱴᱮᱜᱽ ᱯᱟᱥ ᱢᱮ᱾'
        }
      },
      {
        id: 'ht_step_3',
        stepNumber: 3,
        title: {
          en: 'Execute 100% Double-Lanyard Continuous Tie-Off',
          hi: '100% निरंतर डबल-लैनयार्ड टाई-ऑफ जोड़ें',
          sat: '100% ᱵᱟᱱᱟᱨ ᱦᱩᱠ (Double Lanyard) ᱡᱚᱲᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Connect both twin snap hooks to the certified overhead lifeline cable so that you are NEVER unhooked while transitioning.',
          hi: 'दोनों स्नैप हुक को ओवरहेड लाइफलाइन केबल से जोड़ें ताकि चलते समय कभी भी बिना सुरक्षा के न रहें।',
          sat: 'ᱵᱟᱱᱟᱨ ᱦᱩᱠ ᱪᱮᱛᱟᱱ ᱫᱟᱹᱲᱤ ᱨᱮ ᱡᱚᱲᱟᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Snap both lanyard hooks to maintain 100% tie-off.',
          hi: '100% टाई-ऑफ के लिए दोनों हुक कनेक्ट करें।',
          sat: 'ᱵᱟᱱᱟᱨ ᱦᱩᱠ ᱡᱚᱲᱟᱣ ᱢᱮ᱾'
        },
        actionRequired: 'connect_double_lanyard',
        hint: {
          en: 'Tap the Snap Hook buttons to connect Hook 1 and Hook 2.',
          hi: 'हुक 1 और हुक 2 जोड़ने के लिए बटन दबाएं।',
          sat: 'ᱦᱩᱠ ᱑ ᱟᱨ ᱦᱩᱠ ᱒ ᱡᱚᱲᱟᱣ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: '100% Tie-Off Confirmed! Zero free-fall exposure maintained.',
          hi: '100% टाई-ऑफ सफल! गिरने का खतरा शून्य हुआ।',
          sat: '100% ᱴᱟᱭ-ᱚᱯᱷ ᱦᱩᱭ ᱮᱱᱟ! ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ᱾'
        },
        feedbackWrong: {
          en: 'Connect both hooks.',
          hi: 'दोनों हुक लगाएं।',
          sat: 'ᱵᱟᱱᱟᱨ ᱦᱩᱠ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        }
      }
    ],
    assessmentQuestions: [
      {
        id: 'ht_q1',
        type: 'mcq',
        prompt: {
          en: 'According to DGMS & OSHA standards, at what height is fall protection mandatory for workers?',
          hi: 'DGMS और OSHA मानकों के अनुसार, कितनी ऊंचाई पर फॉल प्रोटेक्शन (हार्नेस) अनिवार्य है?',
          sat: 'DGMS ᱟᱹᱱ ᱞᱮᱠᱟᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱩᱥᱩᱞ ᱨᱮ ᱥᱮᱯᱷᱴᱤ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?'
        },
        audioPrompt: {
          en: 'At what height is full body fall protection mandatory?',
          hi: 'कितनी ऊंचाई पर सेफ्टी हार्नेस अनिवार्य है?',
          sat: 'ᱛᱤᱱᱟᱹᱜ ᱩᱥᱩᱞ ᱨᱮ ᱥᱮᱯᱷᱴᱤ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤ?'
        },
        options: [
          {
            id: 'opt_1_8m',
            text: {
              en: '1.8 meters (6 feet) or above from ground/lower level',
              hi: 'जमीन से 1.8 मीटर (6 फीट) या उससे अधिक ऊंचाई पर',
              sat: 'ᱚᱛ ᱠᱷᱚᱱ 1.8 ᱢᱤᱴᱟᱨ (6 ᱯᱷᱩᱴ) ᱪᱮᱛᱟᱱ ᱨᱮ'
            },
            isCorrect: true,
            explanation: {
              en: '1.8m (6ft) is the international trigger height where 100% tie-off fall arrest gear is legally required.',
              hi: '1.8 मीटर (6 फीट) की ऊंचाई से सेफ्टी हार्नेस पहनना कानूनी रूप से अनिवार्य है।',
              sat: '1.8 ᱢᱤᱴᱟᱨ ᱩᱥᱩᱞ ᱠᱷᱚᱱ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱵᱟᱫᱷᱭᱚᱛᱟ ᱢᱮᱱᱟᱜ-ᱟ᱾'
            }
          },
          {
            id: 'opt_10m',
            text: {
              en: '10 meters (30 feet) only',
              hi: 'केवल 10 मीटर (30 फीट) की ऊंचाई पर',
              sat: 'ᱮᱠᱟᱞ 10 ᱢᱤᱴᱟᱨ ᱩᱥᱩᱞ ᱨᱮ'
            },
            isCorrect: false,
            explanation: {
              en: 'Incorrect: 1.8m is the legal limit.',
              hi: 'गलत: 1.8 मीटर सही मानक है।',
              sat: 'ᱵᱷᱩᱞ ᱠᱟᱱᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Always wear a certified full body harness at heights of 1.8m (6ft) and above.',
          hi: '1.8 मीटर या अधिक ऊंचाई पर हमेशा हार्नेस पहनें।',
          sat: '1.8 ᱢᱤᱴᱟᱨ ᱪᱮᱛᱟᱱ ᱨᱮ ᱡᱟᱣᱜᱮ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱢᱮ᱾'
        }
      }
    ]
  },

  // Module 5: Electrical Safety, Arc Flash & Molten Metal
  {
    id: 'first_aid',
    badge: '⚡ Module 5',
    durationMinutes: 8,
    hazardCategory: '33kV Substation, Arc Flash & Molten Metal Triage',
    isAvailable: true,
    requiredPassingScore: 70,
    title: {
      en: 'Electrical Safety, Arc Flash & Metal Triage',
      hi: 'विद्युत सुरक्षा, आर्क फ्लैश एवं धातु भट्टी आपातकाल',
      sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱯᱷᱴᱤ, ᱟᱨᱠ ᱯᱷᱞᱮᱥ ᱟᱨ ᱞᱚᱞᱚ ᱢᱮᱬᱦᱮᱫ (Electrical)'
    },
    description: {
      en: 'Identify 33kV arc flash flashover boundaries, don 40 cal/cm² dielectric suits, execute Test-Before-Touch voltage probing, and operate non-conductive rescue hooks.',
      hi: '33kV सबस्टेशन में आर्क फ्लैश सीमा पहचानना, 40 cal/cm² आर्क सूट पहनना, हॉट स्टिक से वोल्टेज जांच और रेस्क्यू हुक से बचाव का AR अभ्यास।',
      sat: '33kV ᱵᱤᱡᱽᱞᱤ ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ ᱧᱮᱞ, ᱟᱨᱠ ᱥᱩᱴ ᱦᱚᱨᱚᱜ, ᱦᱚᱴ ᱥᱴᱤᱠ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱡᱟᱸᱪ ᱟᱨ ᱨᱮᱥᱠᱤᱭᱩ ᱦᱩᱠ ᱵᱮᱵᱷᱟᱨ ᱥᱮᱪᱮᱫ।'
    },
    steps: [
      {
        id: 'el_step_1',
        stepNumber: 1,
        title: {
          en: 'Scan Substation & Calibrate Coordinate Frame',
          hi: '33kV सबस्टेशन को स्कैन करें और AR ग्रिड स्थापित करें',
          sat: '33kV ᱵᱤᱡᱽᱞᱤ ᱴᱷᱟᱶ ᱥᱠᱮᱱ ᱢᱮ ᱟᱨ AR ᱵᱮᱱᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Aim camera towards the transformer switchgear to establish the high-voltage spatial grid.',
          hi: 'कैमरे को स्विचगियर की ओर घुमाएं ताकि हाई-वोल्टेज AR ग्रिड लॉक हो सके।',
          sat: 'ᱠᱮᱢᱮᱨᱟ ᱵᱤᱡᱽᱞᱤ ᱯᱮᱱᱮᱞ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ ᱴᱷᱟᱶ ᱞᱟᱹᱜᱤᱫ᱾'
        },
        audioPrompt: {
          en: 'Point camera at the electrical switchgear to establish coordinates.',
          hi: 'स्विचगियर की ओर कैमरा घुमाकर सतह लॉक करें।',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱯᱮᱱᱮᱞ ᱥᱮᱫ ᱠᱮᱢᱮᱨᱟ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        },
        actionRequired: 'scan_floor',
        hint: {
          en: 'Point camera at the floor near the substation.',
          hi: 'सबस्टेशन के पास फर्श को स्कैन करें।',
          sat: 'ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: '33kV Substation spatial plane locked!',
          hi: 'सबस्टेशन धरातल लॉक हो गया!',
          sat: '33kV ᱴᱷᱟᱶ ᱞᱟᱜᱟᱣ ᱮᱱᱟ!'
        },
        feedbackWrong: {
          en: 'Scan the substation floor.',
          hi: 'फर्श को स्कैन करें।',
          sat: 'ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ᱾'
        }
      },
      {
        id: 'el_step_2',
        stepNumber: 2,
        title: {
          en: 'Establish NFPA 70E Arc Flash Boundary',
          hi: 'आर्क फ्लैश एवं पिघली धातु की सुरक्षित सीमा (1.5m) चिह्नित करें',
          sat: 'ᱟᱨᱠ ᱯᱷᱞᱮᱥ ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ (1.5m) ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Mark the 1.5m Prohibited Arc Flash Boundary. Entering this zone without PPE can cause instant 3rd-degree thermal burns.',
          hi: '1.5 मीटर की प्रतिबंधित आर्क फ्लैश सीमा चिह्नित करें। बिना सुरक्षा किट के अंदर जाना मना है।',
          sat: '1.5 ᱢᱤᱴᱟᱨ ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾'
        },
        audioPrompt: {
          en: 'Establish the prohibited arc flash boundary line.',
          hi: 'आर्क फ्लैश की खतरनाक सीमा रेखा चिह्नित करें।',
          sat: 'ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ ᱨᱮᱠᱷᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾'
        },
        actionRequired: 'check_arc_boundary',
        hint: {
          en: 'Tap the Establish Arc Boundary button.',
          hi: 'सीमा चिह्नित करें बटन दबाएं।',
          sat: 'ᱥᱤᱢᱟᱹ ᱪᱤᱱᱦᱟᱹᱣ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Boundary Established! Warning perimeter active.',
          hi: 'सुरक्षा सीमा तय हुई! बिना सूट प्रवेश वर्जित है।',
          sat: 'ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ ᱞᱟᱜᱟᱣ ᱮᱱᱟ!'
        },
        feedbackWrong: {
          en: 'Establish the boundary.',
          hi: 'सीमा रेखा बनाएं।',
          sat: 'ᱥᱤᱢᱟᱹ ᱵᱮᱱᱟᱣ ᱢᱮ᱾'
        }
      },
      {
        id: 'el_step_3',
        stepNumber: 3,
        title: {
          en: 'Probe Busbar with Hot Stick (Test Before Touch)',
          hi: 'हॉट स्टिक से वोल्टेज जांचें (छूने से पहले जांचें)',
          sat: 'ᱦᱚᱴ ᱥᱴᱤᱠ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱡᱟᱸᱪ ᱢᱮ (Test Before Touch)'
        },
        instruction: {
          en: 'Use the non-contact high-voltage detector probe to verify the 33kV busbar is completely dead (0.0 kV) before maintenance.',
          hi: 'इंसुलेटेड हॉट स्टिक से जांचें कि 33kV लाइन में कोई करंट तो नहीं आ रहा है।',
          sat: 'ᱦᱚᱴ ᱥᱴᱤᱠ ᱛᱮ ᱧᱮᱞ ᱢᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ (0.0 kV) ᱢᱮᱱᱛᱮ᱾'
        },
        audioPrompt: {
          en: 'Probe the busbar with the hot stick to test for voltage.',
          hi: 'हॉट स्टिक से वोल्टेज की जांच करें।',
          sat: 'ᱦᱚᱴ ᱥᱴᱤᱠ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱡᱟᱸᱪ ᱢᱮ᱾'
        },
        actionRequired: 'voltage_detector_probe',
        hint: {
          en: 'Tap the Probe 33kV Busbar button.',
          hi: 'वोल्टेज जांचें बटन दबाएं।',
          sat: 'ᱠᱟᱨᱮᱱᱴ ᱡᱟᱸᱪ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Confirmed 0.0 kV Dead Voltage! Circuit safe for grounding.',
          hi: '0.0 kV सत्यापित! लाइन पूरी तरह सुरक्षित है।',
          sat: '0.0 kV ᱴᱷᱤᱠ ᱮᱱᱟ! ᱠᱟᱨᱮᱱᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾'
        },
        feedbackWrong: {
          en: 'Probe the conductor.',
          hi: 'तार की जांच करें।',
          sat: 'ᱛᱟᱨ ᱡᱟᱸᱪ ᱢᱮ᱾'
        }
      },
      {
        id: 'el_step_4',
        stepNumber: 4,
        title: {
          en: 'Deploy Insulated Rescue Hook for Shock Victim',
          hi: 'इंसुलेटेड शेफर्ड रेस्क्यू हुक से पीड़ित को अलग करें',
          sat: 'ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱦᱚᱲ ᱚᱨ ᱥᱟᱦᱟᱭ ᱢᱮ'
        },
        instruction: {
          en: 'DANGER: Never touch an electrocuted person with your bare hands. Use the insulated fiberglass shepherd hook around their waist to drag them clear.',
          hi: 'करंट लगे व्यक्ति को कभी हाथ से न छुएं। इंसुलेटेड फाइबरग्लास हुक को उनकी कमर में फंसाकर खींचें।',
          sat: 'ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱦᱚᱲ ᱛᱤ ᱛᱮ ᱟᱞᱚᱢ ᱡᱚᱴᱮᱫᱮᱭᱟ᱾ ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱛᱮ ᱚᱨ ᱚᱰᱚᱠᱮᱢ᱾'
        },
        audioPrompt: {
          en: 'Use the non-conductive rescue hook to pull the shock victim clear.',
          hi: 'इंसुलेटेड रेस्क्यू हुक से पीड़ित को सुरक्षित अलग करें।',
          sat: 'ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱦᱟᱭ ᱢᱮ᱾'
        },
        actionRequired: 'use_rescue_hook',
        hint: {
          en: 'Tap the Deploy Insulated Rescue Hook button.',
          hi: 'रेस्क्यू हुक बटन दबाएं।',
          sat: 'ᱨᱮᱥᱠᱤᱭᱩ ᱦᱩᱠ ᱵᱚᱴᱚᱱ ᱚᱛᱟᱭ ᱢᱮ᱾'
        },
        feedbackCorrect: {
          en: 'Victim Safely Separated! Initiate electrical shock CPR triage.',
          hi: 'पीड़ित को करंट से अलग किया गया! CPR प्राथमिक चिकित्सा शुरू करें।',
          sat: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱦᱟ ᱮᱱᱟᱭ! CPR ᱮᱢ ᱮᱦᱚᱵ ᱢᱮ᱾'
        },
        feedbackWrong: {
          en: 'Use the rescue hook.',
          hi: 'हुक का प्रयोग करें।',
          sat: 'ᱦᱩᱠ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾'
        }
      }
    ],
    assessmentQuestions: [
      {
        id: 'el_q1',
        type: 'mcq',
        prompt: {
          en: 'If a co-worker is frozen to a live 440V electrical conductor, what is the immediate first action?',
          hi: 'यदि कोई साथी 440V लाइव बिजली के तार से चिपक गया हो, तो सबसे पहली कार्रवाई क्या होनी चाहिए?',
          sat: 'ᱡᱩᱫᱤ ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ 440V ᱵᱤᱡᱽᱞᱤ ᱛᱟᱨ ᱨᱮ ᱞᱟᱴᱷᱟ ᱮᱱᱟᱭ, ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱚᱨᱟᱣ ᱞᱟᱹᱠᱛᱤ?'
        },
        audioPrompt: {
          en: 'What is the immediate action when someone is shocked on a live wire?',
          hi: 'करंट लगे व्यक्ति को देखकर पहली कार्रवाई क्या करें?',
          sat: 'ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱦᱚᱲ ᱧᱮᱞ ᱠᱟᱛᱮ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱚᱨᱟᱣ ᱫᱚᱨᱠᱟᱨ?'
        },
        options: [
          {
            id: 'opt_kill_power_hook',
            text: {
              en: 'Switch off main isolator / circuit breaker immediately OR use an insulated fiberglass rescue hook (NEVER touch with bare hands)',
              hi: 'तुरंत मुख्य स्विच/ब्रेकर बंद करें या इंसुलेटेड फाइबरग्लास हुक का उपयोग करें (नंगे हाथों से कभी न छुएं)',
              sat: 'ᱞᱚᱜᱚᱱ ᱢᱩᱬᱩᱛ ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ ᱥᱮ ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱛᱮ ᱚᱨ ᱥᱟᱦᱟᱭ ᱢᱮ'
            },
            isCorrect: true,
            explanation: {
              en: 'Touching a victim in contact with a live circuit will electrocute the rescuer immediately.',
              hi: 'सीधे हाथ लगाने से बचाने वाले को भी तेज करंट लग जाएगा।',
              sat: 'ᱛᱤ ᱛᱮ ᱡᱚᱴᱮᱫ ᱞᱮᱠᱷᱟᱱ ᱵᱟᱧᱪᱟᱣ ᱦᱚᱲ ᱦᱚᱸ ᱠᱟᱨᱮᱱᱴ ᱛᱮ ᱜᱩᱡᱩᱜ-ᱟ᱾'
            }
          },
          {
            id: 'opt_grab_hands',
            text: {
              en: 'Grab their hands and pull forcefully',
              hi: 'उनके हाथ पकड़कर पूरी ताकत से खींचें',
              sat: 'ᱩᱱᱤᱭᱟᱜ ᱛᱤ ᱥᱟᱵ ᱠᱟᱛᱮ ᱚᱨ ᱢᱮ'
            },
            isCorrect: false,
            explanation: {
              en: 'Fatal mistake! Human body conducts electric current.',
              hi: 'प्राणघातक गलती! बिजली आपके शरीर में भी प्रवाहित हो जाएगी।',
              sat: 'ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱵᱷᱩᱞ ᱠᱟᱱᱟ᱾'
            }
          }
        ],
        explanation: {
          en: 'Always de-energize the power source or use an insulated rescue stick to free an electrocuted victim.',
          hi: 'हमेशा पहले बिजली बंद करें या इंसुलेटेड छड़ी का प्रयोग करें।',
          sat: 'ᱡᱟᱣᱜᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ ᱥᱮ ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾'
        }
      }
    ]
  }
];

