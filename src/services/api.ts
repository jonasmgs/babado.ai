import axios from 'axios';
import { supabase } from './supabase';
import { Story, ViralAnalysis, StoryExport } from '@/types';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export async function generateStoryRewrite(
  originalContent: string,
  tone: string,
  platform: string
) {
  try {
    const response = await apiClient.post('/stories/rewrite', {
      originalContent,
      tone,
      platform,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function generateViralScore(content: string): Promise<{ data: ViralAnalysis | null; error: any }> {
  try {
    const response = await apiClient.post('/stories/viral-score', {
      content,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function generateStoryHooks(content: string, count: number = 5) {
  try {
    const response = await apiClient.post('/stories/hooks', {
      content,
      count,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function exportStoryForPlatform(
  storyId: string,
  platform: 'tiktok' | 'reels' | 'shorts' | 'twitter'
): Promise<{ data: StoryExport | null; error: any }> {
  try {
    const response = await apiClient.post(`/stories/${storyId}/export`, {
      platform,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function generateNarration(text: string, voice: string = 'default') {
  try {
    const response = await apiClient.post('/audio/narration', {
      text,
      voice,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function uploadMedia(formData: FormData) {
  try {
    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export default apiClient;
