import { ReactNode } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Toolbar, 
  Typography, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 260;

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Blog App
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Share your stories
        </Typography>
      </Box>

      {isAuthenticated && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ 
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #eff6ff 0%, #f3f4f6 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: 'primary.main',
                  fontWeight: 600
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
      
      <Divider sx={{ mx: 2 }} />
      
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        <ListItem disablePadding>
          <ListItemButton 
            component={RouterLink} 
            to="/"
            selected={location.pathname === '/'}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
            />
          </ListItemButton>
        </ListItem>
        
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/profile"
                selected={location.pathname === '/profile'}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="My Profile" 
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="My Posts" 
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                />
                <Chip label="Soon" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <BookmarkIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Saved" 
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/login"
                selected={location.pathname === '/login'}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Login" 
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/register"
                selected={location.pathname === '/register'}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon>
                  <AppRegistrationIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Register" 
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => logout()}
            sx={{ 
              borderRadius: 2,
              py: 1,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 800,
              letterSpacing: '0.5px',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Blog App
          </Typography>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                  component={RouterLink}
                  to="/profile"
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Button 
                  color="inherit" 
                  onClick={() => logout()}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained"
                  component={RouterLink} 
                  to="/register"
                  startIcon={<AppRegistrationIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar and Content Area */}
      <Box 
        component="div" 
        sx={{ 
          display: 'flex',
          flexGrow: 1,
          pt: { xs: '64px', sm: '70px' },
        }}
      >
        {/* Sidebar */}
        <Box component="nav">
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: DRAWER_WIDTH,
                },
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: DRAWER_WIDTH,
                  pt: { xs: '64px', sm: '70px' },
                },
              }}
              open
            >
              {drawerContent}
            </Drawer>
          )}
        </Box>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          px: 3,
          mt: 'auto', 
          background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ maxWidth: 300 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1.5,
                  background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Blog App
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Share your thoughts with the world. Connect, inspire, and grow together.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Quick Links
              </Typography>
              <Stack spacing={0.5}>
                <Button 
                  component={RouterLink} 
                  to="/" 
                  size="small" 
                  color="inherit"
                  sx={{ 
                    justifyContent: 'flex-start', 
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Home
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/about" 
                  size="small" 
                  color="inherit"
                  sx={{ 
                    justifyContent: 'flex-start', 
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  About
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/contact" 
                  size="small" 
                  color="inherit"
                  sx={{ 
                    justifyContent: 'flex-start', 
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Contact
                </Button>
              </Stack>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
              © {new Date().getFullYear()} Blog App. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;