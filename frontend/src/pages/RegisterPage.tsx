import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Avatar, IconButton } from '@mui/material';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessage = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col lg={5} md={7} sm={10}>
            <Card className="border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                {/* Icon */}
                <div className="text-center mb-4">
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      margin: '0 auto',
                      background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    }}
                  >
                    <PersonAddIcon style={{ fontSize: 32 }} />
                  </Avatar>
                  <h2 className="fw-bold mt-3 mb-1">Create Account</h2>
                  <p className="text-muted">Join our community today</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {/* Register Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="Username">
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        disabled={loading}
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FloatingLabel label="Email Address">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        disabled={loading}
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3 position-relative">
                    <FloatingLabel label="Password">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        disabled={loading}
                      />
                    </FloatingLabel>
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4 position-relative">
                    <FloatingLabel label="Confirm Password">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        disabled={loading}
                      />
                    </FloatingLabel>
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="terms"
                      label={
                        <span>
                          I agree to the{' '}
                          <Link to="/terms" className="text-decoration-none">
                            Terms & Conditions
                          </Link>
                        </span>
                      }
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="w-100 fw-semibold"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                      border: 'none',
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </Form>

                {/* Links */}
                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Footer */}
            <div className="text-center mt-4">
              <AutoStoriesIcon style={{ fontSize: 32, color: '#0d9488' }} />
              <p className="text-muted mt-2">
                <small>© 2025 Blog App. All rights reserved.</small>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;