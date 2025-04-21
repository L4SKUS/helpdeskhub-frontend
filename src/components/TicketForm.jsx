import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { createTicket, updateTicket } from '../services/ticketService';

const TicketForm = ({ open, ticket, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    customerId: '',
    agentId: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        customerId: ticket.customerId?.toString() || '',
        agentId: ticket.agentId?.toString() || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'OPEN',
        priority: 'MEDIUM',
        customerId: '',
        agentId: ''
      });
    }
    setErrors({});
  }, [ticket]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!ticket && !formData.customerId) newErrors.customerId = 'Customer ID is required';
    if (!ticket && isNaN(formData.customerId)) newErrors.customerId = 'Must be a number';
    if (formData.agentId && isNaN(formData.agentId)) newErrors.agentId = 'Must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = ticket ? {
        status: formData.status,
        priority: formData.priority,
        agentId: formData.agentId ? parseInt(formData.agentId) : null
      } : {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        customerId: parseInt(formData.customerId),
        agentId: formData.agentId ? parseInt(formData.agentId) : null
      };

      const result = ticket ? 
        await updateTicket(ticket.id, payload) :
        await createTicket(payload);

      onSuccess(result);
    } catch (error) {
      console.error('Error saving ticket:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{ticket ? 'Update Ticket' : 'Create New Ticket'}</DialogTitle>
      <DialogContent>
        {!ticket && (
          <>
            <TextField
              margin="normal"
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              disabled={submitting}
            />
            <TextField
              margin="normal"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={submitting}
            />
            <TextField
              margin="normal"
              label="Customer ID"
              name="customerId"
              fullWidth
              type="number"
              value={formData.customerId}
              onChange={handleChange}
              error={!!errors.customerId}
              helperText={errors.customerId}
              disabled={submitting}
              inputProps={{ min: 1 }}
            />
          </>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            label="Priority"
            disabled={submitting}
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
            disabled={submitting}
          >
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          label="Agent ID (optional)"
          name="agentId"
          fullWidth
          type="number"
          value={formData.agentId}
          onChange={handleChange}
          error={!!errors.agentId}
          helperText={errors.agentId}
          disabled={submitting}
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={submitting}
        >
          {submitting ? 'Saving...' : (ticket ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketForm;