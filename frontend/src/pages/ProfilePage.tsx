import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Spinner, Alert, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/userService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Typography, Avatar, Chip, IconButton } from '@mui/material';
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
    <div className="profile-page-modern">
      {/* Hero Section with Cover */}
      <section className="profile-hero-modern">
        <div className="profile-cover-gradient"></div>
        <Container>
          <div className="profile-main-card">
            {/* Profile Header */}
            <div className="profile-header-modern">
              <div className="profile-avatar-section">
                <div className="profile-avatar-modern">
                  {user.profile_picture ? (
                    <Image 
                      src={user.profile_picture} 
                      alt={user.username}
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder-modern">
                      <PersonIcon className="placeholder-icon" />
                    </div>
                  )}
                  <div className="profile-status-indicator online"></div>
                </div>
                
                <Button 
                  className="profile-edit-btn"
                  onClick={() => setShowEditModal(true)}
                >
                  <EditIcon className="me-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="profile-info-modern">
                <div className="profile-name-section">
                  <h1 className="profile-name-modern">{user.username}</h1>
                  <Chip 
                    label="Member" 
                    className="profile-badge"
                    size="small"
                  />
                </div>

                <div className="profile-details-grid">
                  <div className="detail-item">
                    <EmailIcon className="detail-icon" />
                    <span className="detail-text">{user.email}</span>
                  </div>
                  <div className="detail-item">
                    <CalendarTodayIcon className="detail-icon" />
                    <span className="detail-text">
                      Joined {new Date().toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  {user.bio && (
                    <div className="detail-item full-width">
                      <PersonIcon className="detail-icon" />
                      <span className="detail-text">{user.bio}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Alerts */}
      <Container className="mt-4">
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')} className="modern-alert success">
            <div className="alert-content">
              <div className="alert-icon">✅</div>
              <div>{success}</div>
            </div>
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="modern-alert error">
            <div className="alert-content">
              <div className="alert-icon">❌</div>
              <div>{error}</div>
            </div>
          </Alert>
        )}
      </Container>

      {/* About Section */}
      <Container className="mt-5 mb-5">
        <Card className="modern-content-card">
          <Card.Body className="about-content">
            <h4 className="about-title">About {user.username}</h4>
            
            <div className="about-grid-single">
              <div className="about-section">
                <h6 className="about-section-title">
                  <PersonIcon className="section-icon" />
                  Personal Information
                </h6>
                <div className="about-details">
                  <div className="about-item">
                    <span className="about-label">Username:</span>
                    <span className="about-value">{user.username}</span>
                  </div>
                  <div className="about-item">
                    <span className="about-label">Email:</span>
                    <span className="about-value">{user.email}</span>
                  </div>
                  <div className="about-item">
                    <span className="about-label">Bio:</span>
                    <span className="about-value">
                      {user.bio || 'No bio provided yet. Click "Edit Profile" to add one!'}
                    </span>
                  </div>
                  <div className="about-item">
                    <span className="about-label">Member Since:</span>
                    <span className="about-value">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="profile-cta">
              <div className="cta-content">
                <h5 className="cta-title">Complete Your Profile</h5>
                <p className="cta-description">
                  Add a bio to tell others about yourself and make your profile more engaging!
                </p>
                <Button 
                  className="cta-btn"
                  onClick={() => setShowEditModal(true)}
                >
                  <EditIcon className="me-2" />
                  Update Profile
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Modern Edit Profile Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
        className="modern-profile-modal"
      >
        <div className="modal-content-modern">
          <Modal.Header className="modal-header-modern">
            <div className="modal-title-section">
              <EditIcon className="modal-icon" />
              <h4 className="modal-title">Edit Profile</h4>
            </div>
            <IconButton 
              onClick={() => setShowEditModal(false)}
              className="modal-close-btn"
            >
              <CloseIcon />
            </IconButton>
          </Modal.Header>

          <Form onSubmit={formik.handleSubmit}>
            <Modal.Body className="modal-body-modern">
              {/* Profile Picture Section */}
              <div className="edit-avatar-section">
                <div className="edit-avatar-preview">
                  {imagePreview ? (
                    <Image 
                      src={imagePreview} 
                      alt="Preview"
                      className="preview-image"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <PersonIcon className="placeholder-icon-large" />
                    </div>
                  )}
                  <div className="avatar-overlay">
                    <CameraAltIcon className="camera-icon" />
                  </div>
                </div>

                <div className="avatar-actions">
                  <Form.Label className="upload-btn">
                    <CameraAltIcon className="me-2" />
                    Change Photo
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </Form.Label>
                  <p className="upload-hint">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="edit-bio-section">
                <Form.Group>
                  <Form.Label className="modern-form-label">
                    <PersonIcon className="label-icon" />
                    Bio
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.bio && !!formik.errors.bio}
                    className="modern-textarea"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bio}
                  </Form.Control.Feedback>
                  <div className="character-count">
                    <span className={formik.values.bio.length > 400 ? 'warning' : ''}>
                      {formik.values.bio.length}/500 characters
                    </span>
                  </div>
                </Form.Group>
              </div>
            </Modal.Body>

            <Modal.Footer className="modal-footer-modern">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={loading}
                className="cancel-btn"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                className="save-btn"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="me-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;