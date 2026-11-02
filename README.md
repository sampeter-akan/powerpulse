# PowerPulse™ — Household Energy Companion

> **An IDEO-inspired, human-centered electricity operating system and AI energy copilot that turns prepaid power into a predictable, health-protecting, and money-saving service.**

---

## ⚡ Overview

Prepaid electricity in emerging markets and around the world is often an opaque, anxious experience. More than half of utility customers lack real-time visibility into how rapidly their units burn, leaving families exposed to midnight blackouts, spoiled food, disrupted remote work, and dangerous alternatives.

**PowerPulse** addresses this global human need through an **IDEO human-centered design approach**—starting from the lived reality of households: irregular income, shared family phones, intermittent grid supply, and the emotional stress of keeping the lights on.

### 👤 Creator & Conception
- **Conceived, Designed & Developed by:** **Samuel Peter**
- **Architecture:** Human-Centered Design (IDEO Health & Wellbeing Principles)
- **AI Engine:** Google Gemini 3.8 Flash (`@google/genai`)

---

## 🌟 Core Pillars

1. **Predictive Balance Runtime**: Estimates remaining electricity down to exact days and hours based on active appliances—eliminating surprise power cuts.
2. **Health Protection Lifeline**: Locks a protected energy reserve for life-critical equipment (insulin refrigeration, pediatric antibiotics, CPAP, oxygen concentrators) with caregiver emergency dispatch alerts.
3. **Smart Top-Up Wallet & STS Tokens**: Micro-vend flexible units in small denominations, split bills with flatmates/family, and generate standard 20-digit STS tokens.
4. **Community Outage Radar**: Real-time crowdsourced feeder monitoring—answering *"Is it just my house or the whole street?"* with neighbor solar-sharing beacons.
5. **Power Safety Net**: Transparent, capped, zero-interest emergency energy advances (15 kWh) when banking apps are offline or paydays are delayed.
6. **Solar & Inverter Architect**: Right-sizes solar panel, battery, and inverter capacity from actual usage to permanently eliminate generator fuel costs.

---

## 🤖 Global Utility AI Suite (Powered by Gemini 3.8 Flash)

PowerPulse incorporates 4 utility-grade AI engines designed to integrate with electricity distribution companies globally:

1. **Multimodal Meter Vision & OCR**: Inspects physical prepaid & smart meter LCD screens with computer vision, extracting kWh balance, STS tokens, voltage, and anti-tamper codes even through dust, glare, or cracked glass.
2. **"Survive Till Payday" Demand-Response**: Dynamically calculates hourly appliance load-shedding and peak-shaving tactics to guarantee your remaining units last until salary day.
3. **Official Regulatory Tariff & Bill Compliance Auditor**: Audits billed rates against official regulatory price orders (e.g. NERC Multi-Year Tariff Order Bands A–E in Nigeria, EPRA tiers in Kenya, Eskom, ECG, PURC) and drafts formal dispute petition letters with legal citations.
4. **Life-Critical Cold-Chain Shield**: Calculates thermal decay curves for biologicals and vaccines, predicting exactly when domestic refrigerators will exceed safe storage temperatures (+8°C).

---

## 🌍 Global Utility Awareness

PowerPulse features instant, 1-tap switching across local and international grid architectures:
- **Nigeria (11 DisCos)**: Port Harcourt Electricity Disco (PHED), Ikeja Electric (IE/IKEDC), Eko (EKEDC), Abuja (AEDC), Ibadan (IBEDC), Enugu (EEDC), Benin (BEDC), Kano (KEDC), Kaduna (KAEDCO), Jos (JEDC), Yola (YEDC)
- **Kenya**: Kenya Power & Lighting Company (KPLC Prepaid & Postpaid)
- **South Africa**: Eskom Direct (Homelight/Homepower), City Power Johannesburg, City of Cape Town
- **Ghana**: Electricity Company of Ghana (ECG Prepaid), Northern Electricity (NEDCo)
- **India**: BESCOM (Bangalore), Tata Power (Mumbai/Delhi), Adani Electricity
- **United States**: ConEdison (NY), PG&E (California), Oncor (Texas)
- **United Kingdom**: Octopus Energy (Agile / Flexible), British Gas

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Audio API
- **Backend**: Node.js, Express, tsx
- **AI SDK**: `@google/genai` (Gemini 3.8 Flash)
- **Build Tool**: Vite
- **Deployment Ready**: Vercel Serverless / Cloud Run / Docker

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ installed
- A Google Gemini API Key (get one free at [Google AI Studio](https://aistudio.google.com/))

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd powerpulse
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to GitHub & Vercel

### Step 1: Initialize Git and Push to GitHub
```bash
git init
git add .
git commit -m "feat: PowerPulse initial release with Gemini AI utility suite"
git branch -M main
git remote add origin https://github.com/<your-username>/powerpulse.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
2. Select your `powerpulse` GitHub repository.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key.
4. Click **Deploy**. Vercel will automatically build the static frontend and mount the serverless `/api` routes via `vercel.json`!

---

## 📄 License & Trademark

Copyright © 2026 **Samuel Peter**. All Rights Reserved.  
PowerPulse™ is a trademark of Samuel Peter.
