import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import { CheckCircle, Error, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); // Prevent duplicate calls

  useEffect(() => {
    if (token && !hasVerified.current) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    if (hasVerified.current) return; // Prevent duplicate calls
    hasVerified.current = true;

    try {
      const response = await axios.get(`http://localhost:8080/api/auth/verify-email/${token}`);
      setVerificationStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setVerificationStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  // Rest of your component remains the same
  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <Box textAlign="center">
            <CircularProgress size={60} color="primary" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        );
      case 'success':
        return (
          <Box textAlign="center">
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" color="success.main" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/auth')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        );
      case 'error':
        return (
          <Box textAlign="center">
            <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" color="error.main" gutterBottom>
              Verification Failed
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/auth')}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={10} sx={{ p: 4, textAlign: 'center' }}>
          <Email sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Email Verification
          </Typography>
          {renderContent()}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default EmailVerification;
