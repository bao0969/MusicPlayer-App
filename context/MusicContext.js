import { Audio } from 'expo-av';
import { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native'; // <--- CHÁU THÊM DÒNG NÀY

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  // --- DỮ LIỆU NHẠC ONLINE ---
  const PLAYLIST = [
    {
      id: '1',
      title: 'Ngắm Hoa Lệ Rơi ',
      artist: 'Châu Khải Phong',
      image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/f/1/5/7/f15779557760927e1f486a4382836267.jpg',
      url: 'https://res.cloudinary.com/djp9dqoyt/video/upload/v1764341350/gxqfxodncpz5phzl0dyt.mp3'
    },
    {
      id: '2',
      title: 'Nhạc Demo 2 (Nhẹ nhàng)',
      artist: 'SoundHelix',
      image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/c/b/1/3/cb1372b64955b25372338c237d8004b7.jpg',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    },
    {
      id: '3',
      title: 'Piano Trầm Lắng',
      artist: 'SoundHelix',
      image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/4/3/1/6/43163351227038743179262276527582.jpg',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: '4',
      title: 'Nhịp Điệu Nhanh',
      artist: 'Test Artist',
      image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/e/2/3/9/e23924376326127e7f95033c467a90f1.jpg',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
  ];

  // --- HÀM PHÁT NHẠC ---
  async function playSong(song) {
    try {
      console.log("Đang chuẩn bị phát bài:", song.title); // In ra để kiểm tra

      // 1. Nếu đang có bài nào hát thì tắt đi
      if (sound) {
        await sound.unloadAsync();
      }

      // 2. SỬA LỖI WEB: Chỉ chạy cấu hình này nếu KHÔNG PHẢI là web
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
      }

      // 3. Tải nhạc từ URL Online
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true } 
      );

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);

      // 4. Lắng nghe: Hết bài thì tự đổi icon thành Pause
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

    } catch (error) {
      console.log("Lỗi phát nhạc:", error);
      alert("Không thể phát nhạc: " + error.message); // Báo lỗi thẳng lên màn hình để dễ tìm
    }
  }

  // --- HÀM TẠM DỪNG ---
  async function pauseSong() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  // --- HÀM TIẾP TỤC HÁT ---
  async function resumeSong() {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      playlist: PLAYLIST, 
      playSong,
      pauseSong,
      resumeSong
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);