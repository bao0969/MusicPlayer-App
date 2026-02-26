import { Stack } from 'expo-router';
import { AuthProvider } from '../../context/AuthContext';
import { MusicProvider } from '../../context/MusicContext';

export default function Layout() {
  return (
    <AuthProvider>
      <MusicProvider>  {/* <--- 2. Bọc MusicProvider vào đây */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
        </Stack>
      </MusicProvider>
    </AuthProvider>
  );
}