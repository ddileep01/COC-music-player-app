// screens/HomeScreen.js
import { Ionicons } from '@expo/vector-icons';
// LinearGradient removed due to dependency issues
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SongList from '../components/SongList';
import { SONGS } from '../constants/songs';

export default function HomeScreen({ navigation }) {
  const [currentSongId, setCurrentSongId] = useState(null);

  const handleSongPress = (song) => {
    setCurrentSongId(song.id);
    navigation.navigate('Player', { songId: song.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>COC Music Player</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuredContainer}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity 
            style={styles.featuredItem}
            onPress={() => handleSongPress(SONGS[0])}
          >
            <Image 
              source={SONGS[0].artwork} 
              style={styles.featuredArtwork}
              contentFit="cover"
              transition={1000}
            />
            <View style={[styles.gradient, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>{SONGS[0].title}</Text>
                <Text style={styles.featuredArtist}>{SONGS[0].artist}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.songsContainer}>
          <Text style={styles.sectionTitle}>All Songs</Text>
          <SongList 
            songs={SONGS} 
            currentSongId={currentSongId} 
            onSongPress={handleSongPress} 
          />
        </View>
        
        {currentSongId && (
          <TouchableOpacity 
            style={styles.miniPlayer}
            onPress={() => navigation.navigate('Player', { songId: currentSongId })}
          >
            <Image 
              source={SONGS.find(s => s.id === currentSongId).artwork} 
              style={styles.miniArtwork}
            />
            <View style={styles.miniInfo}>
              <Text style={styles.miniTitle}>
                {SONGS.find(s => s.id === currentSongId).title}
              </Text>
              <Text style={styles.miniArtist}>
                {SONGS.find(s => s.id === currentSongId).artist}
              </Text>
            </View>
            <TouchableOpacity style={styles.miniPlayButton}>
              <Ionicons name="play-circle" size={36} color="#6366f1" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    padding: 8,
  },
  featuredContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  featuredItem: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredArtwork: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  featuredInfo: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  featuredArtist: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  songsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  miniArtwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  miniInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  miniArtist: {
    color: '#9ca3af',
    fontSize: 12,
  },
  miniPlayButton: {
    padding: 8,
  },
});
