export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  subscription?: SubscriptionPlan;
}

export interface SubscriptionPlan {
  id: string;
  name: 'free' | 'pro' | 'unlimited';
  storiesPerMonth: number;
  exportsPerMonth: number;
  aiVoice: boolean;
  multiformatExport: boolean;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  originalContent: string;
  rewrittenContent?: string;
  category: 'real' | 'fictional';
  emotionalTone: EmotionalTone;
  viralScore: number;
  platform?: 'tiktok' | 'reels' | 'shorts' | 'twitter' | 'all';
  status: 'draft' | 'published' | 'archived';
  exports?: StoryExport[];
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  tags: string[];
}

export type EmotionalTone =
  | 'dramatic'
  | 'humorous'
  | 'inspirational'
  | 'sarcastic'
  | 'mysterious'
  | 'nostalgic';

export interface StoryExport {
  id: string;
  storyId: string;
  format: 'tiktok_script' | 'reels_caption' | 'twitter_thread' | 'youtube_shorts' | 'full_video';
  content: string;
  hooks: string[];
  hashtags: string[];
  narration?: string;
  createdAt: string;
}

export interface ViralAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  estimatedReachPercentage: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'story_published' | 'milestone' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStories: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  averageViralScore: number;
}
