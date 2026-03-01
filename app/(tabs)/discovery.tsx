import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

// Lấy đồ nghề từ kho
import { useAuth } from '../../context/AuthContext';
import { useMusic } from '../../context/MusicContext';

// Hàm định dạng thời gian
const formatTime = (millis) => {
  if (!millis) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function DiscoveryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768; // Kiểm tra xem đang mở trên Web hay Điện thoại
  
  const { title } = useLocalSearchParams(); 
  const { user } = useAuth();
  const { playlist, playSong, currentSong, isPlaying, pauseSong, resumeSong, duration, position, volume, seekTo, changeVolume } = useMusic();

  const categorySongs = playlist; // Lấy danh sách nhạc

  // === SIDEBAR (Dùng chung giao diện với trang chủ) ===
  const Sidebar = () => (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Ionicons name="musical-notes" size={40} color="#c665e8" />
        <Text style={styles.logoText}>MusicPlayer</Text>
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={() => router.back()}>
        <Ionicons name="home-outline" size={24} color="#fff" />
        <Text style={styles.menuText}>Trang Chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, styles.menuActive]}>
        <Ionicons name="compass-outline" size={24} color="#fff" />
        <Text style={styles.menuText}>Khám Phá</Text>
      </TouchableOpacity>
    </View>
  );

  // === RENDER TỪNG BÀI HÁT TRONG DANH SÁCH ===
  const renderSongRow = (item, index) => {
    const isThisSongPlaying = currentSong?.id === item.id;
    
    return (
      <TouchableOpacity key={item.id} style={[styles.songRow, isThisSongPlaying && styles.songRowActive]} onPress={() => playSong(item)}>
        <View style={styles.songRowLeft}>
          {isThisSongPlaying && isPlaying ? (
            <Ionicons name="bar-chart" size={16} color="#c665e8" style={{marginRight: 15}} />
          ) : (
            <Ionicons name="musical-note" size={16} color="#888" style={{marginRight: 15}} />
          )}
          <Image source={{ uri: item.image }} style={styles.songImage} />
          <View>
            <Text style={[styles.songTitle, isThisSongPlaying && { color: '#c665e8' }]} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
        </View>

        {/* Cột Album chỉ hiện trên màn hình lớn */}
        {isLargeScreen && (
          <View style={styles.songRowMiddle}>
             <Text style={styles.songAlbum} numberOfLines={1}>{title || 'Single'}</Text>
          </View>
        )}

        <View style={styles.songRowRight}>
           <Text style={styles.songDuration}>04:30</Text> 
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.fullScreen}>
      <View style={{ flex: 1, flexDirection: isLargeScreen ? 'row' : 'column' }}>
        
        {/* NẾU LÀ MÀN HÌNH WEB THÌ HIỆN SIDEBAR BÊN TRÁI */}
        {isLargeScreen && <Sidebar />}

        <LinearGradient colors={['#170f23', '#2a1b3d', '#170f23']} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
            
            {/* === HEADER (NÚT BACK VÀ AVATAR) === */}
            <View style={styles.header}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                {/* Giả lập thanh tìm kiếm nhỏ */}
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#ccc" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#aaa' }}>Tìm kiếm bài hát, nghệ sĩ...</Text>
                </View>
              </View>
              
              {user && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
                </View>
              )}
            </View>

            {/* === PHẦN NỘI DUNG CHÍNH (CHIA 2 CỘT NHƯ ZING MP3) === */}
            <View style={[styles.mainContent, isLargeScreen && { flexDirection: 'row' }]}>
              
              {/* CỘT TRÁI: THÔNG TIN ALBUM TO ĐÙNG */}
              <View style={[styles.infoPanel, isLargeScreen && { width: 300, marginRight: 40 }]}>
                 {/* Lấy ảnh của bài đầu tiên làm ảnh bìa Album */}
                 <Image source={{ uri: categorySongs[0]?.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745' }} style={styles.coverImage} />
                 <Text style={styles.playlistTitle}>{title || 'Nhạc Trẻ Sôi Động'}</Text>
                 <Text style={styles.playlistSub}>Cập nhật: 27/01/2026</Text>
                 <Text style={styles.playlistSub}>{categorySongs.length} bài hát • 21K người yêu thích</Text>
                 
                 <TouchableOpacity style={styles.playButton} onPress={() => playSong(categorySongs[0])}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#fff" style={{marginRight: 8}} />
                    <Text style={styles.playButtonText}>{isPlaying ? "TẠM DỪNG" : "PHÁT BẤT KỲ"}</Text>
                 </TouchableOpacity>
              </View>

              {/* CỘT PHẢI: DANH SÁCH BÀI HÁT */}
              <View style={{ flex: 1 }}>
                 <Text style={styles.sectionDesc}><Text style={{color: '#888'}}>Lời tựa: </Text>Những ca khúc cực thấm mà bạn không thể bỏ lỡ.</Text>

                 {/* Tiêu đề các cột (Bài Hát, Album, Thời Gian) */}
                 {isLargeScreen && (
                   <View style={styles.tableHeader}>
                     <Text style={[styles.tableHeaderText, {flex: 1}]}>BÀI HÁT</Text>
                     <Text style={[styles.tableHeaderText, {flex: 1}]}>ALBUM</Text>
                     <Text style={[styles.tableHeaderText, {width: 60, textAlign: 'right'}]}>THỜI GIAN</Text>
                   </View>
                 )}

                 {/* Duyệt qua mảng để in ra danh sách bài hát */}
                 <View style={{marginTop: 10}}>
                   {categorySongs.map((item, index) => renderSongRow(item, index))}
                 </View>
              </View>

            </View>

          </ScrollView>
        </LinearGradient>
      </View>

      {/* === MINI PLAYER (Copy từ home.tsx sang để luôn điều khiển được) === */}
      {currentSong && (
        <View style={[styles.miniPlayer, { width: '100%', flexDirection: 'column', height: isLargeScreen ? 110 : 130 }]}>
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, marginTop: 5 }}>
            <Text style={{ color: '#ccc', fontSize: 12, width: 40 }}>{formatTime(position)}</Text>
            <Slider style={{ flex: 1, height: 20, marginHorizontal: 10 }} minimumValue={0} maximumValue={duration} value={position} minimumTrackTintColor="#c665e8" maximumTrackTintColor="#555" thumbTintColor="#c665e8" onSlidingComplete={seekTo} />
            <Text style={{ color: '#ccc', fontSize: 12, width: 40, textAlign: 'right' }}>{formatTime(duration)}</Text>
          </View>
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
            {isLargeScreen && (
              <View style={{flexDirection: 'row', alignItems: 'center', width: 200, justifyContent: 'flex-end'}}>
                <Ionicons name={volume === 0 ? "volume-mute" : "volume-medium"} size={24} color="#fff" />
                <Slider style={{ width: 100, height: 20, marginLeft: 10 }} minimumValue={0} maximumValue={1} value={volume} minimumTrackTintColor="#fff" maximumTrackTintColor="#555" thumbTintColor="#fff" onValueChange={changeVolume} />
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
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderRadius: 5, marginBottom: 5 },
  menuActive: { backgroundColor: '#ffffff10' },
  menuText: { color: '#fff', fontSize: 16, marginLeft: 15, fontWeight: '500' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingHorizontal: 30, paddingBottom: 20 },
  backButton: { marginRight: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff10', padding: 10, borderRadius: 20, width: 300 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  
  mainContent: { paddingHorizontal: 30, paddingTop: 20 },
  
  infoPanel: { alignItems: 'center', marginBottom: 30 },
  coverImage: { width: 250, height: 250, borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15 },
  playlistTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  playlistSub: { color: '#888', fontSize: 13, marginBottom: 4, textAlign: 'center' },
  playButton: { flexDirection: 'row', backgroundColor: '#c665e8', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginTop: 20, alignItems: 'center' },
  playButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  
  sectionDesc: { color: '#fff', fontSize: 14, marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ffffff10', paddingBottom: 10, marginBottom: 10, paddingHorizontal: 10 },
  tableHeaderText: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  
  songRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#ffffff05' },
  songRowActive: { backgroundColor: '#ffffff10' },
  songRowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  songImage: { width: 45, height: 45, borderRadius: 6, marginRight: 15 },
  songTitle: { color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 4 },
  songArtist: { color: '#888', fontSize: 12 },
  songRowMiddle: { flex: 1 },
  songAlbum: { color: '#888', fontSize: 13 },
  songRowRight: { width: 60, alignItems: 'flex-end' },
  songDuration: { color: '#888', fontSize: 13 },

  miniPlayer: { backgroundColor: '#170f23', borderTopWidth: 1, borderTopColor: '#ffffff10', position: 'absolute', bottom: 0, zIndex: 100 },
  miniArt: { width: 50, height: 50, borderRadius: 5 },
  miniTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, width: 150 },
  miniArtist: { color: '#ccc', fontSize: 12, width: 150 },
});