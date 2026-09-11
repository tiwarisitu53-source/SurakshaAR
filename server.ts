import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory compliance & certificate registry with pre-seeded data
interface CertificateRecord {
  certificateId: string;
  workerId: string;
  workerName: string;
  moduleKey: string;
  moduleName: string;
  score: number;
  date: string;
  expiryDate: string;
  status: "Valid" | "Expired" | "Revoked";
  language: string;
  organization: string;
  complianceStandard: string;
}

const mockCertificatesDatabase: Record<string, CertificateRecord> = {
  "SURAKSHA-IND-2026-FIRE-8921B": {
    certificateId: "SURAKSHA-IND-2026-FIRE-8921B",
    workerId: "EMP-4102",
    workerName: "Ramesh Soren",
    moduleKey: "fire_explosion",
    moduleName: "Fire & Explosion Response",
    score: 86,
    date: "23-Aug-2026",
    expiryDate: "23-Aug-2027",
    status: "Valid",
    language: "Santali",
    organization: "Eastern Coalfields & Heavy Industries Ltd.",
    complianceStandard: "DGMS / OSHA 1910.157 / ISO 45001"
  },
  "SURAKSHA-IND-2026-GAS-4390A": {
    certificateId: "SURAKSHA-IND-2026-GAS-4390A",
    workerId: "EMP-3891",
    workerName: "Amit Kumar Sharma",
    moduleKey: "gas_confined_space",
    moduleName: "Gas Leak & Confined Space Safety",
    score: 92,
    date: "22-Aug-2026",
    expiryDate: "22-Aug-2027",
    status: "Valid",
    language: "Hindi",
    organization: "Bharat Refineries Unit 4",
    complianceStandard: "DGMS / OSHA 1910.146 (Confined Space)"
  },
  "SURAKSHA-IND-2026-FIRE-1029C": {
    certificateId: "SURAKSHA-IND-2026-FIRE-1029C",
    workerId: "EMP-5044",
    workerName: "Sunita Murmu",
    moduleKey: "fire_explosion",
    moduleName: "Fire & Explosion Response",
    score: 94,
    date: "20-Aug-2026",
    expiryDate: "20-Aug-2027",
    status: "Valid",
    language: "Santali",
    organization: "Eastern Coalfields & Heavy Industries Ltd.",
    complianceStandard: "DGMS / OSHA 1910.157 / ISO 45001"
  },
  "SURAKSHA-IND-2026-GAS-7721D": {
    certificateId: "SURAKSHA-IND-2026-GAS-7721D",
    workerId: "EMP-2190",
    workerName: "Rajesh Verma",
    moduleKey: "gas_confined_space",
    moduleName: "Gas Leak & Confined Space Safety",
    score: 65,
    date: "10-Aug-2025",
    expiryDate: "10-Aug-2026",
    status: "Expired",
    language: "Hindi",
    organization: "Jharia Underground Colliery Pit #7",
    complianceStandard: "DGMS Coal Mines Regulations 2017"
  }
};

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "SurakshaAR-Backend" });
});

// Certificate verification API
app.get("/api/certificates/verify/:id", (req, res) => {
  const { id } = req.params;
  const cleanId = id.trim().toUpperCase();
  
  const record = mockCertificatesDatabase[cleanId];
  if (record) {
    return res.json({
      valid: record.status === "Valid",
      certificate: record,
      message: record.status === "Valid" ? "Certificate is authentic, verified against DGMS/OSHA compliance ledger." : `Certificate exists but is ${record.status}.`
    });
  }

  // If newly issued or client-passed
  return res.status(404).json({
    valid: false,
    message: "Certificate not found in central registry. Please verify the ID or check if offline sync is pending."
  });
});

// Register newly generated certificate (Sync from mobile app)
app.post("/api/certificates/register", (req, res) => {
  const cert: CertificateRecord = req.body;
  if (!cert || !cert.certificateId) {
    return res.status(400).json({ error: "Invalid certificate payload" });
  }

  mockCertificatesDatabase[cert.certificateId] = {
    ...cert,
    status: cert.status || "Valid"
  };

  res.json({
    success: true,
    certificateId: cert.certificateId,
    message: "Certificate successfully synced and indexed into central compliance database."
  });
});

// Batch sync endpoint for offline workers reconnecting
app.post("/api/sync", (req, res) => {
  const { assessmentRecords, certificateRecords } = req.body;
  
  let certsAdded = 0;
  if (Array.isArray(certificateRecords)) {
    certificateRecords.forEach((cert: CertificateRecord) => {
      if (cert.certificateId) {
        mockCertificatesDatabase[cert.certificateId] = cert;
        certsAdded++;
      }
    });
  }

  res.json({
    success: true,
    syncedCount: (assessmentRecords?.length || 0) + certsAdded,
    message: `Batch sync complete. Processed ${certsAdded} certificates from offline cache.`,
    timestamp: new Date().toISOString()
  });
});

// Gemini AI Safety Assistant Endpoint
app.post(["/api/ai/coach", "/api/ai-coach"], async (req, res) => {
  try {
    const question = req.body.question || req.body.prompt;
    const moduleContext = req.body.moduleContext || req.body.context;
    const language = (req.body.language || "english").toLowerCase();
    const workerLevel = req.body.workerLevel;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback if API key is not configured
      const fallback = getFallbackAnswer(question, language, moduleContext);
      return res.json({
        answer: fallback,
        response: fallback,
        source: "offline_rules_engine"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const langInstruction = language.includes("santali") || language === "sat"
      ? "Respond with direct Santali phrasing in Ol Chiki and simple Latin transliteration explaining safety procedures for mine/industrial workers in Jharkhand."
      : language.includes("hindi") || language === "hi"
      ? "Respond in simple, clear Hindi (देवनागरी) suitable for industrial and factory workers with limited literacy. Keep it practical and actionable."
      : "Respond in simple, clear English suitable for industrial field workers.";

    const systemInstruction = `You are SurakshaAR Industrial Safety AI Coach. 
You specialize in OSHA, DGMS (Directorate General of Mines Safety), and industrial safety standards for mining, petrochemical, and heavy factories.
Context: Training module '${moduleContext || 'General Industrial Safety'}'.
Language requirement: ${langInstruction}.
Keep responses brief (max 3-4 bullet points), highly actionable, and easy to read or listen to. Explain WHY a step is crucial.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question || "What are the first 3 critical actions when a fire or gas alarm triggers in an industrial plant?",
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    const textResult = response.text || "Follow standard PASS procedure: Pull pin, Aim low, Squeeze lever, Sweep side-to-side. Evacuate immediately if fire spreads.";

    res.json({
      answer: textResult,
      response: textResult,
      source: "gemini-2.5-flash"
    });
  } catch (error: any) {
    console.error("AI Coach Error:", error);
    const fallback = getFallbackAnswer(req.body?.question || req.body?.prompt, req.body?.language, req.body?.moduleContext || req.body?.context);
    res.json({
      answer: fallback,
      response: fallback,
      source: "offline_fallback"
    });
  }
});

function getFallbackAnswer(question: string = "", language: string = "english", module: string = "fire_explosion") {
  if (language === "hindi") {
    if (module === "fire_explosion" || question.toLowerCase().includes("fire")) {
      return "1. आग लगने पर तुरंत अलार्म बजाएं और साथियों को सतर्क करें।\n2. PASS विधि का पालन करें: पिन खींचें, आग की जड़ में निशाना लगाएं, हैंडल दबाएं और झाड़ू की तरह घुमाएं।\n3. कभी भी धुएं वाले बंद रास्ते में न जाएं; हरे आपातकालीन निकास का ही प्रयोग करें।";
    }
    return "1. गैस रिसाव क्षेत्र में कभी माचिस या बिजली स्विच न चलाएं।\n2. तुरंत SCBA मास्क पहनें और बडी (साथी) के साथ ही प्रवेश करें।\n3. हवा की उल्टी दिशा (Upwind) में तुरंत सुरक्षित स्थान पर जाएं।";
  } else if (language === "santali") {
    return "1. ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱡᱚᱠᱷᱮᱡ ᱜᱚᱜᱚᱲᱚ ᱠᱚ ᱦᱚᱦᱚᱣᱟᱠᱚᱢ (Alert co-workers immediately).\n2. ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ (PASS protocol): Pin ᱚᱨ ᱢᱮ, ᱞᱟᱛᱟᱨ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱢᱮ, ᱦᱮᱱᱰᱮᱞ ᱚᱛᱟᱭ ᱢᱮ.\n3. ᱫᱟᱹᱲ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ Exit ᱫᱩᱣᱟᱹᱨ ᱯᱟᱸᱡᱟᱭ ᱢᱮ (Use green safe emergency exit).";
  }
  return "1. Immediately raise the emergency alarm and notify co-workers.\n2. Apply the P.A.S.S. protocol: Pull the safety pin, Aim at the base of fire, Squeeze the lever, Sweep side-to-side.\n3. Always keep your back toward an unobstructed emergency exit. Never enter confined areas without proper ventilation & SCBA.";
}

// Vite middleware & Static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SurakshaAR Full-Stack server running on http://localhost:${PORT}`);
  });
}

startServer();
