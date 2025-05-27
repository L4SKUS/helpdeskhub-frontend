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
  CircularProgress,
  Stack
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Cancel,
  Save,
  Person,
  AssignmentInd,
  LowPriority,
  PriorityHigh,
  Event,
  Update,
  CheckCircle,
  HourglassEmpty,
  LockOpen
} from '@mui/icons-material';
import { updateTicket } from '../services/ticketService';
import { getCurrentUser } from '../services/authService';
import { getAgents, getUser } from '../services/userService';
import CommentList from './CommentList';

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
      const customerData = await getUser(ticket.customerId);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const canEdit = () => ['CUSTOMER', 'AGENT', 'ADMIN'].includes(currentUser.role);
  const canDelete = () => ['CUSTOMER', 'AGENT', 'ADMIN'].includes(currentUser.role);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <LockOpen fontSize="small" />;
      case 'IN_PROGRESS': return <HourglassEmpty fontSize="small" />;
      case 'CLOSED': return <CheckCircle fontSize="small" />;
      default: return null;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH': return <PriorityHigh fontSize="small" />;
      case 'MEDIUM': return <LowPriority fontSize="small" />;
      case 'LOW': return <LowPriority fontSize="small" />;
      default: return null;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'OPEN': return 'Ticket is open and awaiting assignment';
      case 'IN_PROGRESS': return 'Ticket is being worked on';
      case 'CLOSED': return 'Ticket has been resolved';
      default: return '';
    }
  };

  const getPriorityDescription = (priority) => {
    switch (priority) {
      case 'HIGH': return 'Critical issue - needs immediate attention';
      case 'MEDIUM': return 'Important issue - address soon';
      case 'LOW': return 'Minor issue - can wait';
      default: return '';
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
      <Paper elevation={3} sx={{ flex: 1, p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={onBack}
            sx={{ textTransform: 'none' }}
          >
            Back to tickets
          </Button>
          <Box display="flex" gap={1}>
            {!isEditing ? (
              <>
                {canEdit() && (
                  <Button 
                    variant="outlined" 
                    startIcon={<Edit />} 
                    onClick={() => setIsEditing(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                )}
                {canDelete() && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<Delete />} 
                    onClick={handleDelete} 
                    disabled={loading}
                    sx={{textTransform: 'none'}}
                  >
                    {loading ? <CircularProgress size={20} thickness={5} /> : 'Delete'}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  startIcon={<Cancel />} 
                  onClick={() => setIsEditing(false)} 
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Save />} 
                  onClick={handleSave} 
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth 
              name="title" 
              label="Title" 
              value={ticket.title} 
              onChange={handleChange} 
              size="small"
            />
            <TextField
              fullWidth
              multiline
              rows={6}
              name="description"
              label="Description"
              value={ticket.description}
              onChange={handleChange}
              placeholder="You can use bullet points, new lines, etc."
              size="small"
            />
            <FormControl fullWidth size="small">
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
                <FormControl fullWidth size="small">
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

                <FormControl fullWidth size="small">
                  <InputLabel>Assign to Agent</InputLabel>
                  <Select
                    name="agentId"
                    value={ticket.agentId || ''}
                    onChange={handleChange}
                    label="Assign to Agent"
                    disabled={loadingAgents}
                  >
                    <MenuItem value=""><em>Unassigned</em></MenuItem>
                    {agents.map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.firstName} {agent.lastName} ({agent.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 400 }}>
              {ticket.title}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip 
                icon={getStatusIcon(ticket.status)}
                label={ticket.status.replace('_', ' ')} 
                color={
                  ticket.status === 'OPEN' ? 'primary' :
                  ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'
                } 
                variant="outlined"
                title={getStatusDescription(ticket.status)}
              />
              <Chip 
                icon={getPriorityIcon(ticket.priority)}
                label={ticket.priority} 
                color={
                  ticket.priority === 'HIGH' ? 'error' :
                  ticket.priority === 'MEDIUM' ? 'warning' : 'success'
                }
                variant="outlined"
                title={getPriorityDescription(ticket.priority)}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {ticket.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                <Event fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Created: {formatDate(ticket.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Update fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Updated: {formatDate(ticket.updatedAt)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {getCustomerName()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <AssignmentInd fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {getAgentName(ticket.agentId)}
              </Typography>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Comments Sidebar */}
      <Paper elevation={3} sx={{ width: 400, p: 3, borderRadius: 2, height: 'fit-content' }}>
        <CommentList ticketId={ticket.id} />
      </Paper>
    </Box>
  );
};

export default TicketDetail;