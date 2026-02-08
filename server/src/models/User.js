import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "sales_officer", "manager"],
      default: "sales_officer",
    },
    territory: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    whatsappOptIn: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      teams: { type: Boolean, default: false },
    },
    pushSubscription: { type: mongoose.Schema.Types.Mixed, default: null },
    teamsWebhookUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
