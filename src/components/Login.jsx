import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CssBaseline
} from '@mui/material';

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
          minHeight: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          bgcolor: '#121212',
          p: 2,
          boxSizing: 'border-box'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            width: '100%',
            maxWidth: 400,
            bgcolor: '#1e1e1e',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: 'white', 
              mb: 3,
              textAlign: 'center',
              width: '100%'
            }}
          >
            Login to HelpDeskHub
          </Typography>
          
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ 
                style: { 
                  color: '#aaa',
                  transformOrigin: 'center',
                  '&.Mui-focused': {
                    transformOrigin: 'center'
                  }
                } 
              }}
              InputProps={{ 
                style: { color: 'white' },
                notched: false
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
              sx={{ mb: 3 }}
              InputLabelProps={{ 
                style: { 
                  color: '#aaa',
                  transformOrigin: 'center'
                } 
              }}
              InputProps={{ 
                style: { color: 'white' },
                notched: false
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                maxWidth: 400
              }}
            >
              LOGIN
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;