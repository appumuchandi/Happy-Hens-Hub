'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db, { getAllSettings } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/encryption';
import { Resend } from 'resend';

const SESSION_COOKIE_NAME = 'pm_admin_session';
const MASK_VALUE = '●●●●●●';

/**
 * Validates admin credentials against DB settings or .env variables as fallback.
 */
export async function loginAction(formData: FormData) {
  const useridInput = formData.get('userid') as string;
  const passwordInput = formData.get('password') as string;

  const settings = getAllSettings();
  const targetUser = settings.SUPER_ADMIN_USERID || 'admin';
  const targetPass = settings.SUPER_ADMIN_PASSWORD;

  if (!targetPass) {
    return { success: false, error: 'Server Error: Admin credentials not configured.' };
  }

  const isUserValid = targetUser.startsWith('$2a$') 
    ? bcrypt.compareSync(useridInput, targetUser) 
    : useridInput === targetUser;

  if (!isUserValid) {
    return { success: false, error: 'Invalid User ID or Password.' };
  }

  const isPassValid = targetPass.startsWith('$2a$') 
    ? bcrypt.compareSync(passwordInput, targetPass) 
    : passwordInput === targetPass;

  if (!isPassValid) {
    return { success: false, error: 'Invalid User ID or Password.' };
  }

  // Check for 2FA
  const is2FAEnabled = settings.TWO_FACTOR_AUTH === 'ON';
  
  if (is2FAEnabled) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 minutes

    // Store OTP
    db.prepare('INSERT OR REPLACE INTO admin_otp (id, code, expiresAt) VALUES (1, ?, ?)').run(otp, expiresAt);

    // Send Email
    const apiKey = settings.RESEND_API_KEY;
    const adminEmail = settings.EMAIL_TO;
    
    if (!apiKey || !adminEmail) {
      return { success: false, error: '2FA Error: Resend API Key or Admin Email not configured.' };
    }

    const resend = new Resend(apiKey);
    
    // Use specific OTP sender settings or fall back to general email settings
    const fromEmail = settings.OTP_EMAIL_FROM || settings.EMAIL_FROM || 'onboarding@resend.dev';
    const fromName = settings.OTP_EMAIL_FROM_NAME || 'PoultryManager Security';

    try {
      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [adminEmail],
        subject: `Login Verification Code: ${otp}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px; text-align: center;">
            <h2 style="color: #166534; margin-bottom: 20px;">Security Verification</h2>
            <p style="color: #666; font-size: 16px;">Use the code below to complete your login. This code is valid for <strong>2 minutes</strong>.</p>
            <div style="background-color: #f0fdf4; border: 2px dashed #166534; padding: 20px; border-radius: 12px; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #166534;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #999;">If you did not attempt to sign in, please change your password immediately.</p>
          </div>
        `
      });
      return { success: true, requiresOtp: true };
    } catch (e: any) {
      return { success: false, error: 'Failed to send verification email.' };
    }
  }

  // No 2FA: Set Session
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, 
  });
  
  revalidatePath('/super-admin/dashboard');
  return { success: true };
}

/**
 * Verifies the 2FA OTP code.
 */
export async function verifyOtpAction(code: string) {
  const row = db.prepare('SELECT code, expiresAt FROM admin_otp WHERE id = 1').get() as { code: string, expiresAt: string } | undefined;

  if (!row) {
    return { success: false, error: 'No verification code found. Please login again.' };
  }

  if (new Date() > new Date(row.expiresAt)) {
    return { success: false, error: 'Verification code expired. Please login again.' };
  }

  if (row.code !== code) {
    return { success: false, error: 'Invalid verification code.' };
  }

  // Success: Clear OTP and set Session
  db.prepare('DELETE FROM admin_otp WHERE id = 1').run();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, 
  });

  revalidatePath('/super-admin/dashboard');
  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  revalidatePath('/super-admin/dashboard');
  redirect('/super-admin/login');
}

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session || session.value !== 'authenticated') {
    throw new Error('AUTH_REQUIRED');
  }
}

export async function getOnboardingRequests(page: number = 1, limit: number = 100) {
  await checkAuth();
  
  const offset = (page - 1) * limit;

  try {
    const requests = db.prepare(`
      SELECT * FROM onboarding_requests 
      ORDER BY submissionDate DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const countResult = db.prepare('SELECT COUNT(*) as totalCount FROM onboarding_requests').get() as { totalCount: number };
    const totalCount = countResult?.totalCount || 0;

    // Advanced Data Analytics Queries
    const trend = db.prepare(`
      SELECT date(submissionDate) as name, COUNT(*) as value 
      FROM onboarding_requests 
      WHERE submissionDate >= date('now', '-30 days')
      GROUP BY name 
      ORDER BY name ASC
    `).all() as { name: string, value: number }[];

    const poultryDist = db.prepare(`
      SELECT poultryType as name, COUNT(*) as value 
      FROM onboarding_requests 
      GROUP BY name
    `).all() as { name: string, value: number }[];

    const stateDist = db.prepare(`
      SELECT state as name, COUNT(*) as value 
      FROM onboarding_requests 
      GROUP BY name 
      ORDER BY value DESC 
      LIMIT 6
    `).all() as { name: string, value: number }[];

    const stats = {
      totalRequests: totalCount,
      pending: (db.prepare("SELECT COUNT(*) as count FROM onboarding_requests WHERE status = 'pending'").get() as any).count,
      verifying: (db.prepare("SELECT COUNT(*) as count FROM onboarding_requests WHERE status = 'verifying'").get() as any).count,
      onboard: (db.prepare("SELECT COUNT(*) as count FROM onboarding_requests WHERE status = 'onboard'").get() as any).count,
      rejected: (db.prepare("SELECT COUNT(*) as count FROM onboarding_requests WHERE status = 'rejected'").get() as any).count,
      layerOnboard: (db.prepare("SELECT COUNT(*) as count FROM onboarding_requests WHERE poultryType = 'Layer' AND status = 'onboard'").get() as any).count,
      broilerOnboard: (db.prepare("SELECT COUNT(*) as count FROM onboarding_requests WHERE poultryType = 'Broiler' AND status = 'onboard'").get() as any).count,
      trend,
      poultryDistribution: poultryDist,
      stateDistribution: stateDist
    };

    return { requests, pagination: { currentPage: page, totalPages: Math.ceil(totalCount / limit) || 1, totalCount }, stats };
  } catch (dbError: any) {
    console.error("Dashboard Data Fetch Error:", dbError);
    throw new Error('DATABASE_ERROR');
  }
}

export async function updateRequestStatus(id: number, status: string) {
  try {
    await checkAuth();
    db.prepare('UPDATE onboarding_requests SET status = ? WHERE id = ?').run(status, id);
    revalidatePath('/super-admin/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Authorization failed or database error.' };
  }
}

export async function deleteRequestAction(id: number, passwordInput: string) {
  try {
    await checkAuth();
    
    const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('DELETE_PASSWORD') as { value: string } | undefined;
    const targetPassword = row?.value || process.env.DELETE_PASSWORD;

    if (!targetPassword) {
      return { success: false, error: 'System Error: Delete password is not configured.' };
    }

    const isValid = targetPassword.startsWith('$2a$') 
      ? bcrypt.compareSync(passwordInput, targetPassword) 
      : passwordInput === targetPassword;

    if (!isValid) {
      return { success: false, error: 'Incorrect delete password.' };
    }

    db.prepare('DELETE FROM onboarding_requests WHERE id = ?').run(id);
    revalidatePath('/super-admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    if (error.message === 'AUTH_REQUIRED') return { success: false, error: 'Auth required' };
    return { success: false, error: 'Failed to delete record.' };
  }
}

export async function getSystemSettings() {
  await checkAuth();
  
  const rows = db.prepare('SELECT * FROM system_settings').all() as { key: string, value: string }[];
  const settings: Record<string, string> = {};
  rows.forEach(row => { 
    settings[row.key] = row.value;
  });

  const sensitiveKeys = ['SUPER_ADMIN_PASSWORD', 'SUPER_ADMIN_USERID', 'RESEND_API_KEY', 'TELEGRAM_BOT_TOKEN', 'DELETE_PASSWORD'];
  const uiSettings: Record<string, string> = {};
  const allPossibleKeys = new Set([...Object.keys(settings), ...Object.keys(process.env)]);

  allPossibleKeys.forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_') || sensitiveKeys.includes(key) || key.startsWith('EMAIL_') || key.startsWith('OTP_EMAIL_') || key === 'DELETE_PASSWORD' || key === 'TWO_FACTOR_AUTH' || key === 'TELEGRAM_CHAT_ID') {
      const dbValue = settings[key];
      const envValue = process.env[key];

      if (sensitiveKeys.includes(key)) {
        if (dbValue || envValue) {
          uiSettings[key] = MASK_VALUE;
        } else {
          uiSettings[key] = '';
        }
      } else {
        uiSettings[key] = dbValue || envValue || '';
      }
    }
  });

  return uiSettings;
}

export async function updateSystemSettings(settings: Record<string, string>) {
  await checkAuth();
  
  const insert = db.prepare('INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)');
  
  const transaction = db.transaction((data: any) => {
    for (const key of Object.keys(data)) {
      const value = data[key] as string;
      let finalValue = value;

      if (value === MASK_VALUE) continue;

      if (key === 'SUPER_ADMIN_PASSWORD' || key === 'SUPER_ADMIN_USERID' || key === 'DELETE_PASSWORD') {
        if (value && typeof value === 'string' && value.trim() !== '') {
          finalValue = bcrypt.hashSync(value, 10);
        } else {
          continue; 
        }
      }

      if (key === 'RESEND_API_KEY' || key === 'TELEGRAM_BOT_TOKEN') {
        if (value && typeof value === 'string' && value.trim() !== '') {
          finalValue = encrypt(value);
        } else {
          finalValue = '';
        }
      }

      insert.run(key, finalValue);
    }
  });
  
  transaction(settings);
  
  revalidatePath('/', 'layout');
  revalidatePath('/super-admin/settings');
  
  return { success: true };
}
