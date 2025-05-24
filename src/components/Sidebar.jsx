import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Button
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

const Sidebar = ({ filters, setFilters, agents }) => {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      agentId: '',
      archive: false,
      showUnassignedOnly: false
    });
  };

  return (
    <Paper elevation={2} sx={{ width: 240, p: 2, borderRadius: 2, height: 'fit-content'}}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={filters.status}
          label="Status"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={filters.priority}
          label="Priority"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Assigned Agent</InputLabel>
        <Select
          name="agentId"
          value={filters.agentId}
          label="Assigned Agent"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={null}>Unassigned</MenuItem>
          {agents.map(agent => (
            <MenuItem key={agent.id} value={agent.id}>
              {agent.firstName} {agent.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.showUnassignedOnly}
              onChange={handleChange}
              name="showUnassignedOnly"
            />
          }
          label="Unassigned Only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.archive}
              onChange={handleChange}
              name="archive"
            />
          }
          label="Show Closed Tickets"
        />
      </FormGroup>

      <Box mt={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default Sidebar;
