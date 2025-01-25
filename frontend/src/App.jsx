import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Setting from './components/Setting';
import Profile from './components/Profile';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("online_users",onlineUsers);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin text-white' />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={ authUser ?  <Home /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={ !authUser ? <Signup /> : <Navigate to={"/"} />} />
        <Route path="/login" element={ !authUser ? <Login /> : <Navigate to={"/"} /> } />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={ authUser ? <Profile /> : <Navigate to={"/login"} /> } />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
