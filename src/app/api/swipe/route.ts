import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile, SwipeResponse } from '@/lib/types';

// POST /api/swipe - records a like or pass and returns whether it created a match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action } = body;
    
    if (!profileId || !['like', 'pass'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request. Need profileId and action (like/pass).' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    const userId = 0;
    
    // Record the swipe
    db.prepare(
      'INSERT OR REPLACE INTO swipes (swiper_id, swiped_id, action) VALUES (?, ?, ?)'
    ).run(userId, profileId, action);
    
    let matched = false;
    let matchedProfile: Profile | undefined;
    
    // Check for match only on 'like'
    if (action === 'like') {
      // Check if the other person has also liked us
      const otherSwipe = db.prepare(
        'SELECT * FROM swipes WHERE swiper_id = ? AND swiped_id = ? AND action = ?'
      ).get(profileId, userId, 'like') as { id: number } | undefined;
      
      if (otherSwipe) {
        matched = true;
        // Get the matched profile details
        const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as {
          id: number;
          name: string;
          age: number;
          photo: string;
          bio: string;
          city: string;
          college: string;
          interests: string;
        } | undefined;
        
        if (profile) {
          matchedProfile = {
            ...profile,
            interests: JSON.parse(profile.interests)
          };
        }
      }
    }
    
    const response: SwipeResponse = {
      success: true,
      matched,
      matchedProfile
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error recording swipe:', error);
    return NextResponse.json({ error: 'Failed to record swipe' }, { status: 500 });
  }
}

