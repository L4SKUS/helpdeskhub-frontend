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
import { getEmployees, getUser } from '../services/userService';
import { notifyStatusChanged, notifyEmployeeAssigned } from '../services/notificationService';
import CommentList from './CommentList';

const TicketDetail = ({ ticket: initialTicket, onBack, onUpdate, onDelete }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [client, setClient] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchEmployees();
    fetchClient();
  }, [ticket]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const employeesList = await getEmployees();
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchClient = async () => {
    if (!ticket.clientId) return;
    setLoadingClient(true);
    try {
      const clientData = await getUser(ticket.clientId);
      setClient(clientData);
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoadingClient(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  setLoading(true);
  try {
    const previousStatus = initialTicket.status;
    const previousEmployeeId = initialTicket.employeeId;

    const updateData = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority
    };

    if (currentUser.role !== 'CLIENT') {
      updateData.status = ticket.status;
      updateData.employeeId = ticket.employeeId === '' ? null : parseInt(ticket.employeeId);
    }

    const updatedTicket = await updateTicket(ticket.id, updateData);

    if (updateData.status && updateData.status !== previousStatus) {
      notifyStatusChanged({
        recipient: client?.email,
        ticketId: updatedTicket.id,
        ticketTitle: updatedTicket.title,
        status: updatedTicket.status
      }).catch(console.error);
    }

    if (updateData.employeeId && updateData.employeeId !== previousEmployeeId) {
      notifyEmployeeAssigned({
        recipient: client?.email,
        ticketId: updatedTicket.id,
        ticketTitle: updatedTicket.title,
        employeeName: getEmployeeName(updatedTicket.employeeId)
      }).catch(console.error);
    }

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

  const canEdit = () => ['CLIENT', 'EMPLOYEE', 'ADMIN'].includes(currentUser.role);
  const canDelete = () => ['CLIENT', 'EMPLOYEE', 'ADMIN'].includes(currentUser.role);

  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Unassigned';
    const employee = employees.find(a => a.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Loading employee...';
  };

  const getClientName = () => {
    if (!ticket.clientId) return 'Unknown client';
    if (loadingClient) return 'Loading client...';
    return client ? `${client.firstName} ${client.lastName}` : `Client ${ticket.clientId}`;
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

            {(currentUser.role === 'EMPLOYEE' || currentUser.role === 'ADMIN') && (
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
                  <InputLabel>Assign to employee</InputLabel>
                  <Select
                    name="employeeId"
                    value={ticket.employeeId || ''}
                    onChange={handleChange}
                    label="Assign to employee"
                    disabled={loadingEmployees}
                  >
                    <MenuItem value=""><em>Unassigned</em></MenuItem>
                    {employees.map(employee => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} ({employee.email})
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
                {getClientName()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <AssignmentInd fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {getEmployeeName(ticket.employeeId)}
              </Typography>
            </Stack>
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ width: 400, p: 3, borderRadius: 2, height: 'fit-content' }}>
        <CommentList ticketId={ticket.id} />
      </Paper>
    </Box>
  );
};

export default TicketDetail;
