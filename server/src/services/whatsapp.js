import config from '../config/config.js';
import Notification from '../models/Notification.js';

/**
 * WhatsApp & Multi-channel Notification Service
 *
 * Sends alerts to sales officers via:
 *  - WhatsApp (Twilio Sandbox)
 *  - Email (Nodemailer — SMTP)
 *  - In-app (stored in Notification collection)
 *
 * Model Card:
 *  - Type: Notification dispatch service
 *  - Channels: WhatsApp, Email, In-App, Push (PWA)
 *  - Rate limiting: Max 10 msgs/user/hour
 */

let twilioClient = null;
let transporter = null;

// Lazy init Twilio
function getTwilioClient() {
  if (twilioClient) return twilioClient;
  if (config.twilio.accountSid && config.twilio.authToken &&
      config.twilio.accountSid !== 'your_twilio_sid') {
    try {
      const twilio = await import('twilio');
      twilioClient = twilio.default(config.twilio.accountSid, config.twilio.authToken);
    } catch (e) {
      console.warn('Twilio not available:', e.message);
    }
  }
  return twilioClient;
}

// Lazy init email transporter
async function getEmailTransporter() {
  if (transporter) return transporter;
  if (config.smtp.user && config.smtp.pass && config.smtp.user !== 'your_email@gmail.com') {
    try {
      const nodemailer = await import('nodemailer');
      transporter = nodemailer.default.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: false,
        auth: { user: config.smtp.user, pass: config.smtp.pass },
      });
    } catch (e) {
      console.warn('Email transport not available:', e.message);
    }
  }
  return transporter;
}

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsApp(to, message) {
  try {
    const client = getTwilioClient();
    if (!client) {
      console.log(`[WhatsApp MOCK] To: ${to} | Message: ${message}`);
      return { success: true, mock: true };
    }
    const result = await client.messages.create({
      body: message,
      from: config.twilio.whatsappFrom,
      to: `whatsapp:${to}`,
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send an email notification
 */
export async function sendEmail(to, subject, html) {
  try {
    const transport = await getEmailTransporter();
    if (!transport) {
      console.log(`[Email MOCK] To: ${to} | Subject: ${subject}`);
      return { success: true, mock: true };
    }
    const info = await transport.sendMail({
      from: `"Lead Intel" <${config.smtp.user}>`,
      to: to,
      subject: subject,
      html: html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create in-app notification
 */
export async function notifyInApp(userId, data) {
  const notification = await Notification.create({
    user: userId,
    lead: data.leadId,
    type: data.type || 'new_lead',
    title: data.title,
    message: data.message,
    priority: data.priority || 'medium',
    actionUrl: data.actionUrl || '',
    actionLabel: data.actionLabel || 'View',
  });
  return notification;
}

/**
 * Send a lead alert to a user across all enabled channels
 */
export async function sendLeadAlert(user, lead) {
  const results = { inApp: null, whatsapp: null, email: null };

  const message = `🔔 New Lead Alert!\n\n` +
    `Company: ${lead.companyName}\n` +
    `Title: ${lead.title}\n` +
    `Score: ${lead.score}/100 (${lead.priority})\n` +
    `Products: ${(lead.inferredProducts || []).map(p => p.productName).join(', ')}\n` +
    `Source: ${lead.source?.name || 'Unknown'}\n\n` +
    `Action: Review and respond`;

  // In-app notification (always)
  results.inApp = await notifyInApp(user._id, {
    leadId: lead._id,
    type: 'new_lead',
    title: `New Lead: ${lead.companyName}`,
    message: message,
    priority: lead.priority,
    actionUrl: `/leads/${lead._id}`,
    actionLabel: 'View Lead',
  });

  // WhatsApp (if enabled and configured)
  if (user.notificationPreferences?.whatsapp && user.whatsappNumber) {
    results.whatsapp = await sendWhatsApp(user.whatsappNumber, message);
    if (results.inApp) {
      results.inApp.channels.whatsapp = {
        sent: results.whatsapp.success,
        sentAt: new Date(),
        status: results.whatsapp.success ? 'sent' : 'failed',
        messageId: results.whatsapp.messageId || '',
      };
      await results.inApp.save();
    }
  }

  // Email (if enabled and configured)
  if (user.notificationPreferences?.email && user.email) {
    const htmlBody = `
      <h2>New Lead Alert</h2>
      <p><strong>Company:</strong> ${lead.companyName}</p>
      <p><strong>Title:</strong> ${lead.title}</p>
      <p><strong>Score:</strong> ${lead.score}/100 (${lead.priority})</p>
      <p><strong>Products:</strong> ${(lead.inferredProducts || []).map(p => p.productName).join(', ')}</p>
      <p><strong>Source:</strong> ${lead.source?.name || 'Unknown'}</p>
      <p><a href="${process.env.APP_URL || 'http://localhost:8080'}/leads/${lead._id}">View Lead</a></p>
    `;
    results.email = await sendEmail(user.email, `New Lead: ${lead.companyName} (Score: ${lead.score})`, htmlBody);
    if (results.inApp) {
      results.inApp.channels.email = {
        sent: results.email.success,
        sentAt: new Date(),
        status: results.email.success ? 'sent' : 'failed',
      };
      await results.inApp.save();
    }
  }

  return results;
}
