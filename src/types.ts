/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Mistress/DOM' | 'SUB' | 'Slave' | 'Master' | 'Admin';

export type Rank = 'Best' | 'Better' | 'Normal' | 'Fake';

export interface User {
  id: string;
  username: string;
  email: string;
  gender: string;
  role: Role;
  rank: Rank;
  isVerified: boolean;
  isActivated: boolean;
  whatsapp?: string;
  badges: string[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userRole: Role;
  isUserVerified: boolean;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
  likes: string[]; // List of userIds
  comments: Comment[];
}

export interface Ad {
  id: string;
  userId: string;
  username: string;
  userRole: Role;
  title: string;
  description: string;
  role: string;
  location: string;
  contact: string;
  imageUrl?: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  location: string;
  selfies: string[]; // 3 selfie images URLs/placeholders
  videoUrl: string;  // Simulated video URL/status
  age: number;
  gender: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Challenge {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorRole: Role;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  durationDays: number;
  createdAt: string;
  expiresAt: string;
  status: 'Active' | 'Expired' | 'Winner Chosen';
  winnerId?: string;
  winnerUsername?: string;
  submissionsCount: number;
}

export interface Submission {
  id: string;
  challengeId: string;
  participantId: string;
  participantUsername: string;
  mediaUrl: string;
  text: string;
  status: 'pending' | 'winner' | 'none';
  createdAt: string;
}

export interface PasswordResetRequest {
  id: string;
  username: string;
  whatsappNumber: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  receiverUsername: string;
  text: string;
  createdAt: string;
}
