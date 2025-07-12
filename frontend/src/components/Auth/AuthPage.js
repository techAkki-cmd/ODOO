import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box,
  IconButton, InputAdornment, Divider, Alert, CircularProgress
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock, Person,
  Google, GitHub, LinkedIn
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './AuthPage.css';

// API Configuration
const API_BASE_URL = 'http://localhost:8080';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
      const response = await axios.post(endpoint, formData);

      if (isLogin) {
        // Handle successful login
        if (response.data.success) {
          // Store token with consistent key name
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Login successful!');

          // Redirect to landing page
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      } else {
        // Handle successful registration
        if (response.data.success) {
          toast.success('Registration successful! Please check your email for verification.');
          setIsLogin(true);
          // Clear form
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        } else {
          toast.error(response.data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper elevation={24} className="auth-paper">
            <Box className="auth-header">
              <Typography variant="h3" className="auth-title">
                SkillSwap {/* Fixed: Changed from ODOO to SkillSwap */}
              </Typography>
              <Typography variant="h6" className="auth-subtitle">
                {isLogin ? 'Welcome Back' : 'Join Us Today'}
              </Typography>
            </Box>

            <Box className="auth-toggle">
              <Button
                variant={isLogin ? "contained" : "outlined"}
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                }}
                className="toggle-btn"
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "contained" : "outlined"}
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                }}
                className="toggle-btn"
              >
                Sign Up
              </Button>
            </Box>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="auth-form"
              >
                {!isLogin && (
                  <Box className="name-fields">
                    <TextField
                      name="firstName"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person className="input-icon" />
                          </InputAdornment>
                        ),
                      }}
                      className="form-field"
                    />
                    <TextField
                      name="lastName"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person className="input-icon" />
                          </InputAdornment>
                        ),
                      }}
                      className="form-field"
                    />
                  </Box>
                )}

                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="input-icon" />
                      </InputAdornment>
                    ),
                  }}
                  className="form-field"
                />

                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="input-icon" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  className="form-field"
                />

                {!isLogin && (
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock className="input-icon" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <Divider className="divider">
                  <Typography variant="body2" color="textSecondary">
                    or continue with
                  </Typography>
                </Divider>

                <Box className="social-buttons">
                  <IconButton className="social-btn google">
                    <Google />
                  </IconButton>
                  <IconButton className="social-btn github">
                    <GitHub />
                  </IconButton>
                  <IconButton className="social-btn linkedin">
                    <LinkedIn />
                  </IconButton>
                </Box>

                {/* Back to Landing Link */}
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/')}
                    sx={{ textTransform: 'none' }}
                  >
                    ← Back to SkillSwap
                  </Button>
                </Box>
              </motion.form>
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AuthPage;
