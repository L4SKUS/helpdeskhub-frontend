import React from 'react';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const Sidebar = ({ filters, setFilters, agents }) => {
  const handleStatusChange = (event) => {
    setFilters(prev => ({
      ...prev,
      status: event.target.value
    }));
  };

  const handlePriorityChange = (event) => {
    setFilters(prev => ({
      ...prev,
      priority: event.target.value
    }));
  };

  const handleAgentChange = (event) => {
    setFilters(prev => ({
      ...prev,
      agentId: event.target.value === "unassigned" ? null : event.target.value
    }));
  };

  const handleArchiveToggle = (event) => {
    setFilters(prev => ({
      ...prev,
      archive: event.target.checked
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      agentId: '',
      archive: false
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={handleStatusChange}
            disabled={filters.archive}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={handlePriorityChange}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={filters.agentId === null ? "unassigned" : filters.agentId}
            label="Assigned To"
            onChange={handleAgentChange}
          >
            <MenuItem value="">All Agents</MenuItem>
            <MenuItem value="unassigned">Unassigned</MenuItem>
            {agents.map(agent => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.firstName} {agent.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.archive || false}
              onChange={handleArchiveToggle}
            />
          }
          label="Show Closed Tickets"
        />

        <Button
          variant="outlined"
          onClick={handleResetFilters}
          fullWidth
          sx={{ mt: 1 }}
        >
          Reset Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default Sidebar;
