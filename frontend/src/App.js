import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './components/Auth/AuthPage';
import EmailVerification from './components/Auth/EmailVerification';
import Landing from './pages/Landing';
import SkillSwap from './pages/SkillSwap';
import Request from './pages/Request';
import Profile from './pages/Profile';
import SwapRequests from './pages/SwapRequest';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
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
            <Route path="/skillswap" element={<SkillSwap />} />
            <Route path="/request" element={<Request />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/swaprequests" element={<SwapRequests />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
