import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';
import { Platform } from 'react-native';

const documentDirectory = FileSystem.documentDirectory || '';

const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
  labels?: Record<string, string>;
  description?: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    return response.data.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error('Failed to fetch available voices');
  }
}

/**
 * Generate speech from text using ElevenLabs
 */
export async function generateSpeech(
  text: string,
  voiceId: string,
  settings?: VoiceSettings
): Promise<string> {
  try {
    const defaultSettings: VoiceSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0,
      use_speaker_boost: true,
      ...settings,
    };

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: defaultSettings,
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    // Save to local file system
    const filename = `voice_${Date.now()}.mp3`;
    const fileUri = `${documentDirectory}${filename}`;

    if (Platform.OS === 'web') {
      console.log('Audio generation simulated on web:', text);
      return 'https://example.com/dummy.mp3';
    }

    await FileSystem.writeAsStringAsync(
      fileUri,
      Buffer.from(response.data).toString('base64'),
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    return fileUri;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech');
  }
}

/**
 * Upload audio file to Supabase Storage
 */
export async function uploadAudioToStorage(
  localUri: string,
  storyId: string,
  userId: string
): Promise<string> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      throw new Error('Audio file does not exist');
    }

    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileName = `${userId}/${storyId}_${Date.now()}.mp3`;
    const { data, error } = await supabase.storage
      .from('audio')
      .upload(fileName, Buffer.from(base64, 'base64'), {
        contentType: 'audio/mpeg',
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('audio').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw new Error('Failed to upload audio file');
  }
}

/**
 * Get character count for pricing estimation
 */
export function getCharacterCount(text: string): number {
  return text.length;
}

/**
 * Estimate cost for text-to-speech
 * ElevenLabs charges approximately $0.30 per 1000 characters
 */
export function estimateCost(text: string): number {
  const chars = getCharacterCount(text);
  return (chars / 1000) * 0.3;
}

/**
 * Preview a voice (play sample)
 */
export async function previewVoice(voiceId: string): Promise<string | null> {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices/${voiceId}`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    return response.data.preview_url || null;
  } catch (error) {
    console.error('Error previewing voice:', error);
    return null;
  }
}

/**
 * Check if ElevenLabs API key is configured
 */
export function isElevenLabsConfigured(): boolean {
  return !!ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== '';
}
