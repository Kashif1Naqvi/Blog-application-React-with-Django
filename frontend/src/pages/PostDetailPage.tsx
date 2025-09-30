import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  TextField,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Menu,
  MenuItem,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../contexts/AuthContext';
import {
  getPost,
  likePost,
  bookmarkPost,
  getPostComments,
  createComment,
  deleteComment,
  deletePost,
  type Post,
  type Comment,
} from '../services/blogService';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(Number(id));
      setPost(data);
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getPostComments(Number(id));
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const result = await likePost(post.id);
      setPost({
        ...post,
        is_liked: result.status === 'liked',
        likes_count: result.likes_count,
      });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleBookmark = async () => {
    if (!post) return;
    
    try {
      const result = await bookmarkPost(post.id);
      setPost({
        ...post,
        is_bookmarked: result.status === 'bookmarked',
      });
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !post) return;
    
    try {
      console.log("commentText", commentText)
      setSubmittingComment(true);
      await createComment(post.id, commentText);
      setCommentText('');
      loadComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (commentId: number) => {
    if (!replyText.trim() || !post) return;
    
    try {
      setSubmittingComment(true);
      await createComment(post.id, replyText, commentId);
      setReplyText('');
      setReplyingTo(null);
      loadComments();
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        navigate('/my-posts');
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete post');
      }
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <Box key={comment.id} sx={{ ml: depth * 4 }}>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={comment.author.profile_picture || undefined}
              sx={{ width: 36, height: 36 }}
            >
              {comment.author.username.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {comment.author.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {user?.username === comment.author.username && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm('Delete this comment?')) {
                        deleteComment(comment.id).then(() => loadComments());
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                {comment.content}
              </Typography>
              
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => setReplyingTo(comment.id)}
              >
                Reply
              </Button>
              
              {replyingTo === comment.id && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    multiline
                    rows={2}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={submittingComment || !replyText.trim()}
                    >
                      Reply
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
      
      {comment.replies.map(reply => renderComment(reply, depth + 1))}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto' }}>
        {error || 'Post not found'}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={post.status}
            size="small"
            color={post.status === 'published' ? 'success' : 'default'}
          />
          {post.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              variant="outlined"
              component={RouterLink}
              to={`/posts?tag=${tag.slug}`}
              clickable
            />
          ))}
        </Stack>
        
        <Typography variant="h3" fontWeight={700} gutterBottom>
          {post.title}
        </Typography>
        
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={post.author.profile_picture || undefined}
              sx={{ width: 40, height: 40 }}
            >
              {post.author.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {post.author.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{post.reading_time} min read</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <VisibilityIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{post.views_count} views</Typography>
            </Stack>
          </Stack>
          
          {user?.username === post.author.username && (
            <IconButton onClick={handleMenuOpen} sx={{ ml: 'auto' }}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Featured Image */}
      {post.featured_image && (
        <Box
          component="img"
          src={post.featured_image}
          alt={post.title}
          sx={{
            width: '100%',
            maxHeight: 500,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 4,
          }}
        />
      )}

      {/* Content */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.125rem',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.content}
        </Typography>
      </Paper>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant={post.is_liked ? 'contained' : 'outlined'}
          startIcon={post.is_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleLike}
        >
          {post.likes_count} Likes
        </Button>
        
        <Button
          variant={post.is_bookmarked ? 'contained' : 'outlined'}
          startIcon={post.is_bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          onClick={handleBookmark}
        >
          {post.is_bookmarked ? 'Saved' : 'Save'}
        </Button>
        
        <Button variant="outlined" startIcon={<ShareIcon />}>
          Share
        </Button>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Comments Section */}
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Comments ({comments.length})
        </Typography>
        
        {user && (
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmitComment}
              disabled={submittingComment || !commentText.trim()}
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        )}
        
        <Box>
          {comments.map(comment => renderComment(comment))}
          
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {
          navigate(`/posts/edit/${post.id}`);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PostDetailPage;