// Professional SMTP Email Delivery for ARAVIND READYMADE OTP Verification
import nodemailer from 'nodemailer';

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  devCode?: string;
  error?: string;
}

/**
 * Creates a reusable nodemailer transport using environment configuration
 */
function createSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Builds the branded luxury email template for ARAVIND READYMADE
 */
function buildOtpEmailHtml(otpCode: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ARAVIND READYMADE Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F6F2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #EAE5DC;" cellspacing="0" cellpadding="0">
          
          <!-- Top Brand Header Bar -->
          <tr>
            <td style="background-color: #881326; padding: 32px 24px; text-align: center;">
              <table role="presentation" align="center" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="width: 48px; height: 48px; background-color: #FFFFFF; border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: 900; color: #881326; border: 2px solid #C5A059; margin-bottom: 12px;">
                      A
                    </div>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 0.15em; color: #FFFFFF; text-transform: uppercase;">
                ARAVIND READYMADE
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 700; color: #E8D5B5; letter-spacing: 0.2em; text-transform: uppercase;">
                MALIKIPURAM • PRESTIGE ATTIRE
              </p>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px 32px 32px 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #121417; letter-spacing: -0.02em;">
                Verify your email address
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #555E68;">
                Welcome to <strong>ARAVIND READYMADE</strong>. Use the 6-digit verification code below to complete your login or registration.
              </p>

              <!-- Prominent OTP Code Box -->
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td style="background-color: #FAF7F2; border: 2px dashed #C5A059; border-radius: 16px; padding: 18px 36px; text-align: center;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #881326; display: inline-block;">
                      ${otpCode}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <div style="background-color: #FFF9E6; border: 1px solid #F5E3A9; border-radius: 10px; padding: 12px 16px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #8A6D1C;">
                  ⏳ This code expires in 5 minutes.
                </p>
              </div>

              <!-- Security Notice -->
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #8C94A0;">
                If you did not request this verification code, you can safely ignore this email. No changes will be made to your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAFAFA; border-top: 1px solid #EAE5DC; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #6C757D;">
                ARAVIND READYMADE • Main Road, Malikipuram, Andhra Pradesh
              </p>
              <p style="margin: 0; font-size: 10px; color: #9AA2AB;">
                Direct Customer Support: +91 99592 57373 • WhatsApp Consultation
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends OTP Email via SMTP with fallback logging for local development
 */
export async function sendOtpEmail(email: string, otpCode: string): Promise<SendOtpResult> {
  const fromAddress = process.env.SMTP_FROM || `ARAVIND READYMADE <${process.env.SMTP_USER || 'no-reply@aravindreadymades.com'}>`;
  const transport = createSmtpTransport();

  const isDev = process.env.NODE_ENV !== 'production';

  if (!transport) {
    // SMTP credentials not configured yet: log prominent development OTP banner
    console.log('\n======================================================');
    console.log('📧 [ARAVIND READYMADE] SMTP NOT CONFIGURED - DEV MODE');
    console.log(`🎯 Recipient Email : ${email}`);
    console.log(`🔐 6-DIGIT OTP CODE: [ ${otpCode} ]`);
    console.log('⏳ Expiration      : 5 Minutes');
    console.log('💡 Note: Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env.local to send live emails');
    console.log('======================================================\n');

    return {
      success: true,
      simulated: true,
      devCode: isDev ? otpCode : undefined,
    };
  }

  try {
    const info = await transport.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Your ARAVIND READYMADE Verification Code',
      text: `Your ARAVIND READYMADE verification code is: ${otpCode}. This code expires in 5 minutes. If you did not request this code, you can safely ignore this email.`,
      html: buildOtpEmailHtml(otpCode),
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('SMTP Email Delivery Error:', error);
    // In dev, provide graceful fallback so developer / user can continue testing
    if (isDev) {
      console.log(`\n⚠️ SMTP delivery failed (${error.message}). Falling back to Console OTP: [ ${otpCode} ]\n`);
      return {
        success: true,
        simulated: true,
        devCode: otpCode,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to send verification email. Please verify SMTP settings.',
    };
  }
}
