import React, { useState, useEffect } from 'react';
import { getTickets, getTicket, deleteTicket, updateTicket } from '../services/ticketService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Box,
  TableSortLabel,
  Alert
} from '@mui/material';
import TicketForm from './TicketForm';
import TicketDetail from './TicketDetail';
import { logout } from '../services/authService';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState(null);
  
  const [orderBy, setOrderBy] = useState('updatedAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
        setError(null);
      } catch (error) {
        console.error('Error loading tickets:', error);
        setError(error.message);
        if (error.message.includes('Session expired')) {
          // Auto-logout if session expired
          setTimeout(() => {
            logout();
            window.location.reload();
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleTitleClick = async (id) => {
    try {
      const ticket = await getTicket(id);
      setSelectedTicket(ticket);
      setError(null);
    } catch (error) {
      console.error('Error loading ticket details:', error);
      setError(error.message);
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await deleteTicket(id);
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      setError(null);
      return true;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError(error.message);
      return false;
    }
  };

  const handleUpdateTicket = async (updatedTicket) => {
    try {
      const result = await updateTicket(updatedTicket.id, {
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        agentId: updatedTicket.agentId ? parseInt(updatedTicket.agentId) : null
      });
      setTickets(prev => prev.map(t => t.id === result.id ? result : t));
      setError(null);
      return result;
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError(error.message);
      throw error;
    }
  };

  const handleFormSuccess = (ticket) => {
    setTickets(prev => [ticket, ...prev]);
    setFormOpen(false);
    setError(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedTickets = React.useMemo(() => {
    return [...tickets].sort((a, b) => {
      if (orderBy === 'status') {
        const statusOrder = { 'OPEN': 1, 'IN_PROGRESS': 2, 'CLOSED': 3 };
        const aValue = statusOrder[a.status];
        const bValue = statusOrder[b.status];
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (orderBy === 'priority') {
        const priorityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
        const aValue = priorityOrder[a.priority];
        const bValue = priorityOrder[b.priority];
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tickets, orderBy, order]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (selectedTicket) {
    return (
      <TicketDetail 
        ticket={selectedTicket} 
        onBack={() => setSelectedTicket(null)}
        onUpdate={handleUpdateTicket}
        onDelete={handleDeleteTicket}
      />
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Tickets</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentTicket(null);
            setFormOpen(true);
          }}
        >
          Create Ticket
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {error.includes('Session expired') && ' Redirecting to login...'}
        </Alert>
      )}

      {tickets.length === 0 ? (
        <Typography sx={{ p: 2 }}>No tickets found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'id' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell sortDirection={orderBy === 'agentId' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'agentId'}
                    direction={orderBy === 'agentId' ? order : 'asc'}
                    onClick={() => handleSort('agentId')}
                  >
                    Assigned To
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'priority' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'priority'}
                    direction={orderBy === 'priority' ? order : 'asc'}
                    onClick={() => handleSort('priority')}
                  >
                    Priority
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'updatedAt' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'updatedAt'}
                    direction={orderBy === 'updatedAt' ? order : 'desc'}
                    onClick={() => handleSort('updatedAt')}
                  >
                    Updated At
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTickets.map(ticket => (
                <TableRow 
                  key={ticket.id} 
                  hover 
                  onClick={() => handleTitleClick(ticket.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.agentId || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.status}
                      color={
                        ticket.status === 'OPEN' ? 'primary' :
                        ticket.status === 'IN_PROGRESS' ? 'warning' :
                        'success'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.priority}
                      color={
                        ticket.priority === 'HIGH' ? 'error' :
                        ticket.priority === 'MEDIUM' ? 'warning' :
                        'success'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TicketForm
        open={formOpen}
        ticket={currentTicket}
        onSuccess={handleFormSuccess}
        onClose={() => {
          setFormOpen(false);
          setCurrentTicket(null);
        }}
      />
    </Paper>
  );
};

export default TicketList;