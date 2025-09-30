import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import { createPost, updatePost, getPost } from '../services/blogService';

const PostFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      featured_image: null as File | null,
      tags: [] as string[],
      status: 'draft' as 'draft' | 'published',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be less than 200 characters'),
      content: Yup.string()
        .required('Content is required')
        .min(50, 'Content must be at least 50 characters'),
      excerpt: Yup.string()
        .max(500, 'Excerpt must be less than 500 characters'),
      status: Yup.string().oneOf(['draft', 'published']).required(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('excerpt', values.excerpt);
        formData.append('status', values.status);
        
        if (values.featured_image) {
          formData.append('featured_image', values.featured_image);
        }
        
        if (values.tags.length > 0) {
          values.tags.forEach(tag => {
            formData.append('tags', tag);
          });
        }
        
        if (isEditing) {
          await updatePost(Number(id), formData);
        } else {
          await createPost(formData);
        }
        
        navigate('/my-posts');
      } catch (err: any) {
        console.error('Error saving post:', err);
        setError(err.response?.data?.message || 'Failed to save post. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const post = await getPost(Number(id));
      
      formik.setValues({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featured_image: null,
        tags: post.tags.map(tag => tag.name),
        status: post.status,
      });
      
      if (post.featured_image) {
        setImagePreview(post.featured_image);
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue('featured_image', file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formik.values.tags.includes(trimmedTag)) {
      formik.setFieldValue('tags', [...formik.values.tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags.filter(tag => tag !== tagToRemove)
    );
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  if (loading && isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isEditing ? 'Update your post details' : 'Share your thoughts with the community'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          {/* Title */}
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            placeholder="Enter an engaging title for your post"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 3 }}
          />

          {/* Content */}
          <TextField
            fullWidth
            id="content"
            name="content"
            label="Content"
            placeholder="Write your post content here..."
            multiline
            rows={12}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
            sx={{ mb: 3 }}
          />

          {/* Excerpt */}
          <TextField
            fullWidth
            id="excerpt"
            name="excerpt"
            label="Excerpt (Optional)"
            placeholder="Brief summary of your post"
            multiline
            rows={3}
            value={formik.values.excerpt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.excerpt && Boolean(formik.errors.excerpt)}
            helperText={
              formik.touched.excerpt && formik.errors.excerpt
                ? formik.errors.excerpt
                : 'Leave empty to auto-generate from content'
            }
            sx={{ mb: 3 }}
          />

          {/* Featured Image */}
          <Box sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
              Featured Image
            </FormLabel>
            
            {imagePreview && (
              <Card sx={{ mb: 2, maxWidth: 400, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Preview"
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                  size="small"
                  onClick={() => {
                    setImagePreview(null);
                    formik.setFieldValue('featured_image', null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Card>
            )}
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
            >
              {imagePreview ? 'Change Image' : 'Upload Image'}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {/* Tags */}
          <Box sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
              Tags
            </FormLabel>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              {formik.values.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
            
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
              />
              <Button variant="outlined" onClick={handleAddTag} size="small">
                Add Tag
              </Button>
            </Stack>
          </Box>

          {/* Status */}
          <FormControl sx={{ mb: 4 }}>
            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Status</FormLabel>
            <RadioGroup
              row
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
            >
              <FormControlLabel
                value="draft"
                control={<Radio />}
                label="Save as Draft"
              />
              <FormControlLabel
                value="published"
                control={<Radio />}
                label="Publish Now"
              />
            </RadioGroup>
          </FormControl>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            
            {formik.values.status === 'draft' ? (
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading || !formik.isValid}
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <PublishIcon />}
                disabled={loading || !formik.isValid}
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostFormPage;