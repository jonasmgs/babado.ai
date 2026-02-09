export interface SocialAccount {
  id: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  username: string;
  avatarUrl?: string;
  isConnected: boolean;
}

export interface ScheduledPost {
  id: string;
  storyId: string;
  platforms: ('tiktok' | 'instagram' | 'youtube')[];
  status: 'pending' | 'published' | 'failed';
  scheduledAt: string;
  caption: string;
}

/**
 * Connect to social media platform
 */
export async function connectPlatform(platform: string): Promise<SocialAccount> {
  // Simulate OAuth flow
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    platform: platform as any,
    username: 'babado_creators',
    isConnected: true,
  };
}

/**
 * Schedule a post
 */
export async function schedulePost(post: Omit<ScheduledPost, 'id' | 'status'>): Promise<ScheduledPost> {
  // Simulate API call to schedule
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    ...post,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending',
  };
}

/**
 * Post immediately
 */
export async function postNow(storyId: string, platforms: string[], caption: string): Promise<boolean> {
  console.log(`Posting story ${storyId} to ${platforms.join(', ')} with caption: ${caption}`);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return true;
}

/**
 * Get performance metrics for a story
 */
export async function getPostMetrics(storyId: string) {
  // Mock data
  return {
    totalViews: 12450,
    likes: 1200,
    shares: 450,
    comments: 89,
    platforms: {
      tiktok: { views: 8000, likes: 800 },
      instagram: { views: 3450, likes: 300 },
      youtube: { views: 1000, likes: 100 },
    }
  };
}
