import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlaylists } from '../contexts/PlaylistContext';

export default function PlaylistScreen({ route, navigation }) {
  const { playlistId } = route.params || {};
  const { playlists, removeSongFromPlaylist } = usePlaylists();
  const [currentSongId, setCurrentSongId] = useState(null);
  
  const playlist = playlists.find(p => p.id === playlistId) || playlists[0];
  
  const handleSongPress = (song) => {
    setCurrentSongId(song.id);
    navigation.navigate('Player', { songId: song.id });
  };
  
  const handleRemoveSong = (songId) => {
    removeSongFromPlaylist(playlist.id, songId);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="musical-notes" size={60} color="rgba(99, 102, 241, 0.5)" />
      <Text style={styles.emptyTitle}>No songs in this playlist</Text>
      <Text style={styles.emptySubtitle}>
        Add songs from the player screen
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Songs</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <TouchableOpacity 
        style={styles.songContent}
        onPress={() => handleSongPress(item)}
      >
        <Image source={item.artwork} style={styles.artwork} />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveSong(item.id)}
      >
        <Ionicons name="remove-circle" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1e293b', '#0f172a']}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{playlist.name}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.songCount}>{playlist.songs.length} songs</Text>
        </View>
      </View>
      
      {playlist.songs.length > 0 ? (
        <FlatList
          data={playlist.songs}
          keyExtractor={(item) => item.id}
          renderItem={renderSongItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : renderEmptyState()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    padding: 8,
  },
  songCount: {
    color: '#9ca3af',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 12,
    marginVertical: 4,
    overflow: 'hidden',
  },
  songContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
  songArtist: {
    color: '#9ca3af',
    fontSize: 14,
  },
  removeButton: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
