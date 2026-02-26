import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

// NỐI DÂY ĐIỆN VỚI KHO TỔNG
import { useAuth } from '../../context/AuthContext';
import { useMusic } from '../../context/MusicContext'; // <--- Bổ sung kho nhạc vào đây

const BANNER_DATA = [
  { id: '1', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' },
  { id: '2', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5fd37b5?w=500&q=80' },
  { id: '3', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Lấy dữ liệu Đăng nhập
  const { user, logout } = useAuth(); 

  // LẤY DỮ LIỆU TỪ KHO NHẠC (Nâng cấp quan trọng)
  const { playlist, currentSong, isPlaying, playSong, pauseSong, resumeSong } = useMusic();

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

  // NÂNG CẤP: Xử lý sự kiện bấm vào để phát nhạc + Hiệu ứng bài hát đang phát
  const renderCardItem = ({ item }) => {
    const isThisSongPlaying = currentSong?.id === item.id; // Kiểm tra xem bài này có đang được chọn không

    return (
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={() => playSong(item)} // <--- Lệnh phát nhạc ở đây
      >
        <Image source={{ uri: item.image }} style={[styles.cardImage, isThisSongPlaying && styles.cardImageActive]} resizeMode="cover" />
        
        {/* Đổi màu chữ nếu bài này đang hát */}
        <Text style={[styles.cardTitle, isThisSongPlaying && { color: '#c665e8' }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>

        {/* Hiện thêm biểu tượng nếu đang phát */}
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
            
            {/* === HEADER === */}
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
                   <TouchableOpacity onPress={() => router.push('/')}> 
                     <Text style={styles.loginText}>Đăng nhập</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/register')}>
                     <Text style={styles.registerText}>Đăng ký</Text>
                   </TouchableOpacity>
                </View>
              )}
            </View>

            {/* === BANNER === */}
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

            {/* === DANH SÁCH NHẠC (Đã lấy data thật) === */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Gợi ý cho bạn</Text>
              <FlatList 
                horizontal 
                data={playlist} // <--- Đổi thành danh sách từ MusicContext
                renderItem={renderCardItem} 
                keyExtractor={item => item.id} 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingLeft: 20 }} 
              />
            </View>

          </ScrollView>
        </LinearGradient>
      </View>

      {/* === MINI PLAYER THÔNG MINH === */}
      {/* Nâng cấp: Chỉ hiện thanh Player nếu có bài hát đang được chọn */}
      {currentSong && (
        <View style={[styles.miniPlayer, { width: '100%' }]}>
          <View style={{flexDirection: 'row', alignItems: 'center', width: isLargeScreen ? 300 : 'auto'}}>
            <Image source={{ uri: currentSong.image}} style={styles.miniArt} />
            <View style={{ paddingHorizontal: 12 }}>
              <Text style={styles.miniTitle}>{currentSong.title}</Text>
              <Text style={styles.miniArtist}>{currentSong.artist}</Text>
            </View>
          </View>

          {/* Cụm nút điều khiển */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {isLargeScreen && <TouchableOpacity><Ionicons name="shuffle" size={24} color="#ccc" style={{marginHorizontal:15}} /></TouchableOpacity>}
            {isLargeScreen && <TouchableOpacity><Ionicons name="play-skip-back" size={24} color="#fff" style={{marginHorizontal:15}} /></TouchableOpacity>}
            
            {/* Nút Play/Pause tự động đổi icon */}
            <TouchableOpacity onPress={() => isPlaying ? pauseSong() : resumeSong()}>
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={45} 
                color="#fff" 
                style={{marginHorizontal:15}} 
              />
            </TouchableOpacity>

            {isLargeScreen && <TouchableOpacity><Ionicons name="play-skip-forward" size={24} color="#fff" style={{marginHorizontal:15}} /></TouchableOpacity>}
            {isLargeScreen && <TouchableOpacity><Ionicons name="repeat" size={24} color="#ccc" style={{marginHorizontal:15}} /></TouchableOpacity>}
          </View>
        </View>
      )}
    </View>
  );
}

// Bổ sung thêm hiệu ứng viền cho bài hát đang phát
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
  cardImageActive: { borderWidth: 2, borderColor: '#c665e8' }, // Nâng cấp: Viền tím cho bài đang phát
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardArtist: { color: '#888', fontSize: 13, marginTop: 4 },
  miniPlayer: { backgroundColor: '#170f23', height: 90, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#ffffff10', position: 'absolute', bottom: 0, zIndex: 100 },
  miniArt: { width: 50, height: 50, borderRadius: 5 },
  miniTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  miniArtist: { color: '#ccc', fontSize: 12 },
});