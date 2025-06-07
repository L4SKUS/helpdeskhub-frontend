import React, { useState, useEffect, useMemo } from 'react';
import {
  getTickets,
  getTicketById,
  deleteTicket,
  updateTicket,
  getTicketsByClient
} from '../services/ticketService';
import { getEmployees } from '../services/userService';
import { getCurrentUser, logout } from '../services/authService';
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
  Alert,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import {
  Refresh,
  Add,
  AssignmentInd,
  LowPriority,
  PriorityHigh,
  CheckCircle,
  HourglassEmpty,
  LockOpen,
  Update
} from '@mui/icons-material';
import TicketForm from './TicketForm';
import TicketDetail from './TicketDetail';
import Sidebar from './Sidebar';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('updatedAt');
  const [order, setOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    employeeId: '',
    archive: false,
    showUnassignedOnly: false
  });
  const [needsRefresh, setNeedsRefresh] = useState(true);

  const currentUser = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    if (!needsRefresh) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let ticketsData;
        const employeesData = await getEmployees();

        if (currentUser.role === 'CLIENT') {
          ticketsData = await getTicketsByClient(currentUser.id);
        } else {
          ticketsData = await getTickets();
        }

        setTickets(ticketsData);
        setEmployees(employeesData);
        setError(null);
        setNeedsRefresh(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message);
        if (error.message.includes('Session expired')) {
          setTimeout(() => {
            logout();
            window.location.reload();
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, needsRefresh]);

  const handleRefresh = () => {
    setNeedsRefresh(true);
  };

  const handleTitleClick = async (id) => {
    try {
      const ticket = await getTicketById(id);
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
        employeeId: updatedTicket.employeeId ? parseInt(updatedTicket.employeeId) : null
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
      case 'MEDIUM':
      case 'LOW': return <LowPriority fontSize="small" />;
      default: return null;
    }
  };

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = [...tickets];

    if (filters.archive) {
      filtered = filtered.filter(ticket => ticket.status === 'CLOSED');
    } else {
      filtered = filtered.filter(
        ticket => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
      );
    }

    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    if (filters.employeeId !== '') {
      filtered = filtered.filter(ticket =>
        filters.employeeId === null
          ? ticket.employeeId === null
          : ticket.employeeId === parseInt(filters.employeeId)
      );
    }

    if (filters.showUnassignedOnly) {
      filtered = filtered.filter(ticket => ticket.employeeId === null);
    }

    return filtered.sort((a, b) => {
      if (orderBy === 'status') {
        const statusOrder = { 'OPEN': 1, 'IN_PROGRESS': 2, 'CLOSED': 3 };
        return order === 'asc'
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }

      if (orderBy === 'priority') {
        const priorityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
        return order === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tickets, filters, orderBy, order]);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(a => a.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unassigned';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
    <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
      <Sidebar filters={filters} setFilters={setFilters} employees={employees} />

      <Paper elevation={3} sx={{ p: 3, flex: 1, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            Tickets
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={handleRefresh}
              title="Refresh"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setCurrentTicket(null);
                setFormOpen(true);
              }}
              sx={{ textTransform: 'none' }}
            >
              Create Ticket
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            {error.includes('Session expired') && ' Redirecting to login...'}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {filteredAndSortedTickets.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <Typography color="text.secondary">No tickets found matching your criteria</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
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
                  <TableCell>Title</TableCell>
                  <TableCell sortDirection={orderBy === 'employeeId' ? order : false} sx={{ width: 120 }}>
                    <TableSortLabel
                      active={orderBy === 'employeeId'}
                      direction={orderBy === 'employeeId' ? order : 'asc'}
                      onClick={() => handleSort('employeeId')}
                    >
                      Assigned to
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
                  <TableCell sortDirection={orderBy === 'updatedAt' ? order : false} sx={{ width: 200 }}>
                    <TableSortLabel
                      active={orderBy === 'updatedAt'}
                      direction={orderBy === 'updatedAt' ? order : 'desc'}
                      onClick={() => handleSort('updatedAt')}
                    >
                      Last updated
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedTickets.map(ticket => (
                  <TableRow
                    key={ticket.id}
                    hover
                    onClick={() => handleTitleClick(ticket.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{ticket.title}</TableCell>
                    <TableCell sx={{ width: 100 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AssignmentInd fontSize="small" color="action" />
                        <span>{getEmployeeName(ticket.employeeId)}</span>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(ticket.status)}
                        label={ticket.status.replace('_', ' ')}
                        color={
                          ticket.status === 'OPEN'
                            ? 'primary'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getPriorityIcon(ticket.priority)}
                        label={ticket.priority}
                        color={
                          ticket.priority === 'HIGH'
                            ? 'error'
                            : ticket.priority === 'MEDIUM'
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ width: 200 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Update fontSize="small" color="action" />
                        <span>
                          {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider sx={{ mb: 2 }} />
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
    </Box>
  );
};

export default TicketList;
