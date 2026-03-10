import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

import Home from './Home';
import Card_holder from './Card_holder';
import Grading_standard from './Grading_standard';
import Service_fee from './Service_fee';
import Term_of_use from './Term_of_use';
import Contact_us from './Contact_us';

import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');

  // 檢查 localStorage 中的登入狀態
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setIsAdminLoggedIn(true);
      setAdminUsername(auth.username);
    }
  }, []);

  const handleLogin = (username) => {
    setIsAdminLoggedIn(true);
    setAdminUsername(username);
    localStorage.setItem('adminAuth', JSON.stringify({ username }));
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    localStorage.removeItem('adminAuth');
    window.location.href = '/card_admin';
  };

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/card_admin"
              element={
                isAdminLoggedIn ? (
                  <AdminDashboard username={adminUsername} onLogout={handleLogout} />
                ) : (
                  <AdminLogin onLogin={handleLogin} />
                )
              }
            />
            <Route path="/grading_standard" element={<Grading_standard />} />
            <Route path="/card_holder" element={<Card_holder />} />
            <Route path="/service_fee" element={<Service_fee />} />
            <Route path="/term_of_use" element={<Term_of_use />} />
            <Route path="/contact_us" element={<Contact_us />} />
          </Routes>

        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
