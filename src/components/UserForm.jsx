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

const [password, setPassword] = useState('');

useEffect(() => {
  if (user) {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      passwordHash: user.passwordHash || '',
      role: user.role || 'CLIENT'
    });
    setPassword('');
  } else {
    setFormData({
      firstName: '', lastName: '', email: '', phoneNumber: '',
      passwordHash: '', role: 'CLIENT'
    });
    setPassword('');
  }
}, [user]);

const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'password') {
    setPassword(value);
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

const handleSubmit = async () => {
  const cleanedData = { ...formData };
  if (password.trim()) {
    const passwordHash = await bcrypt.hash(password, FIXED_SALT);
    cleanedData.passwordHash = passwordHash;
  }
  onSubmit(cleanedData);
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="email" label="Email" value={formData.email} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
        <TextField fullWidth margin="dense" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
        <TextField select fullWidth margin="dense" name="role" label="Role" value={formData.role} onChange={handleChange}>
          {roles.map(role => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
