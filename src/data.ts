/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Post, Ad, Challenge, VerificationRequest, PasswordResetRequest, Submission, Message } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin_user',
    username: 'mrx26',
    email: 'admin@openlife.app',
    gender: 'Male',
    role: 'Admin',
    rank: 'Best',
    isVerified: true,
    isActivated: true,
    badges: ['👑 Owner', '💻 Founder']
  },
  {
    id: 'user_elara',
    username: 'Mistress_Elara',
    email: 'elara@openlife.app',
    gender: 'Female',
    role: 'Mistress/DOM',
    rank: 'Best',
    isVerified: true,
    isActivated: true,
    badges: ['👑 Elite DOM', '🔥 Dark Empress']
  },
  {
    id: 'user_kael',
    username: 'Slave_Kael',
    email: 'kael@openlife.app',
    gender: 'Male',
    role: 'Slave',
    rank: 'Normal',
    isVerified: false,
    isActivated: true,
    badges: []
  },
  {
    id: 'user_seraph',
    username: 'Sub_Seraphina',
    email: 'seraph@openlife.app',
    gender: 'Female',
    role: 'SUB',
    rank: 'Better',
    isVerified: true,
    isActivated: true,
    badges: ['🏆 Best Slave']
  },
  {
    id: 'user_valerius',
    username: 'Master_Valerius',
    email: 'valerius@openlife.app',
    gender: 'Male',
    role: 'Master',
    rank: 'Better',
    isVerified: true,
    isActivated: true,
    badges: ['⚔️ Sovereign']
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_elara',
    username: 'Mistress_Elara',
    userRole: 'Mistress/DOM',
    isUserVerified: true,
    text: 'Welcome to the inner circle of Open Life. Here, we shed our public masks and embrace our true desires. To those newly admitted: boundaries are our playground, respect is our currency. Let the games begin.',
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    createdAt: '2026-06-26T20:15:00.000Z',
    likes: ['user_valerius', 'user_seraph'],
    comments: [
      {
        id: 'comment_1',
        username: 'Sub_Seraphina',
        text: 'Always ready to obey, Mistress.',
        createdAt: '2026-06-26T21:00:00.000Z'
      },
      {
        id: 'comment_2',
        username: 'Master_Valerius',
        text: 'Excellently put, Elara. A standard of curation.',
        createdAt: '2026-06-26T21:30:00.000Z'
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'user_valerius',
    username: 'Master_Valerius',
    userRole: 'Master',
    isUserVerified: true,
    text: 'A quiet evening in the study. Precision, discipline, and complete absolute devotion. True power lies not in force, but in the elegant alignment of wills.',
    mediaUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    createdAt: '2026-06-25T18:42:00.000Z',
    likes: ['user_elara'],
    comments: []
  },
  {
    id: 'post_3',
    userId: 'user_seraph',
    username: 'Sub_Seraphina',
    userRole: 'SUB',
    isUserVerified: true,
    text: 'The absolute bliss of surrender. Under the golden light of instruction, everything else falls silent.',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    createdAt: '2026-06-25T12:10:00.000Z',
    likes: ['user_elara', 'user_valerius'],
    comments: [
      {
        id: 'comment_3',
        username: 'Mistress_Elara',
        text: 'Beautifully spoken, Seraphina.',
        createdAt: '2026-06-25T13:00:00.000Z'
      }
    ]
  }
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad_1',
    userId: 'user_elara',
    username: 'Mistress_Elara',
    userRole: 'Mistress/DOM',
    title: 'Seeking Dedicated Slave for Intense Protocol',
    description: 'Looking for an experienced, fully committed slave who understands absolute submission. Strict protocols, high expectations, and unwavering loyalty are mandatory. Initial trials will be online challenges, leading to long-term digital or physical arrangements.',
    role: 'Mistress/DOM',
    location: 'Berlin / Hybrid',
    contact: 'Telegram: @MistressElara_Void',
    createdAt: '2026-06-26T14:30:00.000Z'
  },
  {
    id: 'ad_2',
    userId: 'user_valerius',
    username: 'Master_Valerius',
    userRole: 'Master',
    title: 'Discreet Master Seeking Obedient SUB',
    description: 'Seeking a loyal, refined submissive for an intellectual, aesthetic and high-protocol dynamic. Must be capable of detailed reporting, daily task coordination, and total transparency.',
    role: 'Master',
    location: 'New York / Online',
    contact: 'Telegram: @ValeriusSovereign',
    createdAt: '2026-06-24T09:15:00.000Z'
  },
  {
    id: 'ad_3',
    userId: 'user_seraph',
    username: 'Sub_Seraphina',
    userRole: 'SUB',
    title: 'Submissive Looking for Structured Leadership',
    description: 'A verified, devoted submissive seeking a dominant presence who values strict structure, daily check-ins, and artistic challenges. Experienced in high-protocol environments and eager to serve.',
    role: 'SUB',
    location: 'Tokyo / Online',
    contact: 'Telegram: @Seraph_Sub',
    createdAt: '2026-06-23T11:00:00.000Z'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'challenge_1',
    creatorId: 'user_elara',
    creatorUsername: 'Mistress_Elara',
    creatorRole: 'Mistress/DOM',
    text: 'THE CRIMSON DESCENT: Submit a photo or short video demonstrating your finest posture under deep obsidian lighting with a crimson accent. Demonstrate perfect restraint and capture the absolute stillness of your devotion.',
    mediaUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    durationDays: 4,
    createdAt: '2026-06-25T08:00:00.000Z',
    expiresAt: '2026-06-29T08:00:00.000Z',
    status: 'Active',
    submissionsCount: 1
  },
  {
    id: 'challenge_2',
    creatorId: 'user_valerius',
    creatorUsername: 'Master_Valerius',
    creatorRole: 'Master',
    text: 'CHRONOS EFFICIENCY: Prepare and write out a detailed schedule of your daily self-improvement exercises. Organize your tasks, times, and rules. Send an image of your hand-written schedule, written in absolute clarity and precision.',
    mediaUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    durationDays: 2,
    createdAt: '2026-06-26T12:00:00.000Z',
    expiresAt: '2026-06-28T12:00:00.000Z',
    status: 'Active',
    submissionsCount: 0
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'submission_1',
    challengeId: 'challenge_1',
    participantId: 'user_seraph',
    participantUsername: 'Sub_Seraphina',
    mediaUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    text: 'Under your command, Mistress. Still and quiet in the shadows.',
    status: 'pending',
    createdAt: '2026-06-26T09:30:00.000Z'
  }
];

export const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'req_1',
    userId: 'user_kael',
    username: 'Slave_Kael',
    fullName: 'Kaelen Miller',
    location: 'London, UK',
    selfies: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', // Angle 1
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', // Angle 2
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'  // Angle 3
    ],
    videoUrl: 'Simulated 8s Verification Video (Check identity details against ID)',
    age: 24,
    gender: 'Male',
    status: 'pending',
    createdAt: '2026-06-27T01:00:00.000Z'
  }
];

export const INITIAL_RESETS: PasswordResetRequest[] = [
  {
    id: 'reset_1',
    username: 'Slave_Kael',
    whatsappNumber: '+44 7911 123456',
    status: 'pending',
    createdAt: '2026-06-27T02:30:00.000Z'
  }
];

// LocalStorage helpers
export const getStoredData = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initial;
  }
};

export const setStoredData = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
