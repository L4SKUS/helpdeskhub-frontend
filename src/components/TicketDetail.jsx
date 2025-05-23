import React, { useState, useEffect } from 'react';
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
import { getCurrentUser } from '../services/authService';
import { getAgents, getCustomer } from '../services/userService';
import CommentList from './CommentList'; // Import CommentList

const TicketDetail = ({ ticket: initialTicket, onBack, onUpdate, onDelete }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchAgents();
    fetchCustomer();
  }, [ticket]);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      const agentsList = await getAgents();
      setAgents(agentsList);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const fetchCustomer = async () => {
    if (!ticket.customerId) return;
    setLoadingCustomer(true);
    try {
      const customerData = await getCustomer(ticket.customerId);
      setCustomer(customerData);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority
      };

      if (currentUser.role !== 'CUSTOMER') {
        updateData.status = ticket.status;
        updateData.agentId = ticket.agentId ? parseInt(ticket.agentId) : null;
      }

      const updatedTicket = await updateTicket(ticket.id, updateData);
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

  const canEdit = () => {
    return ['CUSTOMER', 'AGENT', 'ADMIN'].includes(currentUser.role);
  };

  const canDelete = () => {
    return ['CUSTOMER', 'AGENT', 'ADMIN'].includes(currentUser.role);
  };

  const getAgentName = (agentId) => {
    if (!agentId) return 'Unassigned';
    const agent = agents.find(a => a.id === agentId);
    return agent ? `${agent.firstName} ${agent.lastName}` : 'Loading agent...';
  };

  const getCustomerName = () => {
    if (!ticket.customerId) return 'Unknown customer';
    if (loadingCustomer) return 'Loading customer...';
    return customer ? `${customer.firstName} ${customer.lastName}` : `Customer ${ticket.customerId}`;
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
              {canEdit() && (
                <Button variant="contained" onClick={() => setIsEditing(true)}>
                  Edit Ticket
                </Button>
              )}
              {canDelete() && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Delete Ticket'}
                </Button>
              )}
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

      {isEditing ? (
        <>
          <TextField
            margin="normal"
            label="Title"
            name="title"
            fullWidth
            value={ticket.title}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={ticket.description}
            onChange={handleChange}
          />

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

          {(currentUser.role === 'AGENT' || currentUser.role === 'ADMIN') && (
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
                <InputLabel>Assign to Agent</InputLabel>
                <Select
                  name="agentId"
                  value={ticket.agentId || ''}
                  onChange={handleChange}
                  label="Assign to Agent"
                  disabled={loadingAgents}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {agents.map(agent => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.firstName} {agent.lastName} ({agent.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>{ticket.title}</Typography>

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
            <Typography variant="subtitle2">Customer: {getCustomerName()}</Typography>
            <Typography variant="subtitle2">
              Agent: {getAgentName(ticket.agentId)}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />
      <CommentList ticketId={ticket.id} />
    </Paper>
  );
};

export default TicketDetail;
