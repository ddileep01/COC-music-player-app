import { Audio } from 'expo-av';
// LinearGradient removed due to dependency issues
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PlayerControls from '../components/PlayerControls';
import PlaylistManager from '../components/PlaylistManager';
import ProgressBar from '../components/ProgressBar';
import { SONGS } from '../constants/songs';
import { usePlaylists } from '../contexts/PlaylistContext';

const { width } = Dimensions.get('window');

export default function PlayerScreen({ route, navigation }) {
  const { songId = '1' } = route.params || {};
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(SONGS.findIndex(s => s.id === songId));
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylists();
  
  const rotateValue = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(null);
  
  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (rotateAnimation.current) {
        rotateAnimation.current.stop();
      }
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (isPlaying) {
      startRotation();
    } else {
      stopRotation();
    }
  }, [isPlaying]);

  const startRotation = () => {
    rotateAnimation.current = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.current.start();
  };

  const stopRotation = () => {
    if (rotateAnimation.current) {
      rotateAnimation.current.stop();
    }
  };

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      setIsLoading(true);
      
      // In a real app, you would use the actual audio file
      // For this example, we'll simulate loading the song
      const { sound: newSound } = await Audio.Sound.createAsync(
        // Replace with actual audio file when available
        // currentSong.url
        require('../assets/audio/song1.mp3'),
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsLoading(false);
      
      // Auto-play when loaded
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
      
      // Handle end of track
      if (status.didJustFinish) {
        if (isRepeat) {
          // Replay the same song
          replayCurrentSong();
        } else {
          // Play next song
          handleNext();
        }
      }
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const handlePrev = () => {
    let newIndex;
    if (isShuffle) {
      // Random song excluding current
      const availableIndices = [...Array(SONGS.length).keys()].filter(i => i !== currentSongIndex);
      newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      newIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    }
    setCurrentSongIndex(newIndex);
  };

  const handleNext = () => {
    let newIndex;
    if (isShuffle) {
      // Random song excluding current
      const availableIndices = [...Array(SONGS.length).keys()].filter(i => i !== currentSongIndex);
      newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      newIndex = (currentSongIndex + 1) % SONGS.length;
    }
    setCurrentSongIndex(newIndex);
  };

  const replayCurrentSong = async () => {
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  };

  const handleSeek = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleAddToPlaylist = (playlist, song) => {
    addSongToPlaylist(playlist.id, song);
    setShowPlaylistManager(false);
  };
  
  const handleCreatePlaylist = (name) => {
    const newPlaylist = createPlaylist(name);
    // Automatically add current song to the new playlist
    addSongToPlaylist(newPlaylist.id, currentSong);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.artworkContainer}>
        <Animated.View 
          style={[styles.artworkInner, { transform: [{ rotate: spin }] }]}
        >
          <Image 
            source={currentSong.artwork} 
            style={styles.artwork}
            contentFit="cover"
          />
        </Animated.View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.songTitle}>{currentSong.title}</Text>
        <Text style={styles.artistName}>{currentSong.artist}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={position} 
          duration={duration} 
          onSeek={handleSeek} 
        />
      </View>
      
      <PlayerControls 
        isPlaying={isPlaying}
        onPlayPausePress={handlePlayPause}
        onPrevPress={handlePrev}
        onNextPress={handleNext}
        onRepeatPress={() => setIsRepeat(!isRepeat)}
        onShufflePress={() => setIsShuffle(!isShuffle)}
        isRepeat={isRepeat}
        isShuffle={isShuffle}
      />
      
      <BlurView intensity={20} tint="dark" style={styles.lyricsContainer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowPlaylistManager(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.actionText}>Add to Playlist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Playlist', { playlistId: '1' })}
          >
            <Ionicons name="list-outline" size={24} color="white" />
            <Text style={styles.actionText}>View Playlists</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
      
      <PlaylistManager
        visible={showPlaylistManager}
        onClose={() => setShowPlaylistManager(false)}
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onSelectPlaylist={handleAddToPlaylist}
        currentSong={currentSong}
      />
    </View>
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
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  artworkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  artworkInner: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  artistName: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 10,
  },
  lyricsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
