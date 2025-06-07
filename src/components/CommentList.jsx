import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Box
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';

import {
  getCommentsByTicket,
  createComment,
  updateComment,
  deleteComment
} from '../services/commentService';
import { getCurrentUser } from '../services/authService';
import { getUserById } from '../services/userService';
import { getTicketById } from '../services/ticketService';
import { notifyNewComment } from '../services/notificationService';

const CommentList = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [users, setUsers] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [loading, setLoading] = useState({
    comments: false,
    action: false,
    users: false
  });
  const [error, setError] = useState(null);
  
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'ADMIN';

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  useEffect(() => {
    const authorIds = [...new Set(comments.map(comment => comment.authorId))];
    fetchUsers(authorIds);
  }, [comments]);

  const fetchComments = async () => {
    try {
      setLoading(prev => ({ ...prev, comments: true }));
      const data = await getCommentsByTicket(ticketId);
      const sortedComments = [...data].sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComments(sortedComments);
      setError(null);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  const fetchUsers = async (userIds) => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const newUsers = { ...users };
      
      await Promise.all(userIds.map(async (userId) => {
        if (!newUsers[userId]) {
          try {
            const userData = await getUserById(userId);
            newUsers[userId] = userData;
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err);
            newUsers[userId] = { id: userId, firstName: 'User', lastName: userId };
          }
        }
      }));
      
      setUsers(newUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const getAuthorName = (authorId) => {
    const user = users[authorId];
    return user ? `${user.firstName} ${user.lastName}` : `User ${authorId}`;
  };

  const canEditDelete = (comment) => {
    return isAdmin || String(comment.authorId) === String(currentUser.id);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(prev => ({ ...prev, action: true }));
      const createdComment = await createComment({
        content: newComment,
        ticketId,
        authorId: currentUser.id
      });
      setNewComment('');
      await fetchComments();

      const ticket = await getTicketById(ticketId);

      let recipientEmail;

      if (currentUser.role === 'CLIENT') {
        const employee = await getUserById(ticket.employeeId);
        recipientEmail = employee?.email;
      } else {
        const client = await getUserById(ticket.clientId);
        recipientEmail = client?.email;
      }

      notifyNewComment({
        recipient: recipientEmail,
        ticketId,
        ticketTitle: ticket.title,
        commentText: createdComment.content
      }).catch(console.error);
      

    } catch (error) {
      console.error('Failed to post comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleEditComment = async (id) => {
    if (!editingCommentContent.trim()) return;
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await updateComment(id, { content: editingCommentContent });
      setEditingCommentId(null);
      setEditingCommentContent('');
      await fetchComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
      setError('Failed to update comment. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await deleteComment(commentToDelete.id);
      await fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>Comments</Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {loading.comments && !comments.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        comments.map(comment => (
          <Paper 
            key={comment.id} 
            sx={{ 
              p: 2, 
              mb: 2, 
              position: 'relative',
              border: editingCommentId === comment.id ? '1px solid #1976d2' : undefined
            }} 
            variant="outlined"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                {getAuthorName(comment.authorId)}
                {isAdmin && comment.authorId !== currentUser.id && (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    (Admin Action)
                  </Typography>
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(comment.createdAt)}
                {comment.updatedAt !== comment.createdAt && ' (edited)'}
              </Typography>
            </Box>

            {editingCommentId === comment.id ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  value={editingCommentContent}
                  onChange={(e) => setEditingCommentContent(e.target.value)}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEditComment(comment.id)}
                    disabled={loading.action}
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentContent('');
                    }}
                    disabled={loading.action}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </Typography>
                {canEditDelete(comment) && (
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Edit fontSize="small" />}
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingCommentContent(comment.content);
                      }}
                      disabled={loading.action}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete fontSize="small" />}
                      onClick={() => handleDeleteClick(comment)}
                      disabled={loading.action}
                      color="error"
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>
        ))
      )}

      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading.action}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          sx={{ mt: 1 }}
          disabled={!newComment.trim() || loading.action}
          startIcon={loading.action ? <CircularProgress size={20} /> : null}
        >
          Post Comment
        </Button>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>
          {isAdmin && commentToDelete?.authorId !== currentUser.id 
            ? "Admin: Delete User Comment" 
            : "Delete Comment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isAdmin && commentToDelete?.authorId !== currentUser.id ? (
              <>
                You are about to delete another user's comment as an admin.
                <br />
                Are you sure you want to proceed?
              </>
            ) : (
              "Are you sure you want to delete this comment? This action cannot be undone."
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={loading.action}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={loading.action}
            startIcon={loading.action ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentList;
