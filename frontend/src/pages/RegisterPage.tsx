import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { registerUser } from '../services/authService';

const steps = ['Account Details', 'Personal Information', 'Confirmation'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      password2: '',
      bio: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      password2: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
      bio: Yup.string().max(500, 'Bio must be 500 characters or less'),
    }),
    onSubmit: async (values) => {
      try {
        // We'll only register with the required fields from Django's perspective
        const { bio, ...accountData } = values;
        await registerUser(accountData);
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      } catch (err: any) {
        console.error('Registration error:', err);
        if (err.response?.data) {
          // Format Django REST Framework validation errors
          const errors = err.response.data;
          const errorMessages = Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    let canProceed = false;
    
    if (activeStep === 0) {
      // Validate account details
      if (
        formik.values.username && !formik.errors.username &&
        formik.values.email && !formik.errors.email &&
        formik.values.password && !formik.errors.password &&
        formik.values.password2 && !formik.errors.password2
      ) {
        canProceed = true;
      } else {
        // Touch all fields to show validation errors
        formik.setTouched({
          username: true,
          email: true,
          password: true,
          password2: true,
        });
      }
    } else if (activeStep === 1) {
      // Bio is optional, so we can proceed
      canProceed = true;
    }
    
    if (canProceed) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 550,
        mx: 'auto',
        py: 4,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
          Create Account
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Join our community of writers and readers
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          {activeStep === 0 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="password2"
                autoComplete="new-password"
                value={formik.values.password2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password2 && Boolean(formik.errors.password2)}
                helperText={formik.touched.password2 && formik.errors.password2}
              />
            </>
          )}
          
          {activeStep === 1 && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Tell us about yourself (Optional)
              </Typography>
              
              <TextField
                margin="normal"
                fullWidth
                id="bio"
                name="bio"
                label="Bio"
                multiline
                rows={4}
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={formik.touched.bio && formik.errors.bio}
                placeholder="Share a little about yourself..."
              />
            </>
          )}
          
          {activeStep === 2 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Almost there!
              </Typography>
              
              <Typography variant="body1" paragraph>
                Please review your information before submitting:
              </Typography>
              
              <Box sx={{ textAlign: 'left', mb: 3, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography><strong>Username:</strong> {formik.values.username}</Typography>
                <Typography><strong>Email:</strong> {formik.values.email}</Typography>
                {formik.values.bio && (
                  <Typography>
                    <strong>Bio:</strong> {formik.values.bio.substring(0, 100)}
                    {formik.values.bio.length > 100 ? '...' : ''}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                By clicking "Complete Registration", you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Registering...' : 'Complete Registration'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2" fontWeight="medium">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;