import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // <--- Đổi lại đường dẫn nếu cần

const AVATAR_LIST = [
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=33',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=59'
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HÀM THÔNG BÁO ĐA NỀN TẢNG (WEB + ANDROID + IOS)
  // ==========================================
  const showNotification = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`); 
    } else {
      Alert.alert(title, message); 
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showNotification('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (password !== confirmPassword) {
      showNotification('Lỗi', 'Mật khẩu nhập lại không khớp!');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, AVATAR_LIST[avatarIndex]);
    setLoading(false);

    if (result.success) {
      showNotification('Thành công', 'Tạo tài khoản thành công!');
      router.replace('/home');
    } else {
      showNotification('Lỗi đăng ký', result.error);
    }
  };

  return (
    <LinearGradient colors={['#192f6a', '#3b5998', '#4c669f']} style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{color:'#fff', marginTop: 10}}>Đang tạo tài khoản...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Tạo tài khoản</Text>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setAvatarIndex((prev) => (prev + 1) % AVATAR_LIST.length)}>
          <Image source={{ uri: AVATAR_LIST[avatarIndex] }} style={styles.avatarPreview} />
          <View style={styles.editIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Chạm vào ảnh để đổi</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên hiển thị"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu (từ 6 ký tự)"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, justifyContent: 'center', alignItems: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, zIndex: 10 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatarPreview: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#c665e8', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  avatarHint: { color: '#ccc', fontSize: 12, marginTop: 10 },
  inputContainer: { width: '100%' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', height: 50, borderRadius: 10, paddingHorizontal: 20, fontSize: 16, color: '#fff', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  registerButton: { backgroundColor: '#fff', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#3b5998', fontWeight: 'bold', fontSize: 18 }
});