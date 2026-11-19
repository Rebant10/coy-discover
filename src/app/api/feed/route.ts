import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/lib/types';

// GET /api/feed - returns profiles the user has not yet swiped on
export async function GET() {
  try {
    const db = getDb();
    
    // User ID is 0 (single logged-in user assumption)
    const userId = 0;
    
    const profiles = db.prepare(`
      SELECT p.* FROM profiles p
      WHERE p.id NOT IN (
        SELECT swiped_id FROM swipes WHERE swiper_id = ?
      )
      ORDER BY p.id ASC
    `).all(userId) as Array<{
      id: number;
      name: string;
      age: number;
      photo: string;
      bio: string;
      city: string;
      college: string;
      interests: string;
    }>;
    
    // Parse interests JSON string back to array
    const parsed: Profile[] = profiles.map(p => ({
      ...p,
      interests: JSON.parse(p.interests)
    }));
    
    return NextResponse.json({ profiles: parsed });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

