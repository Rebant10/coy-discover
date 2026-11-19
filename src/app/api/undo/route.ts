import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POST /api/undo - undo the last swipe
export async function POST() {
  try {
    const db = getDb();
    const userId = 0;

    // Find the last swipe by this user
    const lastSwipe = db.prepare(
      'SELECT * FROM swipes WHERE swiper_id = ? ORDER BY created_at DESC, id DESC LIMIT 1'
    ).get(userId) as { id: number; swiped_id: number; action: string } | undefined;

    if (!lastSwipe) {
      return NextResponse.json({ success: false, message: 'Nothing to undo' }, { status: 400 });
    }

    // Delete it
    db.prepare('DELETE FROM swipes WHERE id = ?').run(lastSwipe.id);

    // Get the profile that was undone so frontend can re-add it
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(lastSwipe.swiped_id) as {
      id: number;
      name: string;
      age: number;
      photo: string;
      bio: string;
      city: string;
      college: string;
      interests: string;
    } | undefined;

    return NextResponse.json({
      success: true,
      undoneProfile: profile ? { ...profile, interests: JSON.parse(profile.interests) } : null,
      undoneAction: lastSwipe.action,
    });
  } catch (error) {
    console.error('Error undoing swipe:', error);
    return NextResponse.json({ error: 'Failed to undo' }, { status: 500 });
  }
}

