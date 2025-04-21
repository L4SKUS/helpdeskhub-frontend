import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TicketList from './components/TicketList';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <TicketList />
      </div>
    </ThemeProvider>
  );
}

export default App;