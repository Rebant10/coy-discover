import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POST /api/reset - reset all user swipes for demo purposes
export async function POST() {
  try {
    const db = getDb();
    const userId = 0;

    // Only delete swipes made BY the user, keep the pre-seeded likes FROM profiles
    db.prepare('DELETE FROM swipes WHERE swiper_id = ?').run(userId);

    return NextResponse.json({ success: true, message: 'All your swipes have been reset' });
  } catch (error) {
    console.error('Error resetting:', error);
    return NextResponse.json({ error: 'Failed to reset' }, { status: 500 });
  }
}

