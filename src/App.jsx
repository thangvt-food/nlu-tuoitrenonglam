// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import AdminPage from './components/AdminPage';
import CertificatePage from './components/CertificatePage'; // Import CertificatePage
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '24px',
        color: '#333'
      }}>
        Đang tải...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/quiz"
          element={user ? <QuizPage /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={user ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route
          path="/certificate"
          element={user ? <CertificatePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;