import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import TicketList from './TicketList';

const Dashboard = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',  // Use minHeight instead of height to allow content to expand
      bgcolor: '#121212',
      width: '100vw',      // Ensure full viewport width
      margin: 0,           // Remove default margins
      padding: 0           // Remove default padding
    }}>
      {/* NavBar */}
      <AppBar position="static" sx={{ flexShrink: 0 }}>  {/* Prevent navbar from shrinking */}
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HelpDeskHub
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,  // Take up remaining space
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',  // Align to top instead of center
          p: 2,
          overflow: 'auto',
          width: '100%',
          boxSizing: 'border-box'  // Include padding in width calculation
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1000,
          marginTop: 0
        }}>
          <TicketList />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;