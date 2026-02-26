import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider'; // <--- IMPORT THƯ VIỆN SLIDER MỚI
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { useMusic } from '../../context/MusicContext';

const BANNER_DATA = [
  { id: '1', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' },
  { id: '2', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5fd37b5?w=500&q=80' },
];

// Hàm chuyển đổi milli-giây thành phút:giây (ví dụ: 1:30)
const formatTime = (millis) => {
  if (!millis) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const { user, logout } = useAuth(); 
  // LẤY THÊM DỮ LIỆU TUA NHẠC VÀ ÂM LƯỢNG
  const { playlist, currentSong, isPlaying, playSong, pauseSong, resumeSong, duration, position, volume, seekTo, changeVolume } = useMusic();

  const Sidebar = () => (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Ionicons name="musical-notes" size={40} color="#c665e8" />
        <Text style={styles.logoText}>MusicPlayer</Text>
      </View>
      <TouchableOpacity style={[styles.menuItem, styles.menuActive]}>
        <Ionicons name="compass-outline" size={24} color="#fff" />
        <Text style={styles.menuText}>Khám Phá</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCardItem = ({ item }) => {
    const isThisSongPlaying = currentSong?.id === item.id;
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={() => playSong(item)}>
        <Image source={{ uri: item.image }} style={[styles.cardImage, isThisSongPlaying && styles.cardImageActive]} resizeMode="cover" />
        <Text style={[styles.cardTitle, isThisSongPlaying && { color: '#c665e8' }]} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
        {isThisSongPlaying && isPlaying && (
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Ionicons name="musical-notes" size={12} color="#c665e8" />
            <Text style={{color: '#c665e8', fontSize: 11, marginLeft: 4}}>Đang phát</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.fullScreen}>
      <View style={{ flex: 1, flexDirection: isLargeScreen ? 'row' : 'column' }}>
        {isLargeScreen && <Sidebar />}
        <LinearGradient colors={['#170f23', '#2a1b3d', '#170f23']} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.searchBar, isLargeScreen && { maxWidth: 400 }]}>
                <Ionicons name="search" size={20} color="#ccc" style={{ marginRight: 10 }} />
                <Text style={{ color: '#aaa' }}>Tìm kiếm bài hát, nghệ sĩ...</Text>
              </View>
              {user ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isLargeScreen && <Text style={styles.userName}>{user.name}</Text>}
                    <TouchableOpacity onPress={logout}>
                      <Image source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
                    </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.authContainer}>
                   <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.loginText}>Đăng nhập</Text></TouchableOpacity>
                   <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/register')}><Text style={styles.registerText}>Đăng ký</Text></TouchableOpacity>
                </View>
              )}
            </View>

            {/* Danh sách nhạc */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Khám Phá</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
                {BANNER_DATA.map((item) => (
                  <TouchableOpacity key={item.id} style={{ marginRight: 20 }}>
                    <Image source={{ uri: item.image }} style={[styles.bannerImage, isLargeScreen && { width: 400, height: 220 }]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Gợi ý cho bạn</Text>
              <FlatList horizontal data={playlist} renderItem={renderCardItem} keyExtractor={item => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }} />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>

      {/* === MINI PLAYER THÔNG MINH NÂNG CẤP === */}
      {currentSong && (
        <View style={[styles.miniPlayer, { width: '100%', flexDirection: 'column', height: isLargeScreen ? 110 : 130 }]}>
          
          {/* THANH TUA NHẠC (Nằm vắt ngang bên trên) */}
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, marginTop: 5 }}>
            <Text style={{ color: '#ccc', fontSize: 12, width: 40 }}>{formatTime(position)}</Text>
            <Slider
              style={{ flex: 1, height: 20, marginHorizontal: 10 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              minimumTrackTintColor="#c665e8"
              maximumTrackTintColor="#555"
              thumbTintColor="#c665e8"
              onSlidingComplete={seekTo} // Kéo thả chuột xong thì tua đến đó
            />
            <Text style={{ color: '#ccc', fontSize: 12, width: 40, textAlign: 'right' }}>{formatTime(duration)}</Text>
          </View>

          {/* DÀN NÚT ĐIỀU KHIỂN & ÂM LƯỢNG */}
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, flex: 1, paddingBottom: 10 }}>
            <View style={{flexDirection: 'row', alignItems: 'center', width: isLargeScreen ? 250 : 'auto'}}>
              <Image source={{ uri: currentSong.image}} style={styles.miniArt} />
              <View style={{ paddingHorizontal: 12 }}>
                <Text style={styles.miniTitle} numberOfLines={1}>{currentSong.title}</Text>
                <Text style={styles.miniArtist} numberOfLines={1}>{currentSong.artist}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {isLargeScreen && <TouchableOpacity><Ionicons name="shuffle" size={24} color="#ccc" style={{marginHorizontal:15}} /></TouchableOpacity>}
              <TouchableOpacity><Ionicons name="play-skip-back" size={24} color="#fff" style={{marginHorizontal:15}} /></TouchableOpacity>
              <TouchableOpacity onPress={() => isPlaying ? pauseSong() : resumeSong()}>
                <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={45} color="#fff" style={{marginHorizontal:15}} />
              </TouchableOpacity>
              <TouchableOpacity><Ionicons name="play-skip-forward" size={24} color="#fff" style={{marginHorizontal:15}} /></TouchableOpacity>
              {isLargeScreen && <TouchableOpacity><Ionicons name="repeat" size={24} color="#ccc" style={{marginHorizontal:15}} /></TouchableOpacity>}
            </View>

            {/* THANH ÂM LƯỢNG (Chỉ hiện trên màn hình lớn) */}
            {isLargeScreen && (
              <View style={{flexDirection: 'row', alignItems: 'center', width: 200, justifyContent: 'flex-end'}}>
                <Ionicons name={volume === 0 ? "volume-mute" : "volume-medium"} size={24} color="#fff" />
                <Slider
                  style={{ width: 100, height: 20, marginLeft: 10 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  minimumTrackTintColor="#fff"
                  maximumTrackTintColor="#555"
                  thumbTintColor="#fff"
                  onValueChange={changeVolume} // Kéo đến đâu tiếng to/nhỏ đến đó
                />
              </View>
            )}
          </View>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: '#170f23' },
  sidebar: { width: 240, backgroundColor: '#231b2e', paddingTop: 30, paddingHorizontal: 20, borderRightWidth: 1, borderRightColor: '#ffffff10' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  logoText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderRadius: 5 },
  menuActive: { backgroundColor: '#ffffff10' },
  menuText: { color: '#fff', fontSize: 16, marginLeft: 15, fontWeight: '500' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff10', padding: 12, borderRadius: 25, marginRight: 20 },
  authContainer: { flexDirection: 'row', alignItems: 'center' },
  loginText: { color: '#c665e8', fontWeight: 'bold', fontSize: 15, marginRight: 15 },
  registerBtn: { backgroundColor: '#9b4de0', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  registerText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#c665e8' },
  userName: { color: '#fff', marginRight: 15, fontWeight: 'bold' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  bannerImage: { width: 300, height: 160, borderRadius: 12 },
  cardContainer: { width: 160, marginRight: 20 },
  cardImage: { width: 160, height: 160, borderRadius: 10, marginBottom: 10 },
  cardImageActive: { borderWidth: 2, borderColor: '#c665e8' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardArtist: { color: '#888', fontSize: 13, marginTop: 4 },
  miniPlayer: { backgroundColor: '#170f23', borderTopWidth: 1, borderTopColor: '#ffffff10', position: 'absolute', bottom: 0, zIndex: 100 },
  miniArt: { width: 50, height: 50, borderRadius: 5 },
  miniTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, width: 150 },
  miniArtist: { color: '#ccc', fontSize: 12, width: 150 },
});