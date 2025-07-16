import { Image } from 'expo-image';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SongItem = ({ song, isPlaying, onPress }) => {
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <TouchableOpacity
      style={[styles.songItem, isPlaying && styles.playingSong]}
      onPress={() => onPress(song)}
    >
      <Image source={song.artwork} style={styles.artwork} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, isPlaying && styles.playingText]}>
          {song.title}
        </Text>
        <Text style={styles.songArtist}>{song.artist}</Text>
      </View>
      <View style={styles.songMeta}>
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
        {isPlaying && (
          <MaterialIcons name="equalizer" size={16} color="#6366f1" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SongList = ({ songs, currentSongId, onSongPress }) => {
  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SongItem
          song={item}
          isPlaying={item.id === currentSongId}
          onPress={onSongPress}
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  playingSong: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playingText: {
    color: '#6366f1',
  },
  songArtist: {
    color: '#9ca3af',
    fontSize: 14,
  },
  songMeta: {
    alignItems: 'flex-end',
  },
  duration: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default SongList;
