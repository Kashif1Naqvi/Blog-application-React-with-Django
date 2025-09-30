import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/userService';

// Sample posts data
const userPosts = [
  {
    id: 1,
    title: "My First Blog Post",
    excerpt: "This is where I share my initial thoughts...",
    date: "September 28, 2025",
    likes: 12,
    comments: 5
  },
  {
    id: 2,
    title: "Learning Web Development",
    excerpt: "My journey through learning web development frameworks...",
    date: "September 15, 2025",
    likes: 24,
    comments: 8
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const apiBaseUrl = 'http://localhost:8000';
  
  const profilePictureUrl = user?.profile_picture
    ? user.profile_picture.startsWith('http')
      ? user.profile_picture
      : `${apiBaseUrl}${user.profile_picture}`
    : null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      bio: user?.bio || '',
      profile_picture: null as File | null,
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, 'Username must be at least 3 characters'),
      bio: Yup.string().max(500, 'Bio must be 500 characters or less'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        
        if (values.username !== user?.username) {
          formData.append('username', values.username);
        }
        
        if (values.bio !== user?.bio) {
          formData.append('bio', values.bio);
        }
        
        if (values.profile_picture) {
          formData.append('profile_picture', values.profile_picture);
        }
        
        await updateProfile(formData);
        await updateUserInfo();
        setOpenDialog(false);
      } catch (error) {
        console.error('Failed to update profile:', error);
      } finally {
        setLoading(false);
      }
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue('profile_picture', file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    formik.resetForm();
    setImagePreview(null);
  };
  
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: '#f8f9ff',
          border: '1px solid #e0e4f0',
          position: 'relative',
        }}
      >
        <Button 
          startIcon={<EditIcon />}
          variant="outlined"
          size="small"
          onClick={() => setOpenDialog(true)}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
          }}
        >
          Edit Profile
        </Button>
          
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar
              src={profilePictureUrl || undefined}
              alt={user.username}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
          <Grid item xs={12} sm>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 1, 
                fontSize: '1.1rem',
                fontStyle: user.bio ? 'normal' : 'italic'
              }}
            >
              {user.bio || "No bio provided yet."}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
          >
            <Tab label="Posts" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
            <Tab label="About" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
            <Tab label="Activity" id="profile-tab-2" aria-controls="profile-tabpanel-2" />
          </Tabs>
        </Box>
        
        {/* Posts Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                My Posts ({userPosts.length})
              </Typography>
              <Button variant="contained" color="primary">
                Create New Post
              </Button>
            </Box>

            {userPosts.length > 0 ? (
              <Grid container spacing={3}>
                {userPosts.map(post => (
                  <Grid item xs={12} key={post.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {post.excerpt}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Posted on {post.date}
                          </Typography>
                          <Box>
                            <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                              {post.likes} likes
                            </Typography>
                            <Typography variant="body2" component="span">
                              {post.comments} comments
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You haven't created any posts yet.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Create Your First Post
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>
        
        {/* About Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              About {user.username}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold">Bio</Typography>
                <Typography variant="body1" paragraph>
                  {user.bio || "No bio provided yet."}
                </Typography>
                
                <Typography variant="subtitle2" fontWeight="bold">Email</Typography>
                <Typography variant="body1" paragraph>
                  {user.email}
                </Typography>
                
                <Typography variant="subtitle2" fontWeight="bold">Member Since</Typography>
                <Typography variant="body1">
                  September 2025
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold">Stats</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body1">
                    Posts: {userPosts.length}
                  </Typography>
                  <Typography variant="body1">
                    Comments: 15
                  </Typography>
                  <Typography variant="body1">
                    Likes received: 36
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Activity Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Activity tracking feature coming soon!
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bio && Boolean(formik.errors.bio)}
              helperText={formik.touched.bio && formik.errors.bio}
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Profile Picture
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={imagePreview || profilePictureUrl || undefined}
                  alt={user.username}
                  sx={{ width: 80, height: 80 }}
                />
                
                <Button variant="contained" component="label" size="small">
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => formik.handleSubmit()} disabled={loading || !formik.dirty}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;