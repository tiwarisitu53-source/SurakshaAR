# ⛑️ SurakshaAR

### AR-Based Safety Training Platform for Jharkhand Mining Workers

> **Learn safety. Practice safely. Respond correctly.**

SurakshaAR is an interactive **Augmented Reality (AR) safety training platform** designed to help mining workers and trainees learn and practice critical safety procedures in a safer, more engaging environment.

The platform focuses on transforming traditional safety training into **interactive, scenario-based learning**, allowing workers to understand hazards, follow correct emergency procedures, and improve safety awareness without being exposed to real-world risks during training.

---
Demo Video



https://github.com/user-attachments/assets/364162d8-3403-4541-999a-723d82b0af04



Watch here: https://youtu.be/IUEoxlAxAU0

---
| Detail | Information |
|---|---|
| Hackathon | Smart India Hackathon 2026 |
| Problem Statement ID | SIH26041 |
| Problem Statement Title | AR-Based Vocational Training & Safety Certification Platform (Jharkhand Mining/Steel/Mica) |
| Theme | Smart Education |
| PS Category | Software |
| Team ID | 169665 |
| Team Name | I Can't Stop Winning |
| Live Project | https://remix-surakshaar-industrial-safety-training-compl-8115.ai.studio |
---

## The Problem

Workers in Jharkhand's mining, steel and mica industries are not getting safety training that works.

| Today's method | Why it fails |
|---|---|
| VR training | Too expensive for contractors and small units |
| Classroom sessions | Workers forget; nothing hands-on |
| Paper certificates | Easy to fake; prove nothing about understanding |

Jharkhand had the **highest number of fatal coal-mine accidents in India in 2022-23**, with **48 mining workers killed** (DGMS).

### Our Goal

SurakshaAR aims to bridge this gap through **immersive, interactive and scenario-based AR training**.

---

## Our Solution

**SURAKSHA-AR turns any Rs 8,000+ Android phone into a safety classroom.**

A worker trains in AR on their real surroundings, takes a scored test, and receives a QR certificate that anyone can verify and no one can forge.

## How It Works

```
Register  >  Pick language  >  Pick module  >  AR training  >  Test (80% to pass)
                                                                      |
         Admin verifies  <  QR + blockchain hash  <  Certificate  <---+
```

1. **Register** with worker ID and photo
2. **Choose** English, Hindi or Santali
3. **Train in AR**: hazard zones, PPE and evacuation routes appear over the real environment
4. **Take the test**: pass at 80%, retry if you fail
5. **Get certified**: certificate with QR code, hash stored on blockchain
6. **Verify**: employers and DGMS scan the QR to confirm it is genuine

## Why It Stands Out

| | VR Training | **SURAKSHA-AR** |
|---|---|---|
| Hardware | Costly headset | **Any Rs 8K+ Android phone** |
| Internet | Often required | **Fully offline, syncs later** |
| Language | Mostly English | **English, Hindi, Santali (with audio)** |
| Certificate | Paper or PDF | **QR + blockchain, tamper-proof** |
| Cost per worker | High | **Near zero** |

## Key Features

- **AR Training Modules**: Fire and Explosion, Gas Leak and Confined Space
- **Offline-First**: modules, tests and results work with zero connectivity and auto-sync when online
- **Assessment Engine**: scored quizzes, 80% pass mark, retry on fail
- **Blockchain-Secured Certificates**: hash anchored on-chain, so records stay valid even if the database is compromised
- **Tribal Workforce Ready**: full UI in Santali, audio support and an AI voice assistant
- **Admin Dashboard**: worker-wise compliance, certification status and pass/fail analytics

## Tech Stack

| Layer | Technology |
|---|---|
| AR Engine | Unity, AR Foundation, ARCore |
| Offline Storage | Room DB / SQLite |
| Backend | Node.js, Firebase |
| Blockchain | Polygon / Hyperledger (certificate-hash ledger) |
| QR | ZXing |
| Admin Dashboard | React.js, Chart.js |
| Security | Android Keystore, on-device signing |

---

## Project Structure

```text
SurakshaAR/
│
├── public/              # Public assets
├── src/                 # Application source code
│
├── assets/
│   └── .aistudio/       # AI Studio project metadata
│
├── server.ts            # Server configuration
├── index.html           # Application entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── metadata.json        # Project metadata
└── .env.example         # Environment variable template
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/tiwarisitu53-source/SurakshaAR.git
```

### 2. Navigate to the project

```bash
cd SurakshaAR
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using the provided template:

```bash
cp .env.example .env
```

Add the required environment variables to `.env`.

> **Never commit API keys or other secrets to GitHub.**

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

---

## Testing

Before deployment, build the application to verify that the production bundle works correctly:

```bash
npm run build
```

You can also preview the production build using:

```bash
npm run preview
```

---

## Training Flow

```text
       ┌────────────────────┐
       │   Trainee Enters   │
       │    Training App    │
       └─────────┬──────────┘
                 ↓
       ┌────────────────────┐
       │ Select Safety      │
       │ Scenario           │
       └─────────┬──────────┘
                 ↓
       ┌────────────────────┐
       │ Identify Hazards   │
       └─────────┬──────────┘
                 ↓
       ┌────────────────────┐
       │ Perform Correct    │
       │ Safety Actions     │
       └─────────┬──────────┘
                 ↓
       ┌────────────────────┐
       │ Assessment &       │
       │ Feedback           │
       └─────────┬──────────┘
                 ↓
       ┌────────────────────┐
       │ Improved Safety    │
       │ Readiness          │
       └────────────────────┘
```

---

## Target Users

SurakshaAR is primarily designed for:

* Mining workers
* New industrial recruits
* Vocational trainees
* Safety trainers
* Industrial organizations
* Mining and manufacturing institutions

The initial focus is on workers operating in **Jharkhand's mining and industrial ecosystem**.

---

## Impact

- **Safer workers**: hands-on training that people actually remember
- **Near-zero cost**: no VR rigs; certificates travel with the worker across contractors
- **Compliance ready**: tamper-proof, auditable record for Factories Act and Mines Act periodic certification (DGMS)
- **Big market**: Jharkhand produced 206M tonnes of coal in FY 2024-25 (about 19.68% of India's output)

---

## Risks and Mitigation

| Risk | Our answer |
|---|---|
| AR accuracy on budget phones | Marker and plane-anchored AR for v1 |
| Blockchain cost at scale | Store only hashes on a low-cost permissioned or testnet chain |
| Certificate acceptance | Offline-first design with on-device signing; DGMS-auditable records |

## References

[DGMS Accident Statistics](https://accident-statistics.dgms.gov.in/) | [Factly: Fatal and serious accidents in India's mines](https://factly.in/tracking-fatal-and-serious-accidents-in-indias-mines/) | [PIB: IIT (ISM) Dhanbad VRMS](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2207948) | [CHRP-INDIA](https://www.chrp-india.com/) | [Tecknotrove](https://tecknotrove.com/)

---

**SURAKSHA-AR: Safer workers. Verifiable skills. Zero VR cost.**
