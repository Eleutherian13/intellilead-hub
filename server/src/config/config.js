import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/lead-intel",
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886",
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  scraping: {
    intervalMinutes: parseInt(process.env.SCRAPE_INTERVAL_MINUTES || "60"),
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SCRAPES || "5"),
  },
  // HPCL Direct Sales Product Portfolio
  hpProducts: [
    {
      code: "MS",
      name: "Motor Spirit (Petrol)",
      category: "Light Distillates",
    },
    { code: "HSD", name: "High Speed Diesel", category: "Middle Distillates" },
    { code: "LDO", name: "Light Diesel Oil", category: "Middle Distillates" },
    { code: "FO", name: "Furnace Oil", category: "Heavy Ends" },
    { code: "LSHS", name: "Low Sulphur Heavy Stock", category: "Heavy Ends" },
    {
      code: "SKO",
      name: "Superior Kerosene Oil",
      category: "Middle Distillates",
    },
    { code: "Hexane", name: "Hexane", category: "Specialty" },
    { code: "Solvent1425", name: "Solvent 1425", category: "Specialty" },
    { code: "MTO", name: "Mineral Turpentine Oil (MTO 2445)", category: "Specialty" },
    { code: "Bitumen", name: "Bitumen", category: "Heavy Ends" },
    { code: "MarineFuels", name: "Marine Fuels", category: "Specialty" },
    { code: "Sulphur", name: "Sulphur", category: "By-Products" },
    { code: "Propylene", name: "Propylene", category: "Petrochemicals" },
    { code: "JBO", name: "Jute Batching Oil", category: "Specialty" },
    { code: "SKO_NonPDS", name: "SKO (Non-PDS / Industrial)", category: "Middle Distillates" },
  ],
};

export default config;
