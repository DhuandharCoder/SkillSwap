export type VerificationType = 'phone' | 'email' | 'none';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email?: string;
  phone?: string;
  college: string; // Strictly "MITS Gwalior"
  department: string;
  year: string;
  bio: string;
  verified: boolean;
  verificationBadge: string; // "Verified MITS/Campus Peer"
  credits: number;
  hoursTaught: number;
  hoursLearned: number;
  totalReviews: number;
  averageRating: number;
  skillsOffered: string[];
  skillsWanted: string[];
  reviews: PeerReview[];
}

export interface PeerReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  skillLearned: string;
  comment: string;
  date: string;
}

export interface NanoSkill {
  id: string;
  name: string;
  category: 'Tech' | 'Creative Arts' | 'Music' | 'Fitness' | 'Media' | 'Academics';
  rating: number; // e.g., 9.4
  demandStatus: 'Highly Demanded' | 'Trending' | 'Popular' | 'Emerging' | 'Essential';
  learnDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  avgSessionDuration: string;
  description: string;
}

export type SwapStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface SwapRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  skillOffered: string;
  skillWanted: string;
  status: SwapStatus;
  createdAt: string;
  roomId?: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}
