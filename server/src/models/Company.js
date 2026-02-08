import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    industry: { type: String, required: true },
    subIndustry: { type: String, default: "" },
    website: { type: String, default: "" },
    description: { type: String, default: "" },

    // Headquarters & locations
    headquarters: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },
    locations: [
      {
        name: { type: String },
        type: {
          type: String,
          enum: ["plant", "office", "warehouse", "depot", "refinery", "other"],
        },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        coordinates: { lat: Number, lng: Number },
      },
    ],

    // Financial / Size info
    size: {
      type: String,
      enum: ["startup", "small", "medium", "large", "enterprise"],
      default: "medium",
    },
    employeeCount: { type: Number, default: 0 },
    annualRevenue: { type: String, default: "" },
    marketCap: { type: String, default: "" },

    // Contact
    contacts: [
      {
        name: { type: String },
        designation: { type: String },
        email: { type: String },
        phone: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Classification for HPCL DS
    productNeeds: [
      {
        productCode: { type: String }, // e.g. 'HSD', 'FO', 'Bitumen'
        productName: { type: String },
        estimatedVolume: { type: String },
        confidence: { type: Number, min: 0, max: 100 },
        inferredFrom: { type: String }, // source of inference
      },
    ],

    // Entity resolution
    aliases: [{ type: String }], // alternate names / abbreviations
    cin: { type: String, default: "" }, // Corporate Identity Number
    gst: { type: String, default: "" },
    pan: { type: String, default: "" },

    // Metadata
    tags: [{ type: String }],
    logo: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "active",
    },
    source: { type: String, default: "manual" }, // where this company was discovered
  },
  { timestamps: true },
);

companySchema.index({
  name: "text",
  industry: "text",
  "headquarters.city": "text",
});

const Company = mongoose.model("Company", companySchema);
export default Company;
