import React from 'react';
import { StyleSheet, Text, View, Slider } from 'react-native';

const ProgressBar = ({ progress, duration, onSeek }) => {
  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={progress}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor="#6366f1"
        minimumTrackTintColor="#6366f1"
        maximumTrackTintColor="#4b5563"
        onSlidingComplete={onSeek}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(progress)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default ProgressBar;
