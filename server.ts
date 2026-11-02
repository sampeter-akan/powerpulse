import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isVercel = Boolean(process.env.VERCEL);
const isProduction = process.env.NODE_ENV === 'production' || isVercel;

// Increase limit for base64 camera image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Server-side Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    service: 'PowerPulse Global Utility Intelligence Engine',
  });
});

// 1. Multimodal Global Meter LCD & Error Diagnostic
app.post('/api/ai/meter-scan', async (req, res) => {
  try {
    const { imageBase64, countryName, utilityName, meterBrand } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server. Please check Settings > Secrets.',
      });
    }

    // Strip data URL header if present (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const prompt = `You are a world-class Smart Meter & Electricity Grid Diagnostic AI for global power utility companies (such as ${utilityName || 'local DisCo'} in ${countryName || 'Global'}).
Inspect this prepaid / smart electricity meter LCD display photo or STS token receipt carefully.

Analyze the image and return a strictly valid JSON object with these exact keys:
{
  "detectedMeterType": "string (e.g., Single Phase STS Prepaid, Three Phase Smart AMR, Bi-directional Solar Meter, Keypad CIU, or Token Slip)",
  "detectedBrand": "string (e.g., MOJEC, Conlog, Hexing, Chint, EDMI, Landis+Gyr, Itron, or Unknown)",
  "extractedKwh": "number (the remaining electricity balance in kWh shown on the LCD, or null if unreadable)",
  "meterNumber": "string (the serial / account number if visible, or 'Not visible')",
  "statusCondition": "string (e.g., 'Normal Active', 'Low Credit Alert', 'Relay Tripped / Disconnected', 'Tamper Detected', or 'Overload')",
  "errorCode": "string or null (e.g., 'rLY-OFF', 'E-01', 'Tamper 02', 'Negative Credit')",
  "diagnosticExplanation": "string (2-3 sentences explaining in plain language what the meter display indicates, especially for utility engineers or homeowners)",
  "keypadActionInstructions": "string (exact keypad code or button press sequence to check or clear status, e.g. 'Key 001 Enter' or 'Dial STS unlock code')",
  "utilityComplianceNotice": "string (guidance adhering to global utility standards for ${utilityName || 'the distribution company'})",
  "confidenceScore": "number (0 to 100)"
}

Do not wrap in markdown quotes if possible, output pure JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean potential code fences
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/meter-scan:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze meter image with Gemini',
    });
  }
});

// 2. Global Demand-Response & Peak Shaving Copilot ("Survive Till Payday")
app.post('/api/ai/power-copilot', async (req, res) => {
  try {
    const {
      currentBalanceKwh,
      targetDays,
      activeAppliances,
      countryName,
      utilityName,
      currencyCode,
      currencySymbol,
      tariffRatePerKwh,
      hasHealthSafeguard,
      medicalDeviceDetails,
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const prompt = `You are the Lead Grid Demand-Response & Household Energy AI Advisor for ${utilityName || 'Power Utility'} in ${countryName || 'Global'}.
The household has:
- Current Remaining Balance: ${currentBalanceKwh} kWh
- Target Duration Required: ${targetDays} days until next budget/recharge
- Current Active / Key Appliances: ${JSON.stringify(activeAppliances || [])}
- Local Tariff: ${currencySymbol || '$'}${tariffRatePerKwh || 150}/kWh (${currencyCode || 'USD'})
- Health Lifeline Buffer Active: ${hasHealthSafeguard ? `YES (${medicalDeviceDetails || 'Refrigerated Insulin / Pediatric Care'})` : 'NO'}

Global utilities admire apps that incentivize customers to reduce grid strain during peak hours (peak shaving) while protecting essential human well-being.

Generate a comprehensive, human-centered energy survival & grid-optimization plan in JSON with the following structure:
{
  "survivalFeasibility": "string ('Comfortable', 'Sustainable with Shifts', 'Tight Rationing Required', or 'Emergency Outage Imminent')",
  "predictedDailyBudgetKwh": "number (recommended daily kWh consumption ceiling)",
  "peakHourAvoidanceStrategy": "string (utility-aligned demand-response advice explaining which high-draw appliances to turn off during 6 PM - 10 PM peak grid stress)",
  "applianceActionList": [
    {
      "applianceName": "string",
      "recommendedAction": "string (e.g. 'Limit to 2 hrs afternoon only', 'Unplug standby draw', 'Run on low compressor mode')",
      "kwhSavedPerDay": "number",
      "monetarySavingsDaily": "string (formatted with ${currencySymbol || '$'})"
    }
  ],
  "hourlySchedule": [
    { "timeWindow": "Morning (06:00 - 12:00)", "guidance": "string", "powerAllocationKwh": "number" },
    { "timeWindow": "Afternoon (12:00 - 18:00)", "guidance": "string", "powerAllocationKwh": "number" },
    { "timeWindow": "Grid Peak Evening (18:00 - 22:00)", "guidance": "string", "powerAllocationKwh": "number" },
    { "timeWindow": "Overnight (22:00 - 06:00)", "guidance": "string", "powerAllocationKwh": "number" }
  ],
  "healthColdChainAdvice": "string (specific safety protocols for medical supplies or vulnerable family members)",
  "utilityGridBenefit": "string (brief note on how this household's load-shifting helps prevent local feeder transformer overloading in ${utilityName || 'the distribution network'})"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/power-copilot:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate power rationing plan',
    });
  }
});

// 3. Global Tariff Compliance & Token Bill Auditor
app.post('/api/ai/tariff-bill-audit', async (req, res) => {
  try {
    const {
      billOrTokenText,
      countryName,
      utilityName,
      currencyCode,
      currencySymbol,
      tariffBand,
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const prompt = `You are a Global Utility Regulatory Compliance & Tariff Auditor specializing in energy billing across ${countryName || 'Global'} (${utilityName || 'Local Distribution Company'}).
The customer provided this token transaction receipt, SMS bill, or meter voucher inquiry:
"${billOrTokenText}"

Their registered utility: ${utilityName || 'Distribution Company'} (${countryName || 'Global'})
Tariff Classification: ${tariffBand || 'Residential Standard / Band A'}
Currency: ${currencyCode || 'NGN'} (${currencySymbol || '₦'})

Analyze this bill or token text thoroughly and output pure JSON:
{
  "isValidTokenOrBill": "boolean",
  "auditSummary": "string (executive summary of the purchase/bill)",
  "extractedUnitsKwh": "number or null",
  "totalAmountPaid": "number or null",
  "effectiveRatePerKwh": "number or null",
  "breakdownItems": [
    { "name": "string (e.g. Energy Charge, VAT / Sales Tax, Meter Maintenance / Fixed Charge)", "amount": "string" }
  ],
  "tariffDiscrepancyFound": "boolean (true if overcharged, unexpected deductions, or wrong tariff band applied)",
  "plainCustomerExplanation": "string (clear 2-3 sentences explaining what was charged and whether it complies with regulatory tariffs)",
  "formalDisputeDraft": "string or null (a polite, professional dispute notice referencing regulatory guidelines like NERC, Ofgem, or PURC, ready to send to ${utilityName || 'Customer Care'})",
  "recommendedAction": "string (clear next step for the customer)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/tariff-bill-audit:', error);
    res.status(500).json({
      error: error?.message || 'Failed to audit utility bill or token',
    });
  }
});

// 4. Vulnerable Customer Life-Support & Cold-Chain Medication Engine
app.post('/api/ai/health-coldchain', async (req, res) => {
  try {
    const {
      medicationName,
      ambientTempC,
      refrigeratorType,
      backupSource,
      utilityName,
      countryName,
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const prompt = `You are a Medical Cold-Chain & Vulnerable Energy Consumer Safety Specialist.
Global utilities maintain "Priority Services Registers" (PSR) or "Medically Fragile Customer Programs" to protect life-support equipment and refrigerated drugs during outages.

Household Situation:
- Medication or Medical Device: ${medicationName || 'Insulin (Glargine/Humalog) and Pediatric Antibiotics'}
- Ambient Room Temperature: ${ambientTempC || 31}°C
- Refrigerator Insulation Type: ${refrigeratorType || 'Standard Domestic Refrigerator with Freezer Compartment'}
- Available Backup: ${backupSource || 'Small 1kVA Inverter / Generator intermittent'}
- Distribution Grid: ${utilityName || 'Regional Utility'} in ${countryName || 'Global'}

Provide a life-critical energy safeguarding assessment in JSON:
{
  "criticalTempRange": "string (e.g. '+2°C to +8°C')",
  "safeThermalInertiaHours": "number (estimated hours the closed domestic fridge will stay within safe limits before spoilage occurs at ${ambientTempC || 31}°C)",
  "urgencyLevel": "string ('Stable', 'Caution', or 'Critical Risk')",
  "emergencyColdBufferProtocols": [
    "string (step-by-step physical action, like wrapping in frozen ice packs, keeping door sealed, thermos flask water bath)"
  ],
  "minimumSolarInverterRequirements": {
    "recommendedBatteryKwh": "number",
    "recommendedInverterWatts": "number",
    "runTimeHoursOnSolar": "string"
  },
  "utilityPriorityRegisterStep": "string (exact instruction for the family to register as a Medically Vulnerable Customer with ${utilityName || 'the utility'} to receive priority restoration notices)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/health-coldchain:', error);
    res.status(500).json({
      error: error?.message || 'Failed to assess medical cold-chain risk',
    });
  }
});

// Mount Vite middleware in local development, or serve static files in standalone Node production
if (!isProduction && !isVercel) {
  const { createServer: createViteServer } = await import('vite');
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';
  const vite = await createViteServer({
    server: { 
      middlewareMode: true, 
      host: '0.0.0.0', 
      port,
      hmr: isHmrDisabled ? false : undefined,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else if (!isVercel) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Only start standalone HTTP server when not running in Vercel serverless functions
if (!isVercel) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`PowerPulse Global Utility Server listening on http://0.0.0.0:${port}`);
  });
}

export default app;
