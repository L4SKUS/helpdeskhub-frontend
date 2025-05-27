import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Divider, InputAdornment
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import bcrypt from 'bcryptjs';
import { changePassword } from '../services/userService';
import { getCurrentUser } from '../services/authService';

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      const currentUser = getCurrentUser();

      const FIXED_SALT = '$2a$10$KbQiZtWxqMZ9k2FvO6yLUO';
      const currentPasswordHash = await bcrypt.hash(currentPassword, FIXED_SALT);
      const newPasswordHash = await bcrypt.hash(newPassword, FIXED_SALT);

      await changePassword({
        id: currentUser.id,
        currentPasswordHash,
        newPasswordHash
      });

      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (err) {
      console.error(err);
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <VpnKeyIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Change Password
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Update your account password below.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            required
            value={form.currentPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            required
            value={form.newPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" variant="body2">{error}</Typography>
          )}
          {success && (
            <Typography color="success.main" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon fontSize="small" /> Password changed successfully.
            </Typography>
          )}
          <Button variant="contained" type="submit" sx={{ mt: 1 }}>
            Update Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
