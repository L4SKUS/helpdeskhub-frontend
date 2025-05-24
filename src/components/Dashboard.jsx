import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import TicketList from './TicketList';
import UserManagement from './UserManagement';
import Login from './Login';
import { login, logout, isAuthenticated, getCurrentUser } from '../services/authService';

const Dashboard = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('tickets');

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsAuthenticatedState(authStatus);
      if (authStatus) {
        setUser(getCurrentUser());
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      setIsAuthenticatedState(true);
      setUser(getCurrentUser());
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticatedState(false);
    setUser(null);
  };

  if (!isAuthenticatedState) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#121212',
      width: '100vw',
      margin: 0,
      padding: 0
    }}>
      <AppBar position="static" sx={{ flexShrink: 0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HelpDeskHub
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2, color: 'white' }}>
            {user?.email}
          </Typography>
          {user?.role === 'ADMIN' && (
            <Button color="inherit" onClick={() => setView(view === 'users' ? 'tickets' : 'users')}>
              {view === 'users' ? 'View Tickets' : 'Manage Users'}
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 2,
          overflow: 'auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{
          width: '100%',
          maxWidth: 1400,
          marginTop: 0
        }}>
          {view === 'tickets' && <TicketList />}
          {view === 'users' && user?.role === 'ADMIN' && <UserManagement />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;