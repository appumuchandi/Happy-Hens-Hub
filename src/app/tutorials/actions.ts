
'use server';

import db from '@/lib/db';

export async function getPublishedTutorials() {
  try {
    const tutorials = db.prepare(`
      SELECT * FROM tutorials 
      WHERE isPublished = 1 
      ORDER BY displayOrder ASC, createdAt DESC
    `).all();
    return { success: true, tutorials };
  } catch (error) {
    console.error('Failed to fetch tutorials:', error);
    return { success: false, tutorials: [] };
  }
}
