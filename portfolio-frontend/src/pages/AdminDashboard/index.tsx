import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import {
  fetchProjects,
  deleteProject,
} from '../../store/slices/projectSlice';
import { Project } from '../../types';
import ProjectForm from '../../components/ProjectForm';
import { API_BASE_URL } from '../../config/api';

const getFullImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (token) {
      if (user?.roles?.includes('ROLE_ADMIN')) {
        dispatch(fetchProjects() as any);
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [dispatch, token, user, navigate]);

  const handleOpenForm = (project?: Project) => {
    setEditingProject(project || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      dispatch(deleteProject(projectId) as any);
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

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap(project => project.categories)));

  if (!token || !user?.roles?.includes('ROLE_ADMIN')) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Accès non autorisé
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Gestion des Projets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{
            color: 'white',
            '&:hover': {
              color: 'white',
            }
          }}
        >
          Ajouter un projet
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Images</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Catégories</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  {project.images.length > 0 ? (
                    <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                      {project.images.map((image, index) => (
                        <Tooltip key={index} title={`Image ${index + 1}`}>
                          <Avatar
                            src={getFullImageUrl(image)}
                            variant="rounded"
                            sx={{
                              width: 60,
                              height: 60,
                              '& img': { objectFit: 'cover' }
                            }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 60, height: 60 }}>
                      <ImageIcon />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.shortDescription}</TableCell>
                <TableCell>
                  <Chip
                    label={project.status.replace('_', ' ')}
                    color={getStatusColor(project.status)}
                  />
                </TableCell>
                <TableCell>
                  {project.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenForm(project)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteProject(project.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {token && (
        <ProjectForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSuccess={() => {
            dispatch(fetchProjects() as any);
            handleCloseForm();
          }}
          token={token}
          project={editingProject || undefined}
          existingTags={allTags}
        />
      )}
    </Container>
  );
};

export default AdminDashboard; 