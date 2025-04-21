import React, { useState, useEffect } from 'react';
import { getTickets, deleteTicket } from '../services/ticketService';
import {
  List,
  ListItem,
  ListItemText,
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

      <List>
        {tickets.length === 0 ? (
          <Typography sx={{ p: 2 }}>No tickets found</Typography>
        ) : (
          tickets.map(ticket => (
            <ListItem 
              key={ticket.id} 
              divider
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setCurrentTicket(ticket);
                      setFormOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(ticket.id)}
                  >
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={ticket.title}
                secondary={
                  <>
                    <Box component="span" display="block">
                      Status: <Chip 
                        label={ticket.status} 
                        size="small"
                        color={
                          ticket.status === 'OPEN' ? 'primary' :
                          ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'
                        }
                      />
                    </Box>
                    <Box component="span" display="block">
                      Priority: <Chip 
                        label={ticket.priority} 
                        size="small"
                        color={
                          ticket.priority === 'HIGH' ? 'error' :
                          ticket.priority === 'MEDIUM' ? 'warning' : 'success'
                        }
                      />
                    </Box>
                    <Box component="span" display="block">
                      Customer ID: {ticket.customerId} | 
                      Agent ID: {ticket.agentId || 'Unassigned'}
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))
        )}
      </List>

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