import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip,
  Divider 
} from '@mui/material';
import { format } from 'date-fns';

const TicketDetail = ({ ticket, onBack }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Button 
        variant="outlined" 
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to Tickets
      </Button>
      
      <Typography variant="h4" gutterBottom>{ticket.title}</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip 
          label={ticket.status}
          color={
            ticket.status === 'OPEN' ? 'primary' :
            ticket.status === 'IN_PROGRESS' ? 'warning' :
            'success'
          }
        />
        <Chip 
          label={ticket.priority}
          color={
            ticket.priority === 'HIGH' ? 'error' :
            ticket.priority === 'MEDIUM' ? 'warning' :
            'success'
          }
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body1" paragraph>
        {ticket.description}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">
          Created: {format(new Date(ticket.createdAt), 'PPpp')}
        </Typography>
        <Typography variant="caption">
          Last updated: {format(new Date(ticket.updatedAt), 'PPpp')}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Customer ID: {ticket.customerId}</Typography>
        <Typography variant="subtitle2">
          Agent: {ticket.agentId ? ticket.agentId : 'Unassigned'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TicketDetail;