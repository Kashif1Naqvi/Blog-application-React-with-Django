import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Avatar } from '@mui/material';
import { getPosts, likePost, bookmarkPost, type Post } from '../services/blogService';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedPosts();
  }, []);

  const loadFeaturedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts({
        status: 'published',
        ordering: '-views_count',
        page: 1,
      });
      setFeaturedPosts(data.results.slice(0, 6));
    } catch (err) {
      console.error('Error loading featured posts:', err);
      setError('Failed to load featured posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const result = await likePost(postId);
      setFeaturedPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, is_liked: result.status === 'liked', likes_count: result.likes_count }
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleBookmarkPost = async (postId: number) => {
    try {
      const result = await bookmarkPost(postId);
      setFeaturedPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, is_bookmarked: result.status === 'bookmarked' }
            : post
        )
      );
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={7}>
              <div className="hero-badge mb-3">
                {isAuthenticated ? `Welcome back, ${user?.username}!` : "Join Our Community"}
              </div>
              
              <h1 className="hero-title mb-3">
                Share Your Ideas,
                <br />
                Inspire the World
              </h1>
              
              <p className="hero-subtitle mb-4">
                {isAuthenticated
                  ? 'Continue sharing your thoughts with our growing community.'
                  : 'Join thousands of writers and readers in our community.'
                }
              </p>
              
              <div className="d-flex gap-3 flex-wrap">
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="primary"
                      size="lg"
                      as={RouterLink} 
                      to="/posts/create"
                      className="px-4"
                    >
                      <CreateIcon style={{ fontSize: 20, marginRight: 8 }} />
                      Create Post
                    </Button>
                    <Button 
                      variant="outline-primary"
                      size="lg"
                      as={RouterLink} 
                      to="/posts"
                      className="px-4"
                    >
                      <ExploreIcon style={{ fontSize: 20, marginRight: 8 }} />
                      Explore
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="primary"
                      size="lg"
                      as={RouterLink} 
                      to="/register"
                      className="px-4"
                    >
                      <CreateIcon style={{ fontSize: 20, marginRight: 8 }} />
                      Get Started
                    </Button>
                    <Button 
                      variant="outline-primary"
                      size="lg"
                      as={RouterLink} 
                      to="/posts"
                      className="px-4"
                    >
                      <AutoStoriesIcon style={{ fontSize: 20, marginRight: 8 }} />
                      Browse
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block text-center">
              <div className="hero-icon-wrapper">
                <AutoStoriesIcon className="hero-icon" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Posts */}
      <Container className="py-5">
        <div className="section-header d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="section-icon">
                <TrendingUpIcon />
              </div>
              <h2 className="section-title mb-0">Featured Stories</h2>
            </div>
            <p className="section-subtitle">Discover trending content from our community</p>
          </div>
          
          <Button 
            variant="link"
            as={RouterLink}
            to="/posts"
            className="d-none d-sm-flex align-items-center text-decoration-none"
          >
            View All
            <ArrowForwardIcon style={{ fontSize: 18, marginLeft: 4 }} />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : featuredPosts.length === 0 ? (
          <div className="text-center py-5">
            <AutoStoriesIcon style={{ fontSize: 80, color: 'var(--color-muted)' }} />
            <h5 className="mt-3" style={{ color: 'var(--color-muted)' }}>No posts available yet</h5>
            <p style={{ color: 'var(--color-muted)' }}>Be the first to create a post!</p>
            {isAuthenticated && (
              <Button variant="primary" as={RouterLink} to="/posts/create">
                <CreateIcon style={{ fontSize: 20, marginRight: 8 }} />
                Create Your First Post
              </Button>
            )}
          </div>
        ) : (
          <Row className="g-4">
            {featuredPosts.map((post, index) => (
              <Col lg={4} md={6} key={post.id}>
                <Card 
                  className="post-card h-100"
                  as={RouterLink}
                  to={`/posts/${post.id}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="post-image-wrapper">
                    {post.featured_image ? (
                      <Card.Img 
                        variant="top" 
                        src={post.featured_image} 
                        alt={post.title}
                        className="post-image"
                      />
                    ) : (
                      <div className="post-image-placeholder">
                        <AutoStoriesIcon style={{ fontSize: 48 }} />
                      </div>
                    )}
                    
                    {post.tags.length > 0 && (
                      <Badge bg="primary" className="post-badge">
                        {post.tags[0].name}
                      </Badge>
                    )}

                    {isAuthenticated && (
                      <div className="post-actions">
                        <IconButton
                          size="small"
                          className="action-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikePost(post.id);
                          }}
                        >
                          {post.is_liked ? (
                            <FavoriteIcon style={{ fontSize: 16, color: 'var(--color-error)' }} />
                          ) : (
                            <FavoriteBorderIcon style={{ fontSize: 16, color: 'var(--color-error)' }} />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          className="action-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBookmarkPost(post.id);
                          }}
                        >
                          {post.is_bookmarked ? (
                            <BookmarkIcon style={{ fontSize: 16, color: 'var(--color-primary)' }} />
                          ) : (
                            <BookmarkBorderIcon style={{ fontSize: 16, color: 'var(--color-primary)' }} />
                          )}
                        </IconButton>
                      </div>
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="post-title">
                      {post.title}
                    </Card.Title>
                    
                    <Card.Text className="post-excerpt">
                      {post.excerpt}
                    </Card.Text>
                    
                    <div className="post-stats">
                      <div className="stat-item">
                        <AccessTimeIcon style={{ fontSize: 14 }} />
                        <small>{post.reading_time}m</small>
                      </div>
                      <div className="stat-item">
                        <FavoriteIcon style={{ fontSize: 14, color: 'var(--color-error)' }} />
                        <small>{post.likes_count}</small>
                      </div>
                      <div className="stat-item">
                        <ChatBubbleOutlineIcon style={{ fontSize: 14, color: 'var(--color-primary)' }} />
                        <small>{post.comments_count}</small>
                      </div>
                      <div className="stat-item ms-auto">
                        <VisibilityIcon style={{ fontSize: 14 }} />
                        <small>{post.views_count}</small>
                      </div>
                    </div>
                    
                    <div className="post-author mt-3">
                      <Avatar 
                        src={post.author.profile_picture || undefined}
                        style={{ width: 32, height: 32 }}
                      >
                        {post.author.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <div className="author-info">
                        <div className="author-name">{post.author.username}</div>
                        <small className="author-date">
                          {new Date(post.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <IconButton size="small" className="ms-auto">
                        <ShareIcon style={{ fontSize: 16 }} />
                      </IconButton>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!loading && featuredPosts.length > 0 && (
          <div className="text-center mt-4 d-sm-none">
            <Button 
              variant="outline-primary"
              as={RouterLink}
              to="/posts"
              className="w-100"
            >
              View All Posts
              <ArrowForwardIcon style={{ fontSize: 18, marginLeft: 8 }} />
            </Button>
          </div>
        )}
      </Container>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="cta-section">
          <Container className="text-center">
            <h2 className="cta-title">Ready to Share Your Story?</h2>
            <p className="cta-subtitle">
              Join thousands of writers and readers in our growing community!
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                variant="primary"
                size="lg"
                as={RouterLink} 
                to="/register"
                className="px-4"
              >
                <CreateIcon style={{ fontSize: 20, marginRight: 8 }} />
                Create Account
              </Button>
              <Button 
                variant="outline-light"
                size="lg"
                as={RouterLink} 
                to="/login"
                className="px-4"
              >
                Sign In
              </Button>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default HomePage;