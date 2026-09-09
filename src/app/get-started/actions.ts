
'use server';

import { Resend } from 'resend';
import db, { getAllSettings } from '@/lib/db';

/**
 * @fileOverview Server actions for handling farm onboarding requests.
 */

/**
 * Generates a unique serial number for the farm request.
 */
function generateSerialNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PM-${year}${month}-${random}`;
}

/**
 * Server action to save registration data to SQLite and send notifications.
 */
export async function submitOnboardingRequest(formData: any) {
  const serialNo = generateSerialNumber();
  const submissionDate = new Date().toISOString();
  const settings = getAllSettings();
  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  try {
    // 1. Uniqueness Validations
    const checkEmail = db.prepare('SELECT id FROM onboarding_requests WHERE email = ?').get(formData.email);
    if (checkEmail) return { success: false, error: 'Email already registered.' };

    const checkPhone = db.prepare('SELECT id FROM onboarding_requests WHERE contactNumber = ?').get(formData.phoneNumber);
    if (checkPhone) return { success: false, error: 'Phone number already registered.' };

    const checkDomain = db.prepare('SELECT status FROM onboarding_requests WHERE website = ?').get(formData.website) as { status: string } | undefined;
    if (checkDomain) return { success: false, error: 'Subdomain is already taken.' };

    // 2. Store in SQLite
    // We include default empty strings for legacy address fields (plotNo, village, etc.) 
    // to satisfy NOT NULL constraints that might exist in older database versions.
    const stmt = db.prepare(`
      INSERT INTO onboarding_requests (
        serialNo, submissionDate, firstName, lastName, fullName, email, contactNumber, 
        country, poultryName, poultryType, capacity, website,
        plotNo, village, taluka, district, state, postcode, secondaryContactNumber, gstNo, googleMapLink
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '')
    `);

    stmt.run(
      serialNo, submissionDate, formData.firstName, formData.lastName, fullName, 
      formData.email, formData.phoneNumber, formData.country,
      formData.poultryName, formData.poultryType, Number(formData.capacity),
      formData.website
    );

    // 3. Telegram Notification (Prioritized Internal Alert)
    const tgToken = settings.TELEGRAM_BOT_TOKEN;
    const tgChatId = settings.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      const message = `
🌍 <b>Global Registration</b>
<b>Serial:</b> ${serialNo}
<b>Farm:</b> ${formData.poultryName} (${formData.poultryType})
<b>Capacity:</b> ${formData.capacity} Birds
<b>Owner:</b> ${fullName}
<b>Phone:</b> ${formData.phoneNumber}
<b>Country:</b> ${formData.country}
<b>Domain:</b> ${formData.website}.poultrymanager.in
      `.trim();

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: message,
            parse_mode: 'HTML'
          })
        });
      } catch (tgErr) {
        console.error("Telegram Notification Failed:", tgErr);
      }
    }

    // 4. Send Emails via Resend
    const apiKey = settings.RESEND_API_KEY;
    const sendAdminEmail = settings.SEND_ADMIN_NOTIFICATIONS !== 'OFF';
    const sendCustomerEmail = settings.SEND_CUSTOMER_NOTIFICATIONS !== 'OFF';

    if (apiKey && (sendAdminEmail || sendCustomerEmail)) {
      const resend = new Resend(apiKey);
      const from = `${settings.EMAIL_FROM_NAME || 'PoultryManager'} <${settings.EMAIL_FROM || 'onboarding@resend.dev'}>`;
      
      if (sendAdminEmail) {
        await resend.emails.send({
          from,
          to: [settings.EMAIL_TO || 'admin@poultrymanager.in'],
          subject: `New Global Registration [${serialNo}]`,
          html: `<h2>New Request: ${formData.poultryName}</h2><p>Serial: ${serialNo}</p><p>Owner: ${fullName}</p><p>Country: ${formData.country}</p>`
        });
      }

      if (sendCustomerEmail) {
        await resend.emails.send({
          from,
          to: [formData.email],
          subject: `Registration Received - ${serialNo}`,
          html: `<h3>Hi ${formData.firstName},</h3><p>Your request [${serialNo}] is being verified for the international platform.</p>`
        });
      }
    }

    return { success: true, serialNo };
  } catch (err: any) {
    console.error("Submission Error:", err);
    return { success: false, error: err.message };
  }
}
