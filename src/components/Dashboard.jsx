import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

import TicketList from './TicketList';
import UserManagement from './UserManagement';
import ChangePassword from './ChangePassword';
import Login from './Login';
import { login, logout, isAuthenticated, getCurrentUser } from '../services/authService';

const Dashboard = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('tickets');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
    handleMenuClose();
    logout();
    setIsAuthenticatedState(false);
    setUser(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    handleMenuClose();
  };

  if (!isAuthenticatedState) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default',
      width: '100vw',
    }}>
      <AppBar
        position="static"
        sx={{
          flexShrink: 0,
          background: 'linear-gradient(45deg, #2c3e50 0%, #4a6491 100%)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          {view === 'changePassword' && (
            <IconButton
              color="inherit"
              onClick={() => setView('tickets')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <DashboardIcon /> HelpDeskHub
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user?.role === 'ADMIN' && (
              <IconButton
                color="inherit"
                onClick={() => setView(view === 'users' ? 'tickets' : 'users')}
                sx={{
                  borderRadius: 1,
                  bgcolor: view === 'users' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                <PeopleIcon />
              </IconButton>
            )}

            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main'
                }}
              >
                {user?.email.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2">{user?.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            {user?.role === 'ADMIN' && (
              <MenuItem onClick={() => handleViewChange(view === 'users' ? 'tickets' : 'users')}>
                <PeopleIcon sx={{ mr: 1 }} />
                {view === 'users' ? 'View Tickets' : 'Manage Users'}
              </MenuItem>
            )}
            <MenuItem onClick={() => handleViewChange('changePassword')}>
              <AccountIcon sx={{ mr: 1 }} />
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 3,
          overflow: 'auto',
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: 'background.default'
        }}
      >
        <Box sx={{
          width: '100%',
          maxWidth: 1400,
        }}>
          {view === 'tickets' && <TicketList />}
          {view === 'users' && user?.role === 'ADMIN' && <UserManagement />}
          {view === 'changePassword' && <ChangePassword />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
