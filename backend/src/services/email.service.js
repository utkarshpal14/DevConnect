/**
 * Email Service
 * Handles transactional emails (Welcome email with credentials, notifications)
 * Powered by Nodemailer with SMTP (Brevo / Sendinblue).
 */

const nodemailer = require('nodemailer');
const config = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  /**
   * Lazily initialize or retrieve the SMTP transporter
   */
  getTransporter() {
    if (!this.transporter) {
      // In automated test environment, bypass real SMTP network calls
      if (config.nodeEnv === 'test') {
        return null;
      }

      if (!config.smtpUser || !config.smtpPass) {
        console.warn('[EmailService] SMTP credentials not fully configured. Email delivery will be simulated.');
        return null;
      }

      this.transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465, // true for 465, false for 587
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass
        },
        connectionTimeout: 10000 // 10s connection timeout
      });
    }
    return this.transporter;
  }

  /**
   * Send a welcome email with credentials upon successful user registration
   * @param {Object} params
   * @param {string} params.to - Recipient email address
   * @param {string} params.fullName - Recipient's full name
   * @param {string} params.role - User role ('student' | 'recruiter')
   * @param {string} params.password - The registered account password
   * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
   */
  async sendWelcomeEmail({ to, fullName, role, password }) {
    try {
      const transporter = this.getTransporter();

      const loginUrl = `${config.frontendUrl}/#login`;
      const roleLabel = role === 'recruiter' ? 'Recruiter' : 'Student Developer';

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to DevConnect</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; color: #94a3b8; font-size: 14px; }
    .content { padding: 32px 28px; }
    .welcome-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; }
    .welcome-text { font-size: 14px; line-height: 1.6; color: #475569; margin: 12px 0 24px; }
    .creds-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .creds-card h3 { margin: 0 0 12px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0d9488; }
    .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { color: #64748b; font-weight: 500; }
    .cred-val { color: #0f172a; font-weight: 600; font-family: monospace, monospace; }
    .cta-wrap { text-align: center; margin: 32px 0 20px; }
    .cta-btn { background: #0d9488; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block; }
    .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DevConnect</h1>
      <p>Developer Portfolio & AI Recruitment Platform</p>
    </div>
    <div class="content">
      <h2 class="welcome-title">Welcome aboard, ${fullName}! 🎉</h2>
      <p class="welcome-text">
        Your new DevConnect account has been created successfully. You are registered as a <strong>${roleLabel}</strong>.
      </p>

      <div class="creds-card">
        <h3>Your Account Credentials</h3>
        <div class="cred-row">
          <span class="cred-label">Registered Email:</span>
          <span class="cred-val">${to}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Password:</span>
          <span class="cred-val">${password}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Account Role:</span>
          <span class="cred-val">${roleLabel}</span>
        </div>
      </div>

      <div class="cta-wrap">
        <a href="${loginUrl}" class="cta-btn" target="_blank">Login to DevConnect &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 24px;">
        🔒 <strong>Security Tip:</strong> Keep these credentials safe. For security reasons, we recommend changing your password after your initial login.
      </p>
    </div>
    <div class="footer">
      &copy; 2026 DevConnect. All rights reserved.
    </div>
  </div>
</body>
</html>
      `;

      if (!transporter) {
        if (config.nodeEnv !== 'test') {
          console.log(`[EmailService] Simulated Welcome Email to ${to} (credentials not sent via network because SMTP is not configured)`);
        }
        return { success: true, simulated: true };
      }

      const mailOptions = {
        from: config.emailFrom,
        to,
        subject: `Welcome to DevConnect — Your Account Credentials (${roleLabel})`,
        text: `Hello ${fullName},\n\nWelcome to DevConnect! Your account has been created successfully.\n\nYour Credentials:\nEmail: ${to}\nPassword: ${password}\nRole: ${roleLabel}\n\nLogin at: ${loginUrl}\n\nBest regards,\nThe DevConnect Team`,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Welcome email successfully sent to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.warn(`[EmailService] Failed to send welcome email to ${to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();

