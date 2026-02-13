#!/usr/bin/env node

/**
 * Database Backup Script
 * Creates a backup of the MongoDB database
 * Usage: node backup.js [--output <path>]
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
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const BACKUP_PATH = path.join(BACKUP_DIR, `backup-${TIMESTAMP}`);

async function createBackup() {
  try {
    console.log("🔄 Starting database backup...");
    console.log(`📁 Backup location: ${BACKUP_PATH}`);

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      console.log(`✅ Created backup directory: ${BACKUP_DIR}`);
    }

    // Parse MongoDB URI
    const url = new URL(MONGODB_URI);
    const database = url.pathname.substring(1) || "lead-intel";

    // Build mongodump command
    let mongodumpCmd = `mongodump --uri="${MONGODB_URI}" --out="${BACKUP_PATH}"`;

    // Execute backup
    const { stdout, stderr } = await execAsync(mongodumpCmd);

    if (stderr && !stderr.includes("writing")) {
      console.error("⚠️  Backup warnings:", stderr);
    }

    console.log("✅ Backup completed successfully!");
    console.log(`📦 Backup saved to: ${BACKUP_PATH}`);

    // Create a compressed archive
    try {
      const archivePath = `${BACKUP_PATH}.tar.gz`;
      await execAsync(`tar -czf "${archivePath}" -C "${BACKUP_DIR}" "${path.basename(BACKUP_PATH)}"`);
      console.log(`🗜️  Compressed backup: ${archivePath}`);

      // Remove uncompressed backup
      await execAsync(`rm -rf "${BACKUP_PATH}"`);
    } catch (error) {
      console.warn("⚠️  Could not compress backup:", error.message);
    }

    // Keep only last 7 backups
    await cleanOldBackups();

    return BACKUP_PATH;
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    throw error;
  }
}

async function cleanOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const backups = files
      .filter((f) => f.startsWith("backup-") && f.endsWith(".tar.gz"))
      .map((f) => ({
        name: f,
        path: path.join(BACKUP_DIR, f),
        time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    // Keep only last 7 backups
    const toDelete = backups.slice(7);

    for (const backup of toDelete) {
      fs.unlinkSync(backup.path);
      console.log(`🗑️  Deleted old backup: ${backup.name}`);
    }
  } catch (error) {
    console.warn("⚠️  Could not clean old backups:", error.message);
  }
}

// Run backup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createBackup()
    .then(() => {
      console.log("✨ Backup process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Backup process failed:", error);
      process.exit(1);
    });
}

export { createBackup };
