import { Audio } from 'expo-av';
import { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  
  // --- STATE MỚI CHO THANH TRƯỢT ---
  const [duration, setDuration] = useState(0); // Tổng thời gian bài hát
  const [position, setPosition] = useState(0); // Thời gian đang phát hiện tại
  const [volume, setVolume] = useState(1.0);   // Âm lượng (từ 0.0 đến 1.0)

  const PLAYLIST = [
    { id: '1', title: 'Ngắm Hoa Lệ Rơi ', artist: 'Châu Khải Phong', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80', url: 'https://res.cloudinary.com/djp9dqoyt/video/upload/v1764341350/gxqfxodncpz5phzl0dyt.mp3' },
    { id: '2', title: 'Nhạc Demo 2 (Nhẹ nhàng)', artist: 'SoundHelix', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5fd37b5?w=500&q=80', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { id: '3', title: 'Piano Trầm Lắng', artist: 'SoundHelix', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  async function playSong(song) {
    try {
      if (sound) await sound.unloadAsync();

      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
      }

      // Khởi tạo bài hát với âm lượng hiện tại
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true, volume: volume } 
      );

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);

      // --- THEO DÕI THỜI GIAN CHẠY ---
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis); // Cập nhật vị trí hiện tại
          setDuration(status.durationMillis); // Cập nhật tổng thời gian
          
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
          }
        }
      });
    } catch (error) {
      console.log("Lỗi phát nhạc:", error);
    }
  }

  async function pauseSong() {
    if (sound) { await sound.pauseAsync(); setIsPlaying(false); }
  }

  async function resumeSong() {
    if (sound) { await sound.playAsync(); setIsPlaying(true); }
  }

  // --- HÀM TUA NHẠC ---
  async function seekTo(value) {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  }

  // --- HÀM CHỈNH ÂM LƯỢNG ---
  async function changeVolume(value) {
    if (sound) {
      await sound.setVolumeAsync(value);
    }
    setVolume(value);
  }

  return (
    <MusicContext.Provider value={{
      currentSong, isPlaying, playlist: PLAYLIST, 
      playSong, pauseSong, resumeSong,
      duration, position, volume, seekTo, changeVolume // Xuất các hàm mới ra ngoài
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);