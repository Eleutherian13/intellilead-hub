import Joi from "joi";

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, query, params)
 */
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    req[property] = value;
    next();
  };
};

// ============================================
// Common Validation Schemas
// ============================================

export const leadSchemas = {
  create: Joi.object({
    title: Joi.string().required().min(3).max(500),
    companyName: Joi.string().required().min(2).max(200),
    company: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId
    source: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    sourceUrl: Joi.string().uri().allow(""),
    rawContent: Joi.string().allow(""),
    inferredProducts: Joi.array().items(
      Joi.object({
        productCode: Joi.string().required(),
        productName: Joi.string().required(),
        confidence: Joi.number().min(0).max(100),
      })
    ),
    territory: Joi.string().allow(""),
    priority: Joi.string().valid("critical", "high", "medium", "low"),
    estimatedValue: Joi.number().min(0),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(500),
    status: Joi.string().valid(
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost"
    ),
    priority: Joi.string().valid("critical", "high", "medium", "low"),
    territory: Joi.string(),
    estimatedValue: Joi.number().min(0),
    assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  }),

  assign: Joi.object({
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    territory: Joi.string().allow(""),
  }),

  feedback: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow(""),
  }),
};

export const companySchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(200),
    industry: Joi.string().allow(""),
    subIndustry: Joi.string().allow(""),
    revenue: Joi.object({
      amount: Joi.number().min(0),
      currency: Joi.string().default("INR"),
    }),
    employeeCount: Joi.number().min(0),
    cin: Joi.string().allow(""),
    gst: Joi.string().allow(""),
    website: Joi.string().uri().allow(""),
    locations: Joi.array().items(
      Joi.object({
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string().default("India"),
      })
    ),
    contacts: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        designation: Joi.string().allow(""),
        email: Joi.string().email().allow(""),
        phone: Joi.string().allow(""),
      })
    ),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200),
    industry: Joi.string(),
    subIndustry: Joi.string(),
    revenue: Joi.object({
      amount: Joi.number().min(0),
      currency: Joi.string(),
    }),
    employeeCount: Joi.number().min(0),
    cin: Joi.string(),
    gst: Joi.string(),
    website: Joi.string().uri(),
    isCustomer: Joi.boolean(),
    customerType: Joi.string().valid("existing", "prospect", "churned"),
    locations: Joi.array().items(
      Joi.object({
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
      })
    ),
    contacts: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        designation: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
      })
    ),
  }),
};

export const sourceSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(3).max(200),
    url: Joi.string().uri().required(),
    type: Joi.string()
      .valid(
        "tender_portal",
        "news",
        "industry_report",
        "corporate_website",
        "government",
        "trade_journal",
        "social_media"
      )
      .required(),
    crawlSchedule: Joi.string().allow(""),
    isActive: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(200),
    url: Joi.string().uri(),
    type: Joi.string().valid(
      "tender_portal",
      "news",
      "industry_report",
      "corporate_website",
      "government",
      "trade_journal",
      "social_media"
    ),
    crawlSchedule: Joi.string(),
    isActive: Joi.boolean(),
  }),
};

export const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string(),
    order: Joi.string().valid("asc", "desc").default("desc"),
  }),

  leadFilters: Joi.object({
    status: Joi.string(),
    priority: Joi.string(),
    territory: Joi.string(),
    source: Joi.string(),
    assignedTo: Joi.string(),
    minScore: Joi.number().min(0).max(100),
    maxScore: Joi.number().min(0).max(100),
    search: Joi.string(),
  }),
};

// Sanitization middleware to prevent NoSQL injection
export const sanitize = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === "object" && value !== null) {
      // Remove potential MongoDB operators
      Object.keys(value).forEach((key) => {
        if (key.startsWith("$") || key.startsWith("_")) {
          delete value[key];
        } else {
          sanitizeValue(value[key]);
        }
      });
    }
    return value;
  };

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);

  next();
};
