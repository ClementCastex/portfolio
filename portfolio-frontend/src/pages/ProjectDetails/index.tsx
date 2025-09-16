import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Link,
  Button,
  Modal,
} from '@mui/material';
import {
  GitHub,
  Language,
  ArrowBack,
  ArrowForward,
  ArrowBackIos,
  ArrowForwardIos,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import { fetchProjects } from '../../store/slices/projectSlice';
import { API_BASE_URL } from '../../config/api';
import { useProjectsWithLikes } from '../../hooks/useProjectsWithLikes';

const getFullImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const { token } = useSelector((state: RootState) => state.auth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLiked, handleLikeToggle } = useProjectsWithLikes();

  useEffect(() => {
    dispatch(fetchProjects() as any);
  }, [dispatch]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const project = projects.find(p => p.id === parseInt(id || '0'));

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Project not found
        </Typography>
        <Box mt={2}>
          <Link
            component="button"
            variant="h6"
            onClick={() => navigate('/projects')}
            sx={{ textDecoration: 'none' }}
          >
            Retour aux projets
          </Link>
        </Box>
      </Container>
    );
  }

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
        {/* Header avec titre, bouton retour et like */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/projects')} sx={{ color: 'primary.main' }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1">
              {project.title}
            </Typography>
          </Box>
          
          {/* Bouton like et compteur */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? '#CCAA1D' : 'inherit'
            }}>
              {project.likes || 0}
            </Typography>
            <IconButton
              onClick={() => handleLikeToggle(project.id)}
              sx={{
                color: (theme) => theme.palette.mode === 'dark' ? '#CCAA1D' : (isLiked(project.id) ? 'primary.main' : 'inherit'),
                '&:hover': {
                  color: (theme) => theme.palette.mode === 'dark' ? '#CCAA1D' : 'primary.main',
                },
              }}
            >
              {isLiked(project.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Colonne de gauche pour les images */}
          <Grid item xs={12} md={6}>
            {project.images.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                <Card 
                  sx={{ 
                    width: '100%', 
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={getFullImageUrl(project.images[currentImageIndex])}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
                
                {project.images.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                      }}
                      onClick={handlePrevImage}
                    >
                      <ArrowBackIos sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                      }}
                      onClick={handleNextImage}
                    >
                      <ArrowForwardIos sx={{ color: 'white' }} />
                    </IconButton>
                  </>
                )}

                {/* Miniatures */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mt: 2, 
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    height: 8,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }}>
                  {project.images.map((image, index) => (
                    <Card 
                      key={index} 
                      sx={{ 
                        minWidth: 100,
                        border: currentImageIndex === index ? '2px solid #5B348B' : 'none',
                        cursor: 'pointer',
                        borderRadius: 1,
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        height="60"
                        image={getFullImageUrl(image)}
                        alt={`Miniature ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                height: 400, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
              }}>
                <Typography variant="h6" color="text.secondary">
                  Aucune image disponible
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Colonne de droite pour les informations */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Status et catégories */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={project.status === 'in_progress' ? 'En cours' : 
                           project.status === 'completed' ? 'Terminé' : 'Abandonné'}
                    color={getStatusColor(project.status.toLowerCase())}
                  />
                  {project.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      variant="outlined"
                      sx={{ borderColor: '#5B348B', color: 'text.primary' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Liens */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {project.githubUrl && (
                    <Button
                      variant="contained"
                      startIcon={<GitHub />}
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: 'white',
                        '&:hover': {
                          color: 'white',
                        }
                      }}
                    >
                      GitHub
                    </Button>
                  )}
                  {project.websiteUrl && (
                    <Button
                      variant="contained"
                      startIcon={<Language />}
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: 'white',
                        '&:hover': {
                          color: 'white',
                        }
                      }}
                    >
                      Demo
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Description courte */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: (theme) => theme.palette.mode === 'dark' 
                    ? '#CCAA1D' 
                    : 'primary.main'
                }}>
                  Description courte
                </Typography>
                <Typography paragraph sx={{ color: 'text.primary' }}>
                  {project.shortDescription}
                </Typography>
              </Box>

              {/* Description détaillée */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: (theme) => theme.palette.mode === 'dark' 
                    ? '#CCAA1D' 
                    : 'primary.main'
                }}>
                  Description détaillée
                </Typography>
                <Typography 
                  paragraph 
                  sx={{ 
                    color: 'text.primary',
                    lineHeight: 1.8,
                  }}
                >
                  {project.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Modal pour l'affichage en plein écran */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={getFullImageUrl(project.images[currentImageIndex])}
            alt={`${project.title} - Image ${currentImageIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default ProjectDetails; 