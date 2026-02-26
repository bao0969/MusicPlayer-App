import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#192f6a', '#3b5998', '#4c669f']} style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Tạo tài khoản</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên hiển thị"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#ccc"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <TouchableOpacity style={styles.registerButton} onPress={() => router.replace('/home')}>
          <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20 
  },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  inputContainer: { width: '100%' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  registerButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#3b5998', fontWeight: 'bold', fontSize: 18 }
});