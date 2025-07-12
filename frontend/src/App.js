import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './components/Auth/AuthPage';
import EmailVerification from './components/Auth/EmailVerification';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import SkillSwap from './pages/SkillSwap'; // ✅ Import SkillSwap
import Request from './pages/Request';     // ✅ Import Request
import Home from './pages/Home';
import SwapRequests from './pages/SwapRequest';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            <Route path="/" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skillswap" element={<SkillSwap />} /> {/* ✅ SkillSwap route */}
            <Route path="/request" element={<Request />} />     {/* ✅ Request route */}
            <Route path="/home" element={<Home />} />
            <Route path="/swaprequests" element={<SwapRequests />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
