import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  Avatar, 
  Stack,
  Container,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateIcon from '@mui/icons-material/Create';
import ExploreIcon from '@mui/icons-material/Explore';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';

// Sample blog post data
const featuredPosts = [
  {
    id: 1,
    title: "Mastering React Hooks",
    excerpt: "Deep dive into React Hooks and learn how to build powerful components...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    author: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    date: "2 days ago",
    category: "React",
    readTime: "8 min",
    likes: 234,
    comments: 45,
    views: 1289,
  },
  {
    id: 2,
    title: "Building Scalable APIs",
    excerpt: "Learn best practices for creating robust REST APIs with Node.js...",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=600&auto=format&fit=crop",
    author: { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=2" },
    date: "3 days ago",
    category: "Backend",
    readTime: "10 min",
    likes: 189,
    comments: 32,
    views: 967,
  },
  {
    id: 3,
    title: "Modern CSS Techniques",
    excerpt: "Explore the latest CSS features including Grid and animations...",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=600&auto=format&fit=crop",
    author: { name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=3" },
    date: "5 days ago",
    category: "CSS",
    readTime: "6 min",
    likes: 156,
    comments: 28,
    views: 743,
  },
  {
    id: 4,
    title: "TypeScript Patterns",
    excerpt: "Master essential design patterns in TypeScript for better code...",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=600&auto=format&fit=crop",
    author: { name: "Alex Turner", avatar: "https://i.pravatar.cc/150?img=4" },
    date: "1 week ago",
    category: "TypeScript",
    readTime: "12 min",
    likes: 298,
    comments: 56,
    views: 1543,
  },
  {
    id: 5,
    title: "Web Performance Tips",
    excerpt: "Practical strategies to improve your website's loading speed...",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    author: { name: "Jessica Lee", avatar: "https://i.pravatar.cc/150?img=5" },
    date: "1 week ago",
    category: "Performance",
    readTime: "9 min",
    likes: 412,
    comments: 67,
    views: 2134,
  },
  {
    id: 6,
    title: "Getting Started Docker",
    excerpt: "A beginner-friendly introduction to containerization...",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=600&auto=format&fit=crop",
    author: { name: "David Park", avatar: "https://i.pravatar.cc/150?img=6" },
    date: "2 weeks ago",
    category: "DevOps",
    readTime: "11 min",
    likes: 267,
    comments: 41,
    views: 1456,
  },
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          mb: 6,
          overflow: 'hidden',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fffdfd 0%, #2151cc 100%)',
          color: 'white',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                         radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px, 80px 80px',
            animation: 'float 20s ease-in-out infinite',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label={isAuthenticated ? `Welcome back, ${user?.username}!` : "New Platform"}
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                }}
              />
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  mb: 2,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Share Your Ideas,
                <br />
                Inspire the World
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  opacity: 0.95,
                  lineHeight: 1.6,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  maxWidth: 520,
                }}
              >
                {isAuthenticated
                  ? 'Continue sharing your thoughts with our growing community.'
                  : 'Join thousands of writers and readers in our community.'
                }
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="contained"
                      component={RouterLink} 
                      to="/posts/create"
                      size="large"
                      startIcon={<CreateIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: '#0d9488',
                        px: 3.5,
                        py: 1.5,
                        fontWeight: 700,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Create Post
                    </Button>
                    <Button 
                      variant="outlined"
                      component={RouterLink} 
                      to="/posts"
                      size="large"
                      startIcon={<ExploreIcon />}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: 2,
                        px: 3.5,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Explore
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="contained"
                      component={RouterLink} 
                      to="/register"
                      size="large"
                      startIcon={<CreateIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: '#0d9488',
                        px: 3.5,
                        py: 1.5,
                        fontWeight: 700,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined"
                      component={RouterLink} 
                      to="/posts"
                      size="large"
                      startIcon={<AutoStoriesIcon />}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: 2,
                        px: 3.5,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Browse
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 280,
                  height: 280,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(40px)',
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                <AutoStoriesIcon sx={{ fontSize: 140, color: 'white', opacity: 0.9, zIndex: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Posts Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 5 }}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{ mb: 3 }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                  }}
                >
                  <TrendingUpIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Featured Stories
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
                Discover trending content from our community
              </Typography>
            </Box>
            
            <Button 
              component={RouterLink}
              to="/posts"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                fontWeight: 600,
                px: 2.5,
              }}
            >
              View All
            </Button>
          </Stack>
          
          {/* FIXED GRID - Now properly shows 3 columns */}
          <Grid container spacing={2.5}>
            {featuredPosts.map((post, index) => (
              <Grid 
                item 
                xs={12}      // 1 column on mobile (< 600px)
                sm={6}       // 2 columns on tablet (600px - 900px)
                md={4}       // 3 columns on desktop (≥ 900px)
                key={post.id}
              >
                <Card 
                  component={RouterLink}
                  to={`/posts/${post.id}`}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 32px rgba(13, 148, 136, 0.15)',
                      borderColor: 'primary.main',
                      '& .post-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {/* Compact Image */}
                  <Box 
                    sx={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      height: 140,
                      bgcolor: 'grey.100',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.image}
                      alt={post.title}
                      className="post-image"
                      sx={{
                        transition: 'transform 0.4s ease',
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Category Badge */}
                    <Chip 
                      label={post.category} 
                      size="small" 
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'rgba(13, 148, 136, 0.95)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 22,
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }} 
                    />

                    {/* Quick Actions */}
                    <Stack 
                      direction="row" 
                      spacing={0.5}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(8px)',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: 'white',
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <FavoriteBorderIcon sx={{ fontSize: 14, color: 'error.main' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(8px)',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: 'white',
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <BookmarkBorderIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                      </IconButton>
                    </Stack>
                  </Box>
                  
                  {/* Compact Content */}
                  <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        lineHeight: 1.3,
                        fontSize: '0.95rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6em',
                        color: 'text.primary',
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    {/* Excerpt */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 1.5,
                        lineHeight: 1.5,
                        fontSize: '0.8125rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flexGrow: 1,
                        minHeight: '2.4em',
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                    
                    {/* Inline Stats */}
                    <Stack 
                      direction="row" 
                      spacing={1.5}
                      alignItems="center"
                      sx={{ 
                        py: 1,
                        px: 1.5,
                        mx: -1.5,
                        mb: 1.5,
                        bgcolor: 'grey.50',
                        borderRadius: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.7rem" color="text.secondary">
                          {post.readTime}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FavoriteIcon sx={{ fontSize: 12, color: 'error.main' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.7rem" color="text.secondary">
                          {post.likes}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutlineIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.7rem" color="text.secondary">
                          {post.comments}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto' }}>
                        <VisibilityIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.7rem" color="text.secondary">
                          {post.views}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    {/* Compact Author Info */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar 
                        src={post.author.avatar}
                        sx={{ 
                          width: 28, 
                          height: 28,
                          border: '2px solid',
                          borderColor: 'grey.200',
                        }}
                      >
                        {post.author.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={600} 
                          sx={{ 
                            lineHeight: 1.2, 
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {post.author.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: '0.65rem' }}
                        >
                          {post.date}
                        </Typography>
                      </Box>

                      <IconButton 
                        size="small"
                        sx={{
                          width: 28,
                          height: 28,
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: 'primary.50',
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ShareIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* View All Button for Mobile */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 3 }}>
            <Button 
              component={RouterLink}
              to="/posts"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              fullWidth
              sx={{ maxWidth: 400 }}
            >
              View All Posts
            </Button>
          </Box>
        </Box>

        {/* CTA Section */}
        {!isAuthenticated && (
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Ready to Share Your Story?
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  maxWidth: 560, 
                  mx: 'auto', 
                  mb: 3,
                  opacity: 0.95,
                  lineHeight: 1.6,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                }}
              >
                Join thousands of writers and readers in our growing community!
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button 
                  variant="contained"
                  component={RouterLink} 
                  to="/register"
                  size="large"
                  startIcon={<CreateIcon />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#10b981',
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Create Account
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
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Container>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;