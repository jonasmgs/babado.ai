export interface VideoTemplate {
  id: string;
  name: string;
  platform: 'tiktok' | 'reels' | 'shorts';
  width: number;
  height: number;
  aspectRatio: number;
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  defaultStyles: {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
  };
}

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'tiktok-standard',
    name: 'TikTok Standard',
    platform: 'tiktok',
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    safeArea: {
      top: 150,
      bottom: 400,
      left: 50,
      right: 150,
    },
    defaultStyles: {
      fontSize: 48,
      fontFamily: 'System',
      fontWeight: 'bold',
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      textAlign: 'center',
    },
  },
  {
    id: 'reels-standard',
    name: 'Instagram Reels',
    platform: 'reels',
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    safeArea: {
      top: 100,
      bottom: 300,
      left: 100,
      right: 100,
    },
    defaultStyles: {
      fontSize: 42,
      fontFamily: 'System',
      fontWeight: '900',
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
  },
  {
    id: 'shorts-standard',
    name: 'YouTube Shorts',
    platform: 'shorts',
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    safeArea: {
      top: 50,
      bottom: 200,
      left: 50,
      right: 50,
    },
    defaultStyles: {
      fontSize: 44,
      fontFamily: 'System',
      fontWeight: '700',
      color: '#FFFFFF',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      textAlign: 'left',
    },
  },
];

export const getTemplateById = (id: string) => VIDEO_TEMPLATES.find(t => t.id === id);
export const getTemplatesByPlatform = (platform: 'tiktok' | 'reels' | 'shorts') => 
  VIDEO_TEMPLATES.filter(t => t.platform === platform);
