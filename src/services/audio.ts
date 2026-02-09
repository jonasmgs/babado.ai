import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export class AudioPlayer {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  /**
   * Load audio file
   */
  async load(uri: string): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('Audio loading skipped on web');
      return;
    }
    try {
      // Unload previous sound if exists
      if (this.sound) {
        await this.unload();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );

      this.sound = sound;
    } catch (error) {
      console.error('Error loading audio:', error);
      throw new Error('Failed to load audio file');
    }
  }

  /**
   * Play audio
   */
  async play(): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.playAsync();
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw new Error('Failed to play audio');
    }
  }

  /**
   * Pause audio
   */
  async pause(): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    } catch (error) {
      console.error('Error pausing audio:', error);
      throw new Error('Failed to pause audio');
    }
  }

  /**
   * Stop audio
   */
  async stop(): Promise<void> {
    if (!this.sound) {
      return;
    }

    try {
      await this.sound.stopAsync();
      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  /**
   * Get current playback status
   */
  async getStatus(): Promise<any> {
    if (!this.sound) {
      return null;
    }

    try {
      return await this.sound.getStatusAsync();
    } catch (error) {
      console.error('Error getting status:', error);
      return null;
    }
  }

  /**
   * Seek to position (milliseconds)
   */
  async seekTo(positionMillis: number): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Error seeking:', error);
      throw new Error('Failed to seek');
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  async setVolume(volume: number): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.error('Error setting volume:', error);
      throw new Error('Failed to set volume');
    }
  }

  /**
   * Unload audio and free resources
   */
  async unload(): Promise<void> {
    if (!this.sound) {
      return;
    }

    try {
      await this.sound.unloadAsync();
      this.sound = null;
      this.isPlaying = false;
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

/**
 * Share audio file
 */
export async function shareAudio(uri: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error('Error sharing audio:', error);
    throw new Error('Failed to share audio');
  }
}

/**
 * Download audio file to device
 */
export async function downloadAudio(uri: string, fileName: string): Promise<string> {
  try {
    const docDir = FileSystem.documentDirectory || '';
    const downloadUri = `${docDir}${fileName}`;

    if (Platform.OS === 'web') {
      console.log('Audio download skipped on web:', uri);
      return uri;
    }

    const downloadResult = await FileSystem.downloadAsync(uri, downloadUri);

    if (downloadResult.status !== 200) {
      throw new Error('Download failed');
    }

    return downloadResult.uri;
  } catch (error) {
    console.error('Error downloading audio:', error);
    throw new Error('Failed to download audio');
  }
}

/**
 * Get audio file info
 */
export async function getAudioInfo(uri: string): Promise<FileSystem.FileInfo | null> {
  try {
    return await FileSystem.getInfoAsync(uri);
  } catch (error) {
    console.error('Error getting audio info:', error);
    return null;
  }
}

/**
 * Delete audio file
 */
export async function deleteAudio(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.error('Error deleting audio:', error);
    throw new Error('Failed to delete audio');
  }
}

/**
 * Format duration (milliseconds to MM:SS)
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
