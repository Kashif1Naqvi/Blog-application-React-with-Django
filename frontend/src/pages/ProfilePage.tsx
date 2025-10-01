import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Nav, Tab, Spinner, Alert, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/userService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      bio: user?.bio || '',
      profile_picture: null as File | null,
    },
    validationSchema: Yup.object({
      bio: Yup.string().max(500, 'Bio must be 500 characters or less'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('bio', values.bio);
        
        if (values.profile_picture) {
          formData.append('profile_picture', values.profile_picture);
        }
        
        const updatedUser = await updateProfile(formData);
        updateUser(updatedUser);
        setSuccess('Profile updated successfully!');
        setShowEditModal(false);
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      formik.setFieldValue('profile_picture', file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user?.profile_picture) {
      setImagePreview(user.profile_picture);
    }
  }, [user]);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <div className="profile-hero">
        <Container>
          <div className="profile-cover" />
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {user.profile_picture ? (
                  <Image 
                    src={user.profile_picture} 
                    alt={user.username}
                    roundedCircle
                    fluid
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <PersonIcon style={{ fontSize: 80, color: '#6b7280' }} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="profile-info">
              <h2 className="profile-name">{user.username}</h2>
              <p className="profile-email text-muted">{user.email}</p>
              {user.bio && (
                <p className="profile-bio">{user.bio}</p>
              )}
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowEditModal(true)}
                className="mt-2"
              >
                <EditIcon style={{ fontSize: 16, marginRight: 4 }} />
                Edit Profile
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Alerts */}
      <Container className="mt-3">
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Container>

      {/* Content Tabs */}
      <Container className="mt-4 mb-5">
        <Tab.Container defaultActiveKey="posts">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="posts">
                <ArticleIcon style={{ fontSize: 18, marginRight: 8 }} />
                My Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bookmarks">
                <BookmarkIcon style={{ fontSize: 18, marginRight: 8 }} />
                Bookmarks
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="about">
                <PersonIcon style={{ fontSize: 18, marginRight: 8 }} />
                About
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Posts Tab */}
            <Tab.Pane eventKey="posts">
              <div className="text-center py-5">
                <ArticleIcon style={{ fontSize: 80, color: '#cbd5e1' }} />
                <h5 className="text-muted mt-3">No posts yet</h5>
                <p className="text-muted">Start creating your first post!</p>
                <Button variant="primary" href="/posts/create">
                  Create Post
                </Button>
              </div>
            </Tab.Pane>

            {/* Bookmarks Tab */}
            <Tab.Pane eventKey="bookmarks">
              <div className="text-center py-5">
                <BookmarkIcon style={{ fontSize: 80, color: '#cbd5e1' }} />
                <h5 className="text-muted mt-3">No bookmarks yet</h5>
                <p className="text-muted">Save your favorite posts to read later</p>
              </div>
            </Tab.Pane>

            {/* About Tab */}
            <Tab.Pane eventKey="about">
              <Card>
                <Card.Body className="p-4">
                  <h5 className="mb-3">About {user.username}</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <div className="text-muted mb-1">Username</div>
                      <div className="fw-semibold">{user.username}</div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="text-muted mb-1">Email</div>
                      <div className="fw-semibold">{user.email}</div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="text-muted mb-1">Bio</div>
                      <div className="fw-semibold">
                        {user.bio || 'No bio provided'}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-muted mb-1">Member Since</div>
                      <div className="fw-semibold">
                        {new Date().toLocaleDateString()}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-muted mb-1">Total Posts</div>
                      <div className="fw-semibold">0 posts</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>

      {/* Edit Profile Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            {/* Profile Picture */}
            <div className="text-center mb-4">
              <div className="profile-edit-avatar mx-auto">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Preview"
                    roundedCircle
                    fluid
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <PersonIcon style={{ fontSize: 60, color: '#6b7280' }} />
                  </div>
                )}
              </div>
              <Form.Group className="mt-3">
                <Form.Label className="btn btn-outline-primary btn-sm">
                  <EditIcon style={{ fontSize: 16, marginRight: 4 }} />
                  Change Photo
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </Form.Label>
              </Form.Group>
            </div>

            {/* Bio */}
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="bio"
                placeholder="Tell us about yourself..."
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.bio && !!formik.errors.bio}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.bio}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formik.values.bio.length}/500 characters
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;