import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsListPage from './pages/PostsListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';
import MyPostsPage from './pages/MyPostsPage';
import ProfilePage from './pages/ProfilePage';

// Modern Professional Theme - Teal & Emerald
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d9488', // Teal-600
      light: '#14b8a6', // Teal-500
      dark: '#0f766e', // Teal-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Emerald-500
      light: '#34d399', // Emerald-400
      dark: '#059669', // Emerald-600
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafb', // Gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Gray-900
      secondary: '#6b7280', // Gray-500
    },
    success: {
      main: '#10b981', // Emerald-500
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444', // Red-500
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b', // Amber-500
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0d9488', // Teal-600
      light: '#14b8a6',
      dark: '#0f766e',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
      color: '#111827',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      color: '#111827',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.125rem',
      letterSpacing: '-0.015em',
      lineHeight: 1.25,
      color: '#111827',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.35,
      color: '#111827',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.375rem',
      lineHeight: 1.45,
      color: '#111827',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: '#111827',
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.75,
      fontWeight: 500,
      color: '#374151',
    },
    subtitle2: {
      fontSize: '1rem',
      lineHeight: 1.65,
      fontWeight: 500,
      color: '#4b5563',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
      color: '#374151',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.65,
      color: '#6b7280',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: '0.9375rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontWeight: 500,
      color: '#6b7280',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#0d9488 #f3f4f6',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 10,
            height: 10,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#0d9488',
            minHeight: 24,
            border: '2px solid #f3f4f6',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#0f766e',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#f3f4f6',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px -10px rgba(13, 148, 136, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
            boxShadow: '0 12px 24px -12px rgba(13, 148, 136, 0.5)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#0d9488',
          color: '#0d9488',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#0f766e',
            backgroundColor: 'rgba(13, 148, 136, 0.04)',
          },
        },
        text: {
          color: '#0d9488',
          '&:hover': {
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
          borderRadius: 12,
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          backgroundColor: '#ffffff',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 25px -5px rgb(13 148 136 / 0.15), 0 8px 10px -6px rgb(13 148 136 / 0.1)',
            borderColor: 'rgba(13, 148, 136, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          border: '1px solid #d1d5db',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.3s ease',
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#d1d5db',
              borderWidth: '2px',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: '#9ca3af',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: '#0d9488',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#6b7280',
            '&.Mui-focused': {
              color: '#0d9488',
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8125rem',
          height: 30,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
          color: '#ffffff',
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#0d9488',
          color: '#0d9488',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: '3px solid #ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          minHeight: 48,
          borderRadius: '10px 10px 0 0',
          transition: 'all 0.3s ease',
          color: '#6b7280',
          '&.Mui-selected': {
            color: '#0d9488',
            background: 'linear-gradient(to top, rgba(13, 148, 136, 0.08), transparent)',
          },
          '&:hover': {
            backgroundColor: 'rgba(13, 148, 136, 0.04)',
            color: '#0d9488',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.9375rem',
          fontWeight: 500,
          padding: '12px 16px',
          border: '2px solid',
        },
        standardSuccess: {
          backgroundColor: '#ecfdf5',
          color: '#047857',
          borderColor: '#a7f3d0',
        },
        standardError: {
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          borderColor: '#fecaca',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          color: '#b45309',
          borderColor: '#fde68a',
        },
        standardInfo: {
          backgroundColor: '#f0fdfa',
          color: '#115e59',
          borderColor: '#99f6e4',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 12px',
          padding: '10px 16px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            color: '#0d9488',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)',
            },
            '& .MuiListItemIcon-root': {
              color: '#0d9488',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(13, 148, 136, 0.06)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e5e7eb',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/posts" element={<PostsListPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route 
                path="/posts/create" 
                element={
                  <ProtectedRoute>
                    <PostFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/posts/edit/:id" 
                element={
                  <ProtectedRoute>
                    <PostFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts" 
                element={
                  <ProtectedRoute>
                    <MyPostsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
