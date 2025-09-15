// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // For custom styles and animations

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, check email domain
        if (user.email && user.email.endsWith('@st.hcmuaf.edu.vn')) {
          console.log('User logged in:', user);
          const userDisplayName = user.displayName || user.email.split('@')[0] || 'Người dùng ẩn danh';
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: userDisplayName,
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
          }, { merge: true });
          navigate('/dashboard'); // Redirect to dashboard or home page
        } else {
          // Invalid email domain, sign out and show error
          signOut(auth).then(() => {
            setError('Chỉ chấp nhận Email Sinh Viên do trường cung cấp NLU!');
          }).catch((error) => {
            console.error('Error signing out:', error);
            setError('Đã xảy ra lỗi khi đăng xuất.');
          });
        }
      }
    });

    // Auto-login for test users in development
    if (import.meta.env.VITE_AUTO_LOGIN_TEST_USER === 'true' && import.meta.env.VITE_TEST_USER_EMAIL && import.meta.env.VITE_TEST_USER_PASSWORD) {
      console.log('Attempting auto-login with test user...');
      signInWithEmailAndPassword(auth, import.meta.env.VITE_TEST_USER_EMAIL, import.meta.env.VITE_TEST_USER_PASSWORD)
        .then((userCredential) => {
          // Signed in successfully
          console.log('Auto-login successful:', userCredential.user);
          // The onAuthStateChanged listener above will handle navigation
        })
        .catch((error) => {
          console.error('Auto-login failed:', error.message);
          setError(`Auto-login failed: ${error.message}`);
        });
    }

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener will handle redirection or error
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Đăng nhập bị hủy bởi người dùng.');
      } else {
        console.error('Error during Google login:', err);
        setError('Đã xảy ra lỗi trong quá trình đăng nhập Google.');
      }
    }
  };

  return (
    <div className="login-page-container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="login-card p-5 shadow-lg text-center animate__animated animate__fadeInDown">
        <h2 className="mb-4 text-primary">Chào mừng bạn!</h2>
        <p className="mb-4 text-muted">Vui lòng đăng nhập để tiếp tục.</p>
        <button
          onClick={handleGoogleLogin}
          className="google-login-button btn btn-light border d-flex align-items-center justify-content-center mx-auto animate__animated animate__pulse animate__infinite"
          style={{ gap: '10px' }}
        >
          <img
            src="/google-logo.svg"
            alt="Google logo"
            style={{ width: '20px', height: '20px' }}
          />
          <span className="text-dark">Đăng nhập với Google</span>
        </button>
        {error && <p className="text-danger mt-3 animate__animated animate__shakeX">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
