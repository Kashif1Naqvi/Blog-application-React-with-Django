import { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getPosts, getTags, type Post, type Tag } from '../services/blogService';

const PostsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-created_at');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedTag, ordering, currentPage]);

  const loadTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        ordering,
      };
      
      if (searchQuery) params.search = searchQuery;
      if (selectedTag) params.tag = selectedTag;
      
      const data = await getPosts(params);
      setPosts(data.results);
      setTotalPages(Math.ceil(data.count / 10));
      
      // Update URL params
      const newParams: any = {};
      if (searchQuery) newParams.search = searchQuery;
      if (selectedTag) newParams.tag = selectedTag;
      if (ordering !== '-created_at') newParams.ordering = ordering;
      if (currentPage > 1) newParams.page = String(currentPage);
      setSearchParams(newParams);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleTagChange = (tagSlug: string) => {
    setSelectedTag(tagSlug);
    setCurrentPage(1);
  };

  const handleOrderingChange = (value: string) => {
    setOrdering(value);
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Discover Posts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore the latest articles from our community
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={ordering}
              label="Sort By"
              onChange={(e) => handleOrderingChange(e.target.value)}
            >
              <MenuItem value="-created_at">Latest</MenuItem>
              <MenuItem value="-published_at">Recently Published</MenuItem>
              <MenuItem value="-views_count">Most Viewed</MenuItem>
              <MenuItem value="-likes_count">Most Liked</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        
        {/* Tags Filter */}
        {tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="All"
                onClick={() => handleTagChange('')}
                color={selectedTag === '' ? 'primary' : 'default'}
                variant={selectedTag === '' ? 'filled' : 'outlined'}
              />
              {tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  onClick={() => handleTagChange(tag.slug)}
                  color={selectedTag === tag.slug ? 'primary' : 'default'}
                  variant={selectedTag === tag.slug ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Posts Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No posts found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} lg={4} key={post.id}>
                <Card
                  component={RouterLink}
                  to={`/posts/${post.id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {post.featured_image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.featured_image}
                      alt={post.title}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      {post.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" />
                      ))}
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto' }}>
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">{post.reading_time} min</Typography>
                      </Stack>
                    </Stack>
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                      {post.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem' }}>
                          {post.author.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {post.author.username}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1.5}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <FavoriteIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption">{post.likes_count}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption">{post.comments_count}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PostsListPage;