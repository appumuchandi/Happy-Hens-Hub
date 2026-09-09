
'use server';

import { cookies } from 'next/headers';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

const SESSION_COOKIE_NAME = 'pm_admin_session';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session || session.value !== 'authenticated') {
    throw new Error('AUTH_REQUIRED');
  }
}

export async function getReferenceCodes() {
  await checkAuth();
  return db.prepare('SELECT * FROM reference_codes ORDER BY createdAt DESC').all();
}

export async function addReferenceCode(code: string, partnerName: string) {
  await checkAuth();
  
  const sanitizedCode = code.toUpperCase().trim();
  if (sanitizedCode.length !== 6 || !/^[A-Z]+$/.test(sanitizedCode)) {
    return { success: false, error: 'Code must be exactly 6 alphabetic characters.' };
  }

  const now = new Date().toISOString();

  try {
    // Check if code already exists
    const existing = db.prepare('SELECT id FROM reference_codes WHERE code = ?').get(sanitizedCode);
    if (existing) {
      return { success: false, error: 'This reference code already exists.' };
    }

    db.prepare('INSERT INTO reference_codes (code, partnerName, createdAt) VALUES (?, ?, ?)')
      .run(sanitizedCode, partnerName.trim(), now);
    
    revalidatePath('/super-admin/reference-codes');
    return { success: true, code: sanitizedCode };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReferenceCode(id: number) {
  await checkAuth();
  try {
    db.prepare('DELETE FROM reference_codes WHERE id = ?').run(id);
    revalidatePath('/super-admin/reference-codes');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
