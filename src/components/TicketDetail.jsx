import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { updateTicket } from '../services/ticketService';

const TicketDetail = ({ ticket: initialTicket, onBack, onUpdate, onDelete }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedTicket = await updateTicket(ticket.id, {
        status: ticket.status,
        priority: ticket.priority,
        agentId: ticket.agentId ? parseInt(ticket.agentId) : null
      });
      setTicket(updatedTicket);
      onUpdate(updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(ticket.id);
      onBack();
    } catch (error) {
      console.error('Error deleting ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="outlined" onClick={onBack}>
          Back to Tickets
        </Button>
        <Box display="flex" gap={1}>
          {!isEditing ? (
            <>
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Ticket
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Delete Ticket'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </>
          )}
        </Box>
      </Box>
      
      <Typography variant="h4" gutterBottom>{ticket.title}</Typography>
      
      {isEditing ? (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={ticket.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={ticket.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            label="Agent ID"
            name="agentId"
            fullWidth
            type="number"
            value={ticket.agentId || ''}
            onChange={handleChange}
            inputProps={{ min: 1 }}
          />
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip 
              label={ticket.status}
              color={
                ticket.status === 'OPEN' ? 'primary' :
                ticket.status === 'IN_PROGRESS' ? 'warning' :
                'success'
              }
            />
            <Chip 
              label={ticket.priority}
              color={
                ticket.priority === 'HIGH' ? 'error' :
                ticket.priority === 'MEDIUM' ? 'warning' :
                'success'
              }
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            {ticket.description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">
              Created: {formatDate(ticket.createdAt)}
            </Typography>
            <Typography variant="caption">
              Last updated: {formatDate(ticket.updatedAt)}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Customer ID: {ticket.customerId}</Typography>
            <Typography variant="subtitle2">
              Agent: {ticket.agentId ? ticket.agentId : 'Unassigned'}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default TicketDetail;