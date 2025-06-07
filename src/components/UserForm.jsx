import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import bcrypt from 'bcryptjs';

const roles = ['ADMIN', 'EMPLOYEE', 'CLIENT'];

const FIXED_SALT = '$2a$10$KbQiZtWxqMZ9k2FvO6yLUO';

const UserForm = ({ open, onClose, onSubmit, user }) => {
  const isEdit = Boolean(user);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    passwordHash: '', role: 'CLIENT'
  });

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: '' });
    } else {
      setFormData({
        firstName: '', lastName: '', email: '',
        phoneNumber: '', passwordHash: '', role: 'CLIENT'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const cleanedData = { ...formData };

    if (cleanedData.password.trim()) {
      const passwordHash = await bcrypt.hash(cleanedData.password, FIXED_SALT);
      cleanedData.passwordHash = passwordHash;
    }

    delete cleanedData.password;

    onSubmit(cleanedData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="email" label="Email" value={formData.email} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
        {!isEdit && (
          <TextField select fullWidth margin="dense" name="role" label="Role" value={formData.role} onChange={handleChange}>
            {roles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
