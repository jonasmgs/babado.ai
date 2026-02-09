import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from './supabase';

const documentDirectory = FileSystem.documentDirectory;
const EncodingType = FileSystem.EncodingType;

export interface VideoExportOptions {

  storyId: string;
  userId: string;
  templateId: string;
  overlayText: string;
  backgroundColor: string;
  audioUri?: string;
}

/**
 * Composite video (Simulated for this implementation)
 * In a production app, this would use FFmpeg or a server-side rendering service
 */
export async function compositeVideo(options: VideoExportOptions): Promise<string> {
  if (!documentDirectory) {
    throw new Error('Document directory is not available');
  }

  try {
    console.log('Compositing video with options:', options);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For now, we return a mock URI or the background image/color representation
    // in a real app, this would be the actual .mp4 file URI
    const filename = `video_${options.storyId}_${Date.now()}.mp4`;
    const videoUri = `${documentDirectory}${filename}`;
    
    // Create a dummy file for simulation
    await FileSystem.writeAsStringAsync(videoUri, 'Dummy Video Content', {
      encoding: EncodingType.UTF8,
    });
    
    return videoUri;
  } catch (error) {
    console.error('Error compositing video:', error);
    throw new Error('Failed to composite video');
  }
}


/**
 * Upload video to Supabase Storage
 */
export async function uploadVideoToStorage(
  uri: string,
  storyId: string,
  userId: string
): Promise<string> {
  try {
    const fileName = `${userId}/videos/${storyId}_${Date.now()}.mp4`;
    
    // In a real app, you'd read the file as base64 or blob
    // For simulation, we'll use a small dummy blob
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, new Blob(['dummy content']), {
        contentType: 'video/mp4',
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('videos').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
}

/**
 * Share exported video
 */
export async function shareVideo(uri: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available');
    }
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error('Error sharing video:', error);
  }
}

/**
 * Generate subtitles with timestamps for a given text
 */
export function generateSubtitles(text: string, wordsPerSecond: number = 3) {
  const words = text.split(' ');
  const subtitles = [];
  let currentTime = 0;

  // Group words into short phrases (2-4 words)
  for (let i = 0; i < words.length; i += 3) {
    const phrase = words.slice(i, i + 3).join(' ');
    const duration = phrase.length / (wordsPerSecond * 5); // Rough estimation based on characters
    
    subtitles.push({
      text: phrase,
      startTime: currentTime,
      endTime: currentTime + duration,
    });
    
    currentTime += duration;
  }

  return subtitles;
}

/**
 * Get estimated video duration based on text length and speech rate
 */
export function estimateVideoDuration(text: string, wordsPerMinute: number = 150): number {
  const wordCount = text.split(/\s+/).length;
  return (wordCount / wordsPerMinute) * 60; // Returns duration in seconds
}
