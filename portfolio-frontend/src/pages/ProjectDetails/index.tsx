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
} from '@mui/icons-material';
import { RootState } from '../../store';
import { fetchProjects } from '../../store/slices/projectSlice';
import { API_BASE_URL } from '../../config/api';

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

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects() as any);
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Veuillez vous connecter pour voir les détails du projet
        </Alert>
      </Container>
    );
  }

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
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 3 }}
      >
        Retour aux projets
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Colonne de gauche pour les images */}
          <Grid item xs={12} md={6}>
            {project.images.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                <Card 
                  sx={{ width: '100%', cursor: 'pointer' }}
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
                        border: currentImageIndex === index ? '2px solid #9370DB' : 'none',
                        cursor: 'pointer',
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
              <Box 
                sx={{ 
                  height: 400, 
                  backgroundColor: 'rgba(0,0,0,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Aucune image disponible
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Colonne de droite pour les informations */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%' }}>
              <Typography variant="h3" gutterBottom>
                {project.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip
                  label={project.status.replace('_', ' ')}
                  color={getStatusColor(project.status)}
                />
                {project.categories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    variant="outlined"
                  />
                ))}
              </Box>

              {(project.websiteUrl || project.githubUrl) && (
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  {project.websiteUrl && (
                    <Button
                      variant="contained"
                      startIcon={<Language />}
                      onClick={() => window.open(project.websiteUrl, '_blank')}
                    >
                      Voir le site
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="outlined"
                      startIcon={<GitHub />}
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      Code source
                    </Button>
                  )}
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Description courte
                </Typography>
                <Typography paragraph>
                  {project.shortDescription}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" gutterBottom>
                  Description détaillée
                </Typography>
                <Typography paragraph>
                  {project.longDescription}
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
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: -40,
              top: -40,
              color: 'white',
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
          
          {project.images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProjectDetails; 