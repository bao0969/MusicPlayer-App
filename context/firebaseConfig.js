// file: firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Dán đoạn config bạn copy ở Bước 1 vào đây
const firebaseConfig = {
  apiKey: "AIzaSyB75c99pa0HWAuC64lZzQ4gVaZtsTAOdsg",
  authDomain: "musicplayer-52efd.firebaseapp.com",
  projectId: "musicplayer-52efd",
  storageBucket: "musicplayer-52efd.firebasestorage.app",
  messagingSenderId: "434241418945",
  appId: "1:434241418945:web:4b4158e250095b36f70640",
  measurementId: "G-Z61ZNH6B19"
};
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy cục Auth ra để dùng cho việc đăng nhập/đăng ký
export const auth = getAuth(app);