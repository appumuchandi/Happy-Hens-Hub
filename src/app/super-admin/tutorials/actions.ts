
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

function extractYoutubeId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export async function getTutorialsAdmin() {
  await checkAuth();
  return db.prepare('SELECT * FROM tutorials ORDER BY displayOrder ASC, createdAt DESC').all();
}

export async function upsertTutorial(data: any) {
  await checkAuth();
  
  const videoId = extractYoutubeId(data.youtubeUrl);
  if (!videoId) {
    return { success: false, error: 'Invalid YouTube URL' };
  }

  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const now = new Date().toISOString();

  try {
    if (data.id) {
      db.prepare(`
        UPDATE tutorials SET 
          title = ?, description = ?, youtubeUrl = ?, youtubeVideoId = ?, 
          thumbnail = ?, role = ?, keywords = ?, displayOrder = ?, 
          isPublished = ?, updatedAt = ?
        WHERE id = ?
      `).run(
        data.title, data.description, data.youtubeUrl, videoId,
        thumbnail, data.role, data.keywords, Number(data.displayOrder),
        data.isPublished ? 1 : 0, now, data.id
      );
    } else {
      db.prepare(`
        INSERT INTO tutorials (
          title, description, youtubeUrl, youtubeVideoId, thumbnail, 
          role, keywords, displayOrder, isPublished, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        data.title, data.description, data.youtubeUrl, videoId,
        thumbnail, data.role, data.keywords, Number(data.displayOrder),
        data.isPublished ? 1 : 0, now, now
      );
    }
    revalidatePath('/super-admin/tutorials');
    revalidatePath('/tutorials');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTutorial(id: number) {
  await checkAuth();
  db.prepare('DELETE FROM tutorials WHERE id = ?').run(id);
  revalidatePath('/super-admin/tutorials');
  revalidatePath('/tutorials');
  return { success: true };
}

export async function togglePublishStatus(id: number, currentStatus: number) {
  await checkAuth();
  db.prepare('UPDATE tutorials SET isPublished = ? WHERE id = ?').run(currentStatus === 1 ? 0 : 1, id);
  revalidatePath('/super-admin/tutorials');
  revalidatePath('/tutorials');
  return { success: true };
}
