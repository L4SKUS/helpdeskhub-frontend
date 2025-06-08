import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Button, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Alert, Dialog, DialogActions,
  DialogTitle, Stack, Divider, Chip, IconButton, FormControl, InputLabel,
  Select, MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Person,
  AdminPanelSettings,
  Engineering,
  PersonOutline
} from '@mui/icons-material';
import {
  getAllUsers, createUser, updateUser, deleteUser
} from '../services/userService';
import UserForm from './UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filters, setFilters] = useState({
    role: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }

    result.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setFilteredUsers(result);
  }, [users, filters]);


  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
      } else {
        await createUser(data);
      }
      setFormOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      setError('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(userToDelete.id);
      setConfirmOpen(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return <AdminPanelSettings fontSize="small" />;
      case 'EMPLOYEE': return <Engineering fontSize="small" />;
      case 'CLIENT': return <PersonOutline fontSize="small" />;
      default: return <Person fontSize="small" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'primary';
      case 'EMPLOYEE': return 'secondary';
      case 'CLIENT': return 'success';
      default: return 'default';
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, width: 240, borderRadius: 2, height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom>Filter Users</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            label="Role"
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
            <MenuItem value="CLIENT">Client</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<Refresh />}
          onClick={() => setFilters({ role: '' })}
          sx={{ textTransform: 'none' }}
        >
          RESET FILTERS
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, flex: 1, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 400 }}>
            User Management
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
                setSelectedUser(null);
                setFormOpen(true);
              }}
              sx={{ textTransform: 'none' }}
            >
              Add User
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {users.length === 0 ? 'No users found' : 'No users match the current filters'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Person color="action" />
                        <span>{user.firstName} {user.lastName}</span>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedUser(user);
                            setFormOpen(true);
                          }}
                          title="Edit"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setUserToDelete(user);
                            setConfirmOpen(true);
                          }}
                          title="Delete"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <UserForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleFormSubmit}
          user={selectedUser}
        />

        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle>Confirm User Deletion</DialogTitle>
          <Box sx={{ px: 3, pb: 1 }}>
            <Typography variant="body1">
              Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </Box>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setConfirmOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              onClick={handleDelete}
              sx={{ textTransform: 'none' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default UserManagement;
