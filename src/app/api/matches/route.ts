import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/lib/types';

// GET /api/matches - returns the user's mutual matches
export async function GET() {
  try {
    const db = getDb();
    const userId = 0;
    
    // A match = user liked them AND they liked user
    const matches = db.prepare(`
      SELECT p.*, s1.created_at as matched_at
      FROM profiles p
      INNER JOIN swipes s1 ON s1.swiper_id = ? AND s1.swiped_id = p.id AND s1.action = 'like'
      INNER JOIN swipes s2 ON s2.swiper_id = p.id AND s2.swiped_id = ? AND s2.action = 'like'
      ORDER BY s1.created_at DESC
    `).all(userId, userId) as Array<{
      id: number;
      name: string;
      age: number;
      photo: string;
      bio: string;
      city: string;
      college: string;
      interests: string;
      matched_at: string;
    }>;
    
    const parsed = matches.map(m => ({
      id: m.id,
      profile: {
        id: m.id,
        name: m.name,
        age: m.age,
        photo: m.photo,
        bio: m.bio,
        city: m.city,
        college: m.college,
        interests: JSON.parse(m.interests)
      },
      matchedAt: m.matched_at
    }));
    
    return NextResponse.json({ matches: parsed });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

