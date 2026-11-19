import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POST /api/undo - undo the last accidental pass (dislike)
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

    // Rewind is exclusively for accidental passes (left swipes). Matches/likes cannot be rolled back.
    if (lastSwipe.action !== 'pass') {
      return NextResponse.json(
        { success: false, message: 'Rollback is only available for passed profiles' },
        { status: 400 }
      );
    }

    // Delete the pass swipe record
    db.prepare('DELETE FROM swipes WHERE id = ?').run(lastSwipe.id);

    // Get the profile that was undone so the frontend can restore it to the deck
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
