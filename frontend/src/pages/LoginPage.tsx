import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Avatar, IconButton, InputAdornment } from '@mui/material';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
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
                    <LockOutlinedIcon style={{ fontSize: 32 }} />
                  </Avatar>
                  <h2 className="fw-bold mt-3 mb-1">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue to your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="Username or Email">
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Username or Email"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        disabled={loading}
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FloatingLabel label="Password">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        disabled={loading}
                      />
                    </FloatingLabel>
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember"
                      label="Remember me"
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
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>

                {/* Links */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-2">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </p>
                  <p className="text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                      Sign up
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

export default LoginPage;