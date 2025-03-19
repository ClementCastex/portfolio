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
  useTheme,
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
import { darkInputStyle, lightInputStyle, commonButtonStyle } from '../../theme/styles';

const getFullImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

type SortOption = 'title_asc' | 'title_desc' | 'likes_asc' | 'likes_desc' | 'date_asc' | 'date_desc';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Nouveaux états pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [allTags, setAllTags] = useState<string[]>([]);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#F7F3F7',
      '&.Mui-focused': {
        color: '#F7F3F7',
      },
    },
    '& .MuiInputBase-input': {
      color: '#F7F3F7',
    },
    '& .MuiSelect-icon': {
      color: '#F7F3F7',
    },
  };

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

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (projectId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      await dispatch(deleteProject(projectId) as any);
      dispatch(fetchProjects() as any);
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
  useEffect(() => {
    const uniqueTags = Array.from(new Set(projects.flatMap(project => project.categories)));
    setAllTags(uniqueTags);
  }, [projects]);

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
          return a.likes - b.likes;
        case 'likes_desc':
          return b.likes - a.likes;
        case 'date_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const totalLikes = projects.reduce((sum, project) => sum + (project.likes || 0), 0);
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;

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
          onClick={() => {
            setSelectedProject(null);
            setIsFormOpen(true);
          }}
          sx={commonButtonStyle}
        >
          Ajouter un projet
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Projets</Typography>
            <Typography variant="h4">{totalProjects}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Likes</Typography>
            <Typography variant="h4">{totalLikes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Projets Terminés</Typography>
            <Typography variant="h4">{completedProjects}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">En Cours</Typography>
            <Typography variant="h4">{inProgressProjects}</Typography>
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
              startAdornment: <SearchIcon color="action" sx={{ color: isDarkMode ? '#F7F3F7' : '#23272A', mr: 1 }} />,
            }}
            sx={isDarkMode ? darkInputStyle : lightInputStyle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth sx={isDarkMode ? darkInputStyle : lightInputStyle}>
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
          <FormControl fullWidth sx={isDarkMode ? darkInputStyle : lightInputStyle}>
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
          <FormControl fullWidth sx={isDarkMode ? darkInputStyle : lightInputStyle}>
            <InputLabel>Trier par</InputLabel>
            <Select
              value={sortBy}
              label="Trier par"
              onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="body2">{project.likes || 0}</Typography>
                    <FavoriteIcon fontSize="small" color="primary" />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton 
                      onClick={() => handleEdit(project)} 
                      color="primary" 
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(project.id)} 
                      color="error" 
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Project Form Dialog */}
      {isFormOpen && (
        <ProjectForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject || undefined}
          onSuccess={() => {
            setIsFormOpen(false);
            setSelectedProject(null);
            dispatch(fetchProjects() as any);
          }}
          token={token}
        />
      )}
    </Container>
  );
};

export default AdminDashboard; 