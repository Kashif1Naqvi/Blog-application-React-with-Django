import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  Avatar, 
  Divider,
  Stack,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// Sample blog post data
const samplePosts = [
  {
    id: 1,
    title: "Getting Started with React",
    excerpt: "A comprehensive beginner's guide to React development and modern web applications...",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=500&auto=format&fit=crop",
    author: "John Doe",
    date: "September 28, 2025",
    category: "React",
    readTime: "5 min read",
    likes: 142,
    comments: 23
  },
  {
    id: 2,
    title: "Django REST Framework Best Practices",
    excerpt: "Learn how to structure your APIs for scalability, maintainability, and production...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop",
    author: "Jane Smith",
    date: "September 25, 2025",
    category: "Backend",
    readTime: "8 min read",
    likes: 89,
    comments: 15
  },
  {
    id: 3,
    title: "Modern CSS Techniques for 2025",
    excerpt: "Exploring the latest CSS features and how to use them effectively in your projects...",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=500&auto=format&fit=crop",
    author: "Alex Johnson",
    date: "September 21, 2025",
    category: "CSS",
    readTime: "4 min read",
    likes: 67,
    comments: 12
  }
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.4
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 2
            }}
          >
            {isAuthenticated 
              ? `Welcome back, ${user?.username}! 👋`
              : 'Welcome to Blog App 📝'
            }
          </Typography>
          
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              lineHeight: 1.7,
              fontSize: { xs: '1rem', sm: '1.15rem' }
            }}
          >
            {isAuthenticated
              ? 'Continue sharing your thoughts and ideas with our community. What will you write about today?'
              : 'A platform for writers and readers to connect, share ideas, and explore new perspectives. Join our community today!'
            }
          </Typography>
          
          {!isAuthenticated && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/register"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.05rem',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/login"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.05rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 2,
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
          )}
          
          {isAuthenticated && (
            <Button 
              variant="contained" 
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                fontSize: '1.05rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              Create New Post
            </Button>
          )}
        </Box>
      </Paper>

      {/* Featured Posts Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h4" component="h2" fontWeight={700}>
                Featured Posts
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Discover trending stories from our community
            </Typography>
          </Box>
          
          <Button 
            color="primary"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {samplePosts.map(post => (
            <Grid item xs={12} sm={6} lg={4} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    '& .post-image': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                <Box sx={{ overflow: 'hidden', position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    className="post-image"
                    sx={{ 
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <Chip 
                    label={post.category} 
                    size="small" 
                    sx={{ 
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }} 
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {post.readTime}
                    </Typography>
                  </Stack>
                  
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1.5,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      lineHeight: 1.7,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {post.author.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                          {post.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.date}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FavoriteIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {post.likes}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {post.comments}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant="h4" 
              component="h2" 
              fontWeight={800} 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
            >
              Ready to share your ideas with the world?
            </Typography>
            
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                mb: 4,
                opacity: 0.95,
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.15rem' }
              }}
            >
              Join thousands of writers and readers in our growing community. Create an account today to start posting!
            </Typography>
            
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/register"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#f5576c',
                px: 5,
                py: 1.75,
                fontSize: '1.05rem',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.95)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              Create an Account
            </Button>
          </Container>
        </Paper>
      )}
    </Box>
  );
};

export default HomePage;