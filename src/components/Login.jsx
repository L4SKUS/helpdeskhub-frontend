import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CssBaseline,
  Divider,
  InputAdornment,
  Stack
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  AccountCircle as UserIcon,
  Login as LoginIcon
} from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(45deg, #2c3e50 0%, #4a6491 100%)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            px: 2,
            width: '100%',
            maxWidth: 450
          }}
        >
          <Paper 
            elevation={6} 
            sx={{ 
              p: 4,
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <UserIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #2c3e50 30%, #4a6491 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                HelpDeskHub
              </Typography>
              <Typography 
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Sign in to your account
              </Typography>
            </Box>
            
            <Divider sx={{ width: '100%', mb: 3 }} />
            
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button 
                  size="small" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Forgot password?
                </Button>
              </Stack>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  mt: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    background: 'linear-gradient(45deg, #2c3e50 30%, #4a6491 90%)'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 3, textAlign: 'center' }}
          >
            © {new Date().getFullYear()} HelpDeskHub - All rights reserved
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Login;
