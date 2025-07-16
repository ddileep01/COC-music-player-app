import { AntDesign, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const PlayerControls = ({
  isPlaying,
  onPlayPausePress,
  onPrevPress,
  onNextPress,
  onRepeatPress,
  onShufflePress,
  isRepeat,
  isShuffle,
}) => {
  const handlePress = (callback) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <BlurView intensity={30} tint="dark" style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconButton, isShuffle && styles.activeButton]}
          onPress={() => handlePress(onShufflePress)}
        >
          <MaterialIcons
            name="shuffle"
            size={24}
            color={isShuffle ? "#6366f1" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handlePress(onPrevPress)}
        >
          <FontAwesome5 name="step-backward" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => handlePress(onPlayPausePress)}
        >
          {isPlaying ? (
            <AntDesign name="pausecircle" size={64} color="#6366f1" />
          ) : (
            <AntDesign name="play" size={64} color="#6366f1" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handlePress(onNextPress)}
        >
          <FontAwesome5 name="step-forward" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, isRepeat && styles.activeButton]}
          onPress={() => handlePress(onRepeatPress)}
        >
          <Entypo
            name="cycle"
            size={24}
            color={isRepeat ? "#6366f1" : "white"}
          />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  playButton: {
    padding: 10,
  },
});

export default PlayerControls;
