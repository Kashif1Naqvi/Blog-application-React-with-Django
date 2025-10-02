import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CreateIcon from '@mui/icons-material/Create';
import { Avatar, IconButton } from '@mui/material';
import { getPosts, likePost, bookmarkPost, type Post } from '../services/blogService';
import LikeButton from '../components/LikeButton';
import './PostsPage.css';

const PostsPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedTag, sortBy, page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getPosts({
        status: 'published',
        search: searchQuery || undefined,
        tags: selectedTag || undefined,
        ordering: sortBy,
        page: page,
      });
      
      if (page === 1) {
        setPosts(data.results);
      } else {
        setPosts(prev => [...prev, ...data.results]);
      }
      
      setHasMore(!!data.next);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const result = await likePost(postId);
      setPosts(prevPosts => 
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
      setPosts(prevPosts => 
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadPosts();
  };

  return (
    <div className="posts-page">
      {/* Hero Header */}
      <div className="posts-hero bg-gradient text-white py-5 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">Explore Stories</h1>
              <p className="lead mb-0">
                Discover amazing content from our community of writers
              </p>
            </Col>
            {isAuthenticated && (
              <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                <Button
                  variant="light"
                  size="lg"
                  as={RouterLink}
                  to="/posts/create"
                  className="fw-semibold"
                >
                  <CreateIcon className="me-2" style={{ fontSize: 20 }} />
                  Write a Post
                </Button>
              </Col>
            )}
          </Row>
        </Container>
      </div>

      <Container>
        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={8}>
            <Form onSubmit={handleSearch}>
              <InputGroup size="lg">
                <InputGroup.Text className="bg-white">
                  <SearchIcon />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search posts"
                />
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Col>
          <Col lg={4} className="mt-3 mt-lg-0">
            <Form.Select
              size="lg"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              aria-label="Sort posts by"
            >
              <option value="-created_at">Latest</option>
              <option value="-views_count">Most Viewed</option>
              <option value="-likes_count">Most Liked</option>
              <option value="-comments_count">Most Discussed</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Posts Grid */}
        {loading && page === 1 ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading posts...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : posts.length === 0 ? (
          <div className="text-center py-5">
            <AutoStoriesIcon style={{ fontSize: 80, color: '#cbd5e1' }} />
            <h4 className="text-muted mt-3">No posts found</h4>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {posts.map((post, index) => (
                <Col lg={4} md={6} sm={12} key={post.id}>
                  <Card 
                    className="h-100 border-0 shadow-sm post-card"
                    style={{ 
                      cursor: 'pointer',
                      animation: `fadeIn 0.5s ease-out ${(index % 6) * 0.08}s both`,
                    }}
                    as={RouterLink}
                    to={`/posts/${post.id}`}
                  >
                    {/* Card Image */}
                    <div className="position-relative" style={{ height: 200, overflow: 'hidden' }}>
                      {post.featured_image ? (
                        <Card.Img 
                          variant="top" 
                          src={post.featured_image} 
                          alt={post.title}
                          className="post-image"
                          style={{ height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center bg-light h-100">
                          <AutoStoriesIcon style={{ fontSize: 60, color: '#9ca3af' }} />
                        </div>
                      )}
                      
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <Badge 
                          bg="primary"
                          className="position-absolute"
                          style={{ top: 12, left: 12, fontSize: '0.7rem' }}
                        >
                          {post.tags[0].name}
                        </Badge>
                      )}

                      {/* Quick Actions */}
                      {isAuthenticated && (
                        <div className="position-absolute d-flex gap-2" style={{ top: 12, right: 12 }}>
                          {/* ENHANCED LIKE BUTTON */}
                          <div 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <LikeButton
                              isLiked={post.is_liked}
                              likesCount={post.likes_count}
                              onToggleLike={() => handleLikePost(post.id)}
                              size="small"
                              showCount={false}
                              variant="post"
                              className="bg-white shadow-sm rounded-circle"
                            />
                          </div>
                          
                          {/* KEEP EXISTING BOOKMARK BUTTON */}
                          <IconButton
                            size="small"
                            className="bg-white shadow-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBookmarkPost(post.id);
                            }}
                          >
                            {post.is_bookmarked ? (
                              <BookmarkIcon style={{ fontSize: 18, color: '#0d9488' }} />
                            ) : (
                              <BookmarkBorderIcon style={{ fontSize: 18, color: '#0d9488' }} />
                            )}
                          </IconButton>
                        </div>
                      )}
                    </div>
                    
                    {/* Card Body */}
                    <Card.Body className="d-flex flex-column p-3">
                      <Card.Title 
                        className="fw-bold mb-2"
                        style={{ 
                          fontSize: '1.1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.title}
                      </Card.Title>
                      
                      <Card.Text 
                        className="text-muted mb-3 flex-grow-1"
                        style={{ 
                          fontSize: '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.excerpt}
                      </Card.Text>
                      
                      {/* Stats */}
                      <div className="d-flex align-items-center gap-3 py-2 px-3 mb-3 bg-light rounded">
                        <div className="d-flex align-items-center gap-1">
                          <AccessTimeIcon style={{ fontSize: 14, color: '#6b7280' }} />
                          <small className="fw-semibold text-muted">{post.reading_time}m</small>
                        </div>
                        
                        {/* ENHANCED LIKE STATS */}
                        <LikeButton
                          isLiked={post.is_liked}
                          likesCount={post.likes_count}
                          onToggleLike={() => handleLikePost(post.id)}
                          size="small"
                          variant="post"
                        />
                        
                        <div className="d-flex align-items-center gap-1">
                          <ChatBubbleOutlineIcon style={{ fontSize: 14, color: '#0d9488' }} />
                          <small className="fw-semibold text-muted">{post.comments_count}</small>
                        </div>
                        <div className="d-flex align-items-center gap-1 ms-auto">
                          <VisibilityIcon style={{ fontSize: 14, color: '#6b7280' }} />
                          <small className="fw-semibold text-muted">{post.views_count}</small>
                        </div>
                      </div>
                      
                      {/* Author */}
                      <div className="d-flex align-items-center gap-2">
                        <Avatar 
                          src={post.author.profile_picture || undefined}
                          style={{ width: 32, height: 32 }}
                        >
                          {post.author.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="flex-grow-1">
                          <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                            {post.author.username}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(post.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <IconButton size="small">
                          <ShareIcon style={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-5">
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default PostsPage;