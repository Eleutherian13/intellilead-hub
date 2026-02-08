import cron from "node-cron";
import { crawlAllSources } from "../services/scraper.js";
import config from "../config/config.js";

let scheduledJob = null;

/**
 * Start the scheduled crawl job
 */
export function startCrawlScheduler() {
  const minutes = config.scraping.intervalMinutes;
  // Convert minutes to cron expression (run every N minutes)
  const cronExpr = `*/${Math.min(minutes, 59)} * * * *`;

  console.log(
    `Starting crawl scheduler: every ${minutes} minutes (${cronExpr})`,
  );

  scheduledJob = cron.schedule(cronExpr, async () => {
    console.log(`[${new Date().toISOString()}] Scheduled crawl starting...`);
    try {
      const results = await crawlAllSources();
      const totalLeads = results.reduce((sum, r) => sum + r.leadsCreated, 0);
      console.log(
        `Scheduled crawl complete. ${results.length} sources crawled, ${totalLeads} new leads.`,
      );
    } catch (error) {
      console.error("Scheduled crawl error:", error.message);
    }
  });

  return scheduledJob;
}

/**
 * Stop the scheduled crawl job
 */
export function stopCrawlScheduler() {
  if (scheduledJob) {
    scheduledJob.stop();
    console.log("Crawl scheduler stopped.");
  }
}
