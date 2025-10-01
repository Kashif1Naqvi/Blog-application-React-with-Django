import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Nav, Dropdown, Modal, Spinner, Alert } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ArticleIcon from '@mui/icons-material/Article';
import { getMyPosts, deletePost, type Post } from '../services/blogService';
import './MyPostsPage.css';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getMyPosts();
      setPosts(data.results);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;
    
    try {
      setDeleting(true);
      await deletePost(selectedPost.id);
      setPosts(posts.filter(p => p.id !== selectedPost.id));
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return post.status === 'published';
    if (activeTab === 'drafts') return post.status === 'draft';
    return true;
  });

  return (
    <div className="my-posts-page">
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-2">My Posts</h2>
            <p className="text-muted mb-0">Manage your blog posts</p>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            as={RouterLink}
            to="/posts/create"
          >
            <AddIcon style={{ fontSize: 20, marginRight: 4 }} />
            Create New Post
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')}
            >
              All ({posts.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'published'} 
              onClick={() => setActiveTab('published')}
            >
              Published ({posts.filter(p => p.status === 'published').length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'drafts'} 
              onClick={() => setActiveTab('drafts')}
            >
              Drafts ({posts.filter(p => p.status === 'draft').length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-5">
            <ArticleIcon style={{ fontSize: 80, color: '#cbd5e1' }} />
            <h5 className="text-muted mt-3">No posts found</h5>
            <p className="text-muted">
              {activeTab === 'drafts' 
                ? "You don't have any draft posts"
                : activeTab === 'published'
                ? "You haven't published any posts yet"
                : "Start creating your first post"
              }
            </p>
            {activeTab === 'all' && (
              <Button 
                variant="primary"
                as={RouterLink}
                to="/posts/create"
              >
                <AddIcon style={{ fontSize: 20, marginRight: 4 }} />
                Create Your First Post
              </Button>
            )}
          </div>
        ) : (
          <Row className="g-4">
            {filteredPosts.map((post) => (
              <Col lg={4} md={12} key={post.id}>
                <Card className="h-100 border-0 shadow-sm post-card">
                  {post.featured_image && (
                    <Card.Img 
                      variant="top" 
                      src={post.featured_image} 
                      alt={post.title}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  )}
                  
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <div className="d-flex gap-2 mb-2 flex-wrap">
                          <Badge 
                            bg={post.status === 'published' ? 'success' : 'secondary'}
                          >
                            {post.status}
                          </Badge>
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} bg="primary" className="fw-normal">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                        <h5 className="fw-bold mb-2">{post.title}</h5>
                      </div>
                      
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="link" 
                          className="text-muted p-0"
                          style={{ textDecoration: 'none' }}
                        >
                          <MoreVertIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item 
                            as={RouterLink} 
                            to={`/posts/${post.id}`}
                          >
                            <VisibilityIcon style={{ fontSize: 18, marginRight: 8 }} />
                            View
                          </Dropdown.Item>
                          <Dropdown.Item 
                            as={RouterLink} 
                            to={`/posts/edit/${post.id}`}
                          >
                            <EditIcon style={{ fontSize: 18, marginRight: 8 }} />
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item 
                            className="text-danger"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDeleteModal(true);
                            }}
                          >
                            <DeleteIcon style={{ fontSize: 18, marginRight: 8 }} />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    
                    <p className="text-muted mb-3 flex-grow-1" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </p>
                    
                    <div className="d-flex gap-4 text-muted">
                      <div className="d-flex align-items-center gap-1">
                        <VisibilityIcon style={{ fontSize: 18 }} />
                        <small>{post.views_count}</small>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <ThumbUpIcon style={{ fontSize: 18 }} />
                        <small>{post.likes_count}</small>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <CommentIcon style={{ fontSize: 18 }} />
                        <small>{post.comments_count}</small>
                      </div>
                    </div>
                    
                    <small className="text-muted mt-3">
                      {new Date(post.created_at).toLocaleDateString()}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => !deleting && setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Post?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>"{selectedPost?.title}"</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <DeleteIcon style={{ fontSize: 18, marginRight: 4 }} />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyPostsPage;