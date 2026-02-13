import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IntelliLead Hub API",
      version: "1.0.0",
      description: "B2B Lead Intelligence Platform API for HPCL Direct Sales",
      contact: {
        name: "HPCL DS Team",
        email: "support@leadintel.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.intellilead.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Lead: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Lead ID",
            },
            title: {
              type: "string",
              description: "Lead title",
            },
            companyName: {
              type: "string",
              description: "Company name",
            },
            company: {
              type: "string",
              description: "Company reference ID",
            },
            source: {
              type: "string",
              description: "Source reference ID",
            },
            sourceUrl: {
              type: "string",
              description: "Source URL",
            },
            rawContent: {
              type: "string",
              description: "Raw scraped content",
            },
            inferredProducts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productCode: { type: "string" },
                  productName: { type: "string" },
                  confidence: { type: "number" },
                },
              },
            },
            score: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Lead score",
            },
            priority: {
              type: "string",
              enum: ["critical", "high", "medium", "low"],
              description: "Lead priority",
            },
            status: {
              type: "string",
              enum: [
                "new",
                "contacted",
                "qualified",
                "proposal",
                "negotiation",
                "won",
                "lost",
              ],
              description: "Lead status",
            },
            territory: {
              type: "string",
              description: "Sales territory",
            },
            assignedTo: {
              type: "string",
              description: "Assigned user ID",
            },
            estimatedValue: {
              type: "number",
              description: "Estimated deal value",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Company: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Company ID",
            },
            name: {
              type: "string",
              description: "Company name",
            },
            normalizedName: {
              type: "string",
              description: "Normalized company name",
            },
            industry: {
              type: "string",
              description: "Industry",
            },
            subIndustry: {
              type: "string",
              description: "Sub-industry",
            },
            website: {
              type: "string",
              description: "Company website",
            },
            employeeCount: {
              type: "number",
              description: "Number of employees",
            },
            locations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  city: { type: "string" },
                  state: { type: "string" },
                  country: { type: "string" },
                },
              },
            },
            contacts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  designation: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        Source: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Source ID",
            },
            name: {
              type: "string",
              description: "Source name",
            },
            url: {
              type: "string",
              description: "Source URL",
            },
            type: {
              type: "string",
              enum: [
                "tender_portal",
                "news",
                "industry_report",
                "corporate_website",
                "government",
                "trade_journal",
                "social_media",
              ],
              description: "Source type",
            },
            isActive: {
              type: "boolean",
              description: "Is source active",
            },
            crawlSchedule: {
              type: "string",
              description: "Cron expression for crawl schedule",
            },
            lastCrawled: {
              type: "string",
              format: "date-time",
              description: "Last crawl timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Dashboard",
        description: "Dashboard statistics and charts",
      },
      {
        name: "Leads",
        description: "Lead management operations",
      },
      {
        name: "Companies",
        description: "Company management operations",
      },
      {
        name: "Sources",
        description: "Source management and crawling",
      },
      {
        name: "Notifications",
        description: "Notification management",
      },
      {
        name: "Analytics",
        description: "Analytics and reporting",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/index.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
