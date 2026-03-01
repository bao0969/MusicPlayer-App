import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

// --- IMPORT FIREBASE ---
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebaseConfig'; // Đã dọn dẹp dấu chấm phẩy dư thừa ở đây

// Cấu hình ID App Facebook
const FB_APP_ID = "884335144349241"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- PHẦN KHỞI TẠO (KẾT HỢP FB VÀ FIREBASE) ---
  useEffect(() => {
    // 1. KHỞI TẠO FACEBOOK SDK
    if (Platform.OS === 'web') {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId      : FB_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v18.0'
        });
      };
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    } else {
      try {
        const { Settings } = require('react-native-fbsdk-next');
        Settings.initializeSDK();
      } catch (e) {}
    }

    // 2. LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP CỦA FIREBASE (ĐÃ FIX LỖI KHÔNG HIỆN TÊN)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // QUAN TRỌNG: Tải lại dữ liệu mới nhất từ server phòng trường hợp vừa đăng ký xong
        await currentUser.reload(); 

        setUser({
          uid: currentUser.uid,
          // Ưu tiên lấy từ auth.currentUser để có dữ liệu Tên mới nhất vừa update
          name: auth.currentUser.displayName || currentUser.displayName || 'Thành viên mới',
          email: currentUser.email,
          avatar: auth.currentUser.photoURL || currentUser.photoURL || 'https://i.pravatar.cc/150?img=12',
          type: 'firebase'
        });
      } else {
        setUser(null);
      }
      setLoading(false); // Hoàn tất kiểm tra
    });

    return () => unsubscribe();
  }, []);

  // --- HÀM ĐĂNG KÝ EMAIL (FIREBASE) ---
  const register = async (name, email, password, avatarUrl) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Chờ cập nhật tên và avatar lên Firebase xong xuôi
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: avatarUrl
      });
      
      // Ép cập nhật lại State nội bộ của app bằng Tên bạn vừa nhập
      setUser({ 
        uid: userCredential.user.uid, 
        name: name, 
        email: email, 
        avatar: avatarUrl, 
        type: 'firebase' 
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // --- HÀM ĐĂNG NHẬP EMAIL (FIREBASE) ---
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // --- HÀM ĐĂNG NHẬP FACEBOOK (GIỮ NGUYÊN) ---
  const loginFacebook = async () => {
    if (Platform.OS === 'web') {
        return new Promise((resolve) => {
            if (!window.FB) {
                Alert.alert("Lỗi", "Chưa tải xong Facebook SDK, vui lòng đợi 1 chút rồi bấm lại!");
                return resolve(false);
            }
            window.FB.login(function(response) {
                if (response.authResponse) {
                    window.FB.api('/me', {fields: 'name, picture, email'}, function(profile) {
                        setUser({
                            name: profile.name,
                            avatar: profile.picture.data.url,
                            type: 'facebook',
                            id: profile.id
                        });
                        resolve(true);
                    });
                } else {
                    console.log('User huỷ đăng nhập');
                    resolve(false);
                }
            }, {scope: 'public_profile,email'});
        });
    }

    try {
      const { LoginManager, AccessToken, Profile } = require('react-native-fbsdk-next');
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) return false;

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) return false;

      const currentProfile = await Profile.getCurrentProfile();
      if (currentProfile) {
        setUser({
          name: currentProfile.name,
          avatar: currentProfile.imageURL,
          type: 'facebook',
          id: currentProfile.userID
        });
        return true;
      }
    } catch (error) {
      console.log('Lỗi Native:', error);
      Alert.alert('Lỗi', 'Cần chạy trên máy thật để test tính năng này');
      return false;
    }
  };

  // --- HÀM ĐĂNG NHẬP ZALO (GIỮ NGUYÊN) ---
  const loginZalo = async () => { 
      return new Promise((resolve) => {
        setTimeout(() => {
          setUser({ name: 'Bảo Zalo', avatar: 'https://s120-ava-talk.zadn.vn/c/5/f/0/1/120/12345.jpg', type: 'zalo' });
          resolve(true);
        }, 1000);
      });
  };

  // --- HÀM ĐĂNG XUẤT ---
  const logout = async () => {
    if (Platform.OS === 'web' && window.FB) {
        window.FB.logout();
    } else {
        try { require('react-native-fbsdk-next').LoginManager.logOut(); } catch(e){}
    }
    
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Lỗi đăng xuất Firebase:", error);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, loginFacebook, loginZalo, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);