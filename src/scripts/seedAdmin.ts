import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// 🔥 IMPORTANT → load .env.local (Next.js env file)
dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Admin credentials missing in .env.local");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "Admin" },
  role: { type: String, default: "admin" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("✅ Admin already exists with email:", ADMIN_EMAIL);
      await mongoose.disconnect();
      process.exit();
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await Admin.create({
      email: ADMIN_EMAIL,
      password: hashed,
      name: "Admin User",
      role: "admin",
      isActive: true,
    });

    console.log("✅ Admin created successfully with email:", ADMIN_EMAIL);
    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

seedAdmin();