export interface UserProfile {
  userId: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  profileImageUrl: string;
  joinedAt: string;
  isEmailVerified: boolean;
}

export interface UserProfileUpdate {
  username: string | null;
  fullName: string | null;
  dateOfBirth: Date | undefined;
  gender: string | null;
}
