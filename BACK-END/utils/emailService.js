const nodemailer = require("nodemailer");

/**
 * Email Service - Handles all email communications
 * Uses Gmail SMTP with environment variables for credentials
 */

// Initialize Nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send Google Login Notification Email
 * @param {string} toEmail - Recipient email address
 * @param {string} userName - User's name
 * @returns {Promise<boolean>} - Success/failure status
 */
const sendGoogleLoginEmail = async (toEmail, userName) => {
  try {
    // Format current date and time
    const loginDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC"
    });

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin: 0 auto;
            }
            .header {
              color: #333;
              margin-bottom: 20px;
            }
            .content {
              color: #555;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin-top: 15px;
              color: #856404;
              border-radius: 4px;
            }
            .footer {
              color: #999;
              font-size: 12px;
              margin-top: 20px;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Welcome to Mental Buddy! 🧠</h2>
            </div>
            
            <div class="content">
              <p>Hello <strong>${userName}</strong>,</p>
              
              <p>You just logged into <strong>Mental Buddy</strong> using Google on:</p>
              <p><strong>${loginDate} UTC</strong></p>
              
              <p>Your account is secure with us. We're here to help you maintain your mental wellness journey.</p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If this wasn't you, please change your password immediately to keep your account safe.
            </div>

            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; 2026 Mental Buddy. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email text version (fallback)
    const textContent = `
Hello ${userName},

You just logged into Mental Buddy using Google on: ${loginDate} UTC

Your account is secure with us. We're here to help you maintain your mental wellness journey.

⚠️ Security Notice: If this wasn't you, please change your password immediately to keep your account safe.

---
This is an automated email. Please do not reply to this message.
© 2026 Mental Buddy. All rights reserved.
    `.trim();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "🔐 Google Login Alert - Mental Buddy",
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Google login email sent to:", toEmail, "Message ID:", info.messageId);
    return true;

  } catch (error) {
    // Log error but don't throw - email failure should not break login flow
    console.error("❌ Error sending Google login email:", error.message);
    return false;
  }
};

module.exports = {
  sendGoogleLoginEmail
};
