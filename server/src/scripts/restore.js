#!/usr/bin/env node

/**
 * Database Restore Script
 * Restores a MongoDB database from backup
 * Usage: node restore.js <backup-path>
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const execAsync = promisify(exec);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lead-intel";
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), "backups");

async function restoreBackup(backupPath) {
  try {
    console.log("🔄 Starting database restore...");
    console.log(`📁 Restore from: ${backupPath}`);

    // Check if backup exists
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupPath}`);
    }

    // If backup is compressed, extract it first
    let extractedPath = backupPath;
    if (backupPath.endsWith(".tar.gz")) {
      console.log("📦 Extracting compressed backup...");
      const tempDir = path.join(BACKUP_DIR, `temp-${Date.now()}`);
      fs.mkdirSync(tempDir, { recursive: true });

      await execAsync(`tar -xzf "${backupPath}" -C "${tempDir}"`);

      // Find the extracted backup directory
      const files = fs.readdirSync(tempDir);
      if (files.length === 0) {
        throw new Error("No files found in backup archive");
      }
      extractedPath = path.join(tempDir, files[0]);
    }

    // Parse MongoDB URI
    const url = new URL(MONGODB_URI);
    const database = url.pathname.substring(1) || "lead-intel";

    // Build mongorestore command
    let mongorestoreCmd = `mongorestore --uri="${MONGODB_URI}" --drop "${extractedPath}"`;

    console.log("⚠️  This will DROP existing data and restore from backup!");
    console.log("⏳ Restoring database...");

    // Execute restore
    const { stdout, stderr } = await execAsync(mongorestoreCmd);

    if (stderr && !stderr.includes("restoring")) {
      console.error("⚠️  Restore warnings:", stderr);
    }

    console.log("✅ Database restored successfully!");

    // Clean up temporary extraction
    if (backupPath.endsWith(".tar.gz")) {
      const tempDir = path.dirname(extractedPath);
      await execAsync(`rm -rf "${tempDir}"`);
      console.log("🧹 Cleaned up temporary files");
    }

    return true;
  } catch (error) {
    console.error("❌ Restore failed:", error.message);
    throw error;
  }
}

// Run restore if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const backupPath = process.argv[2];

  if (!backupPath) {
    console.error("Usage: node restore.js <backup-path>");
    console.log("\nAvailable backups:");
    
    try {
      const files = fs.readdirSync(BACKUP_DIR);
      const backups = files
        .filter((f) => f.startsWith("backup-"))
        .sort()
        .reverse();

      backups.forEach((backup, index) => {
        console.log(`  ${index + 1}. ${backup}`);
      });
    } catch (error) {
      console.error("Could not list backups:", error.message);
    }

    process.exit(1);
  }

  restoreBackup(backupPath)
    .then(() => {
      console.log("✨ Restore process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Restore process failed:", error);
      process.exit(1);
    });
}

export { restoreBackup };
