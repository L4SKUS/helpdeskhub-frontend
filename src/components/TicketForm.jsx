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
  MenuItem
} from '@mui/material';
import { createTicket, updateTicket } from '../services/ticketService';
import { getCurrentUser } from '../services/authService';

const TicketForm = ({ open, ticket, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM'
      });
    }
    setErrors({});
  }, [ticket]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'OPEN' // Always set to OPEN for new tickets
      };

      // For new tickets, add the current user's ID as customerId
      if (!ticket) {
        payload.customerId = currentUser.id;
      }

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