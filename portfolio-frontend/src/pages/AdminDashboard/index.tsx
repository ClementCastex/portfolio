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
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
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
  
  // Nouveaux états pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date_desc');

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

  // Filtrer et trier les projets
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !selectedStatus || project.status === selectedStatus;
      const matchesCategory = !selectedCategory || project.categories.includes(selectedCategory);
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'likes_asc':
          return a.likeTotal - b.likeTotal;
        case 'likes_desc':
          return b.likeTotal - a.likeTotal;
        case 'date_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

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

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Projets</Typography>
            <Typography variant="h4">{projects.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Likes</Typography>
            <Typography variant="h4">{projects.reduce((sum, project) => sum + project.likeTotal, 0)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Projets Terminés</Typography>
            <Typography variant="h4">{projects.filter(p => p.status === 'completed').length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">En Cours</Typography>
            <Typography variant="h4">{projects.filter(p => p.status === 'in_progress').length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtres et recherche */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Rechercher"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={selectedStatus}
              label="Statut"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="completed">Terminé</MenuItem>
              <MenuItem value="in_progress">En cours</MenuItem>
              <MenuItem value="abandoned">Abandonné</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={selectedCategory}
              label="Catégorie"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Trier par</InputLabel>
            <Select
              value={sortBy}
              label="Trier par"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date_desc">Date (Plus récent)</MenuItem>
              <MenuItem value="date_asc">Date (Plus ancien)</MenuItem>
              <MenuItem value="title_asc">Titre (A-Z)</MenuItem>
              <MenuItem value="title_desc">Titre (Z-A)</MenuItem>
              <MenuItem value="likes_desc">Likes (Plus populaire)</MenuItem>
              <MenuItem value="likes_asc">Likes (Moins populaire)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Images</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Catégories</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {project.likeTotal}
                    </Typography>
                    <FavoriteIcon fontSize="small" color="primary" />
                  </Box>
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