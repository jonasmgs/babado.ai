import { create } from 'zustand';
import { Story, ViralAnalysis } from '@/types';
import { supabase } from '@/services/supabase';

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  isLoading: boolean;
  error: string | null;
  fetchStories: (userId: string) => Promise<void>;
  createStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Story | null>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  setCurrentStory: (story: Story | null) => void;
  clearError: () => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  currentStory: null,
  isLoading: false,
  error: null,

  fetchStories: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      set({ stories: data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createStory: async (story) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([story])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        set((state) => ({
          stories: [data[0], ...state.stories],
          isLoading: false,
        }));
        return data[0];
      }
      return null;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateStory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        stories: state.stories.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        currentStory: state.currentStory?.id === id ? { ...state.currentStory, ...updates } : state.currentStory,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteStory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('stories').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        stories: state.stories.filter((s) => s.id !== id),
        currentStory: state.currentStory?.id === id ? null : state.currentStory,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentStory: (story) => set({ currentStory: story }),

  clearError: () => set({ error: null }),
}));
