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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
      {/* Header with Icon */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            }}
          >
            <TrendingUpIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" fontWeight={700}>
            Discover Posts
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ ml: 8 }}>
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
                  <SearchIcon color="primary" />
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
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(13, 148, 136, 0.15)',
                      borderColor: 'primary.main',
                      '& .post-image': {
                        transform: 'scale(1.08)',
                      },
                    },
                  }}
                >
                  {/* Compact Image */}
                  {post.featured_image && (
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 180 }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={post.featured_image}
                        alt={post.title}
                        className="post-image"
                        sx={{
                          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          objectFit: 'cover',
                        }}
                      />

                      {/* Status Badge */}
                      <Chip
                        label={post.status}
                        size="small"
                        color={post.status === 'published' ? 'success' : 'default'}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 24,
                        }}
                      />

                      {/* Quick Actions */}
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            width: 32,
                            height: 32,
                            '&:hover': {
                              bgcolor: 'white',
                              transform: 'scale(1.1)',
                            },
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <FavoriteBorderIcon
                            sx={{
                              fontSize: 16,
                              color: post.is_liked ? 'error.main' : 'text.secondary',
                            }}
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            width: 32,
                            height: 32,
                            '&:hover': {
                              bgcolor: 'white',
                              transform: 'scale(1.1)',
                            },
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <BookmarkBorderIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        </IconButton>
                      </Stack>
                    </Box>
                  )}
                  
                  {/* Compact Content */}
                  <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                    {/* Tags */}
                    <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                      {post.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            bgcolor: 'primary.50',
                            color: 'primary.main',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                    
                    {/* Title */}
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mb: 1.5,
                        lineHeight: 1.3,
                        fontSize: '1.05rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6em',
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    {/* Excerpt */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: '0.875rem',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.8em',
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                    
                    {/* Inline Stats */}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{
                        py: 1.5,
                        px: 1.5,
                        mx: -1.5,
                        mb: 1.5,
                        bgcolor: 'grey.50',
                        borderRadius: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                          {post.reading_time}m
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FavoriteIcon sx={{ fontSize: 14, color: 'error.main' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                          {post.likes_count}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                          {post.comments_count}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto' }}>
                        <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                          {post.views_count}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    {/* Compact Author */}
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                        {post.author.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            fontSize: '0.8125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {post.author.username}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: 'primary.50',
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ShareIcon sx={{ fontSize: 16 }} />
                      </IconButton>
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