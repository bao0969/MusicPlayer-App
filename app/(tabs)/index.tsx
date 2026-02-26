import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Import Auth

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginFacebook, loginZalo } = useAuth(); // Lấy hàm từ kho chung
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Hiệu ứng xoay xoay

  // Xử lý đăng nhập thường
  const handleLogin = () => {
    login(email, password);
    router.replace('/home');
  };

  // Xử lý đăng nhập MXH (Chung cho cả FB và Zalo)
  const handleSocialLogin = async (platform) => {
    setLoading(true); // Hiện vòng xoay loading
    
    let success = false;
    if (platform === 'Facebook') {
        success = await loginFacebook();
    } else {
        success = await loginZalo();
    }

    setLoading(false); // Tắt loading

    if (success) {
        Alert.alert('Thành công', `Đã kết nối tài khoản ${platform}!`);
        router.replace('/home');
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      {/* Loading Overlay khi đang đăng nhập */}
      {loading && (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{color:'#fff', marginTop: 10}}>Đang kết nối...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
         <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Ionicons name="musical-notes" size={80} color="#fff" />
        <Text style={styles.logoText}>MusicPlayer</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email hoặc Tên đăng nhập"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
           <View style={styles.dividerLine} />
           <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
           <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
           {/* Nút Facebook */}
           <TouchableOpacity 
             style={[styles.socialButton, {backgroundColor: '#1877F2'}]}
             onPress={() => handleSocialLogin('Facebook')}
           >
             <Ionicons name="logo-facebook" size={24} color="#fff" />
             <Text style={styles.socialText}>Facebook</Text>
           </TouchableOpacity>

           {/* Nút Zalo */}
           <TouchableOpacity 
             style={[styles.socialButton, {backgroundColor: '#0068FF'}]}
             onPress={() => handleSocialLogin('Zalo')}
           >
             <View style={{width: 24, height: 24, borderRadius: 4, backgroundColor: '#fff', alignItems:'center', justifyContent:'center'}}>
                <Text style={{color: '#0068FF', fontWeight:'bold', fontSize: 16}}>Z</Text>
             </View>
             <Text style={styles.socialText}>Zalo</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.signupText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100,
    justifyContent: 'center', alignItems: 'center'
  },
  backButton: {
    position: 'absolute', top: 50, right: 20, 
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center'
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  inputContainer: { width: '100%' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)', height: 50, borderRadius: 25, paddingHorizontal: 20,
    fontSize: 16, color: '#fff', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
  },
  loginButton: {
    backgroundColor: '#1DB954', height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  dividerText: { color: '#ccc', marginHorizontal: 10, fontSize: 14 },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  socialButton: {
    flex: 1, flexDirection: 'row', height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 5
  },
  socialText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { color: '#ccc' },
  signupText: { color: '#1DB954', fontWeight: 'bold' }
});