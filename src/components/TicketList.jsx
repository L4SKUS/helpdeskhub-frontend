import React, { useState, useEffect } from 'react';
import { getTickets, deleteTicket } from '../services/ticketService';
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
  IconButton,
  CircularProgress,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import TicketForm from './TicketForm';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      setTickets(tickets.filter(ticket => ticket.id !== id));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleFormSuccess = (ticket) => {
    setTickets(prevTickets => 
      currentTicket
        ? prevTickets.map(t => t.id === ticket.id ? ticket : t)
        : [ticket, ...prevTickets]
    );
    setFormOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
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

      {tickets.length === 0 ? (
        <Typography sx={{ p: 2 }}>No tickets found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map(ticket => (
                <TableRow key={ticket.id}>
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
                  <TableCell>{new Date(ticket.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setCurrentTicket(ticket);
                        setFormOpen(true);
                      }}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(ticket.id)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
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
