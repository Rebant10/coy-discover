export interface Profile {
  id: number;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string;
  interests: string[];
}

export interface SwipeAction {
  profileId: number;
  action: 'like' | 'pass';
}

export interface SwipeResponse {
  success: boolean;
  matched: boolean;
  matchedProfile?: Profile;
}

export interface Match {
  id: number;
  profile: Profile;
  matchedAt: string;
}

