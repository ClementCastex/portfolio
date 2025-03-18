import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { 
  GitHub, 
  Language, 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import { RootState } from '../../store';
import { fetchProjects } from '../../store/slices/projectSlice';
import { addBookmark, removeBookmark, fetchBookmarks } from '../../store/slices/bookmarkSlice';
import ProjectForm from '../../components/ProjectForm';
import { API_BASE_URL } from '../../config/api';

const getFullImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading, error } = useSelector((state: RootState) => state.projects);
  const { bookmarks, loading: bookmarksLoading } = useSelector((state: RootState) => state.bookmarks);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects() as any);
    if (token) {
      dispatch(fetchBookmarks() as any);
    }
  }, [dispatch, token]);

  const isLiked = (projectId: number) => {
    return bookmarks.some(bookmark => bookmark.project.id === projectId);
  };

  const handleLikeToggle = (projectId: number) => {
    if (!token) {
      navigate('/login');
      return;
    }

    const bookmark = bookmarks.find(b => b.project.id === projectId);
    if (bookmark) {
      dispatch(removeBookmark(bookmark.id) as any);
    } else {
      dispatch(addBookmark(projectId) as any);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'abandoned':
        return 'error';
      default:
        return 'default';
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (projectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h2">
          Mes Projets
        </Typography>
        {user?.roles?.includes('ROLE_ADMIN') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            sx={{
              color: 'white',
              '&:hover': {
                color: 'white',
              }
            }}
          >
            Ajouter un projet
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {project.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getFullImageUrl(project.images[0])}
                  alt={project.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.shortDescription}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                    sx={{
                      color: 'white',
                      '& .MuiChip-label': {
                        color: 'white',
                      }
                    }}
                  />
                  {project.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    size="small"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    variant="contained"
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'white',
                      }
                    }}
                  >
                    Voir plus
                  </Button>
                  {project.githubUrl && (
                    <Tooltip title="Voir sur GitHub">
                      <IconButton
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{
                          color: 'white',
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }}
                      >
                        <GitHub />
                      </IconButton>
                    </Tooltip>
                  )}
                  {project.websiteUrl && (
                    <Tooltip title="Voir le site web">
                      <IconButton
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{
                          color: 'white',
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }}
                      >
                        <Language />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {token && (
                  <Tooltip title={isLiked(project.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>
                    <IconButton
                      onClick={() => handleLikeToggle(project.id)}
                      size="small"
                      color={isLiked(project.id) ? "primary" : "default"}
                      sx={{
                        ...(isLiked(project.id) && {
                          color: 'white',
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        })
                      }}
                    >
                      {isLiked(project.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {token && (
        <ProjectForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            dispatch(fetchProjects() as any);
            setIsFormOpen(false);
          }}
          token={token}
        />
      )}
    </Container>
  );
};

export default Projects; 