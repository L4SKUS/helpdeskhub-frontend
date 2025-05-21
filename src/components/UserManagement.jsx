import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Button, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Alert, Dialog, DialogActions,
  DialogTitle
} from '@mui/material';
import {
  getAllUsers, createUser, updateUser, deleteUser
} from '../services/userService';
import UserForm from './UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
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
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete.id);
      setConfirmOpen(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">User Management</Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>Add User</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => {
                    setSelectedUser(user);
                    setFormOpen(true);
                  }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => {
                    setUserToDelete(user);
                    setConfirmOpen(true);
                  }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setSelectedUser(null); }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserManagement;
