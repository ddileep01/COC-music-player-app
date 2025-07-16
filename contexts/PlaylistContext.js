import React, { createContext, useContext, useState } from 'react';

// Create context
const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  // Initialize with a default playlist
  const [playlists, setPlaylists] = useState([
    {
      id: '1',
      name: 'Favorites',
      songs: [],
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Create a new playlist
  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: [],
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  // Delete a playlist
  const deletePlaylist = (playlistId) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  };

  // Add a song to a playlist
  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if song already exists in playlist
        const songExists = playlist.songs.some(s => s.id === song.id);
        if (!songExists) {
          return {
            ...playlist,
            songs: [...playlist.songs, song],
          };
        }
      }
      return playlist;
    }));
  };

  // Remove a song from a playlist
  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: playlist.songs.filter(song => song.id !== songId),
        };
      }
      return playlist;
    }));
  };

  // Get songs from a specific playlist
  const getPlaylistSongs = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist ? playlist.songs : [];
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        isLoading,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        getPlaylistSongs,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom hook to use the playlist context
export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};
