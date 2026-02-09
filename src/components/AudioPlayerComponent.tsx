import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { AudioPlayer, formatDuration } from '@/services/audio';

interface AudioPlayerComponentProps {
  uri: string;
  title?: string;
}

export default function AudioPlayerComponent({ uri, title }: AudioPlayerComponentProps) {
  const [player] = useState(new AudioPlayer());
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAudio();
    return () => {
      player.unload();
    };
  }, [uri]);

  const loadAudio = async () => {
    setIsLoading(true);
    try {
      await player.load(uri);
      const currentStatus = await player.getStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('Error loading audio component:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await player.pause();
      } else {
        await player.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(async () => {
        const currentStatus = await player.getStatus();
        setStatus(currentStatus);
        if (currentStatus?.didJustFinish) {
          setIsPlaying(false);
          await player.stop();
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = async (value: number) => {
    if (status?.durationMillis) {
      await player.seekTo(value);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color={colors.primary[600]} 
          />
        </TouchableOpacity>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={status?.durationMillis || 0}
            value={status?.positionMillis || 0}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={colors.primary[500]}
            maximumTrackTintColor={colors.neutral[300]}
            thumbTintColor={colors.primary[700]}
          />
          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>
              {formatDuration(status?.positionMillis || 0)}
            </Text>
            <Text style={styles.timeText}>
              {formatDuration(status?.durationMillis || 0)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginRight: spacing.md,
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  timeText: {
    fontSize: 10,
    color: colors.text.secondary,
  },
});
