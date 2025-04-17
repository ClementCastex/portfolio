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
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Stack,
  LinearProgress,
  Fade,
  Zoom,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  FormatListBulleted as ListIcon,
  BarChart as ChartIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
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
  const [activeTab, setActiveTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(fetchProjects() as any).then(() => {
      setTimeout(() => setIsRefreshing(false), 1000);
    });
  };

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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
  const abandonedProjects = projects.filter(p => p.status === 'abandoned').length;
  
  // Calcul du pourcentage pour chaque statut
  const completedPercentage = Math.round((completedProjects / totalProjects) * 100) || 0;
  const inProgressPercentage = Math.round((inProgressProjects / totalProjects) * 100) || 0;
  const abandonedPercentage = Math.round((abandonedProjects / totalProjects) * 100) || 0;

  // Statistiques sur les catégories
  const categoriesStats = allTags.map(tag => {
    const count = projects.filter(p => p.categories.includes(tag)).length;
    return { 
      name: tag, 
      count,
      percentage: Math.round((count / totalProjects) * 100) || 0
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5);

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

  if (loading && !isRefreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderStatistics = () => (
    <Grid container spacing={3}>
      {/* Ligne 1: Statistiques générales */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%',
            boxShadow: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 4,
            },
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="overline" component="div" color="text.secondary" gutterBottom>
              TOTAL PROJETS
            </Typography>
            <Typography variant="h2" component="div" sx={{ mb: 1 }}>
              {totalProjects}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                icon={<ListIcon />} 
                label="Tous les projets"
                sx={{ bgcolor: isDarkMode ? 'rgba(91, 52, 139, 0.2)' : 'rgba(91, 52, 139, 0.1)' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%',
            boxShadow: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 4,
            },
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="overline" component="div" color="text.secondary" gutterBottom>
              TOTAL LIKES
            </Typography>
            <Typography variant="h2" component="div" sx={{ mb: 1, color: '#E91E63' }}>
              {totalLikes}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                icon={<FavoriteIcon />} 
                label="Interactions"
                color="error" 
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%',
            boxShadow: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 4,
            },
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="overline" component="div" color="text.secondary" gutterBottom>
              TERMINÉS
            </Typography>
            <Typography variant="h2" component="div" sx={{ mb: 1, color: 'success.main' }}>
              {completedProjects}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                icon={<FlagIcon />} 
                label={`${completedPercentage}% du total`}
                color="success" 
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%',
            boxShadow: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 4,
            },
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="overline" component="div" color="text.secondary" gutterBottom>
              EN COURS
            </Typography>
            <Typography variant="h2" component="div" sx={{ mb: 1, color: 'warning.main' }}>
              {inProgressProjects}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                icon={<ScheduleIcon />} 
                label={`${inProgressPercentage}% du total`}
                color="warning" 
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Ligne 2: Graphiques et statistiques détaillées */}
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ChartIcon sx={{ mr: 1 }} /> Statut des projets
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Terminés</Typography>
                <Typography variant="body2" fontWeight="bold">{completedPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completedPercentage} 
                color="success"
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">En cours</Typography>
                <Typography variant="body2" fontWeight="bold">{inProgressPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={inProgressPercentage} 
                color="warning"
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Abandonnés</Typography>
                <Typography variant="body2" fontWeight="bold">{abandonedPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={abandonedPercentage} 
                color="error"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CategoryIcon sx={{ mr: 1 }} /> Top 5 des catégories
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {categoriesStats.map((category, index) => (
              <Box key={index} sx={{ mb: index < categoriesStats.length - 1 ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{category.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">{category.count} projets</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.percentage}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#5B348B'
                    }
                  }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTableView = () => (
    <Box>
      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Rechercher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              placeholder="Titre, description..."
              sx={isDarkMode ? darkInputStyle : lightInputStyle}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined" sx={isDarkMode ? darkInputStyle : lightInputStyle}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Statut"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="in_progress">En cours</MenuItem>
                <MenuItem value="completed">Terminé</MenuItem>
                <MenuItem value="abandoned">Abandonné</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined" sx={isDarkMode ? darkInputStyle : lightInputStyle}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as string)}
                label="Catégorie"
              >
                <MenuItem value="">Toutes</MenuItem>
                {allTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth variant="outlined" sx={isDarkMode ? darkInputStyle : lightInputStyle}>
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                label="Trier par"
              >
                <MenuItem value="date_desc">Plus récents</MenuItem>
                <MenuItem value="date_asc">Plus anciens</MenuItem>
                <MenuItem value="title_asc">Titre (A-Z)</MenuItem>
                <MenuItem value="title_desc">Titre (Z-A)</MenuItem>
                <MenuItem value="likes_desc">Plus de likes</MenuItem>
                <MenuItem value="likes_asc">Moins de likes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des projets */}
      <Fade in={true} timeout={500}>
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">
              {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
            </Typography>
            <Tooltip title="Rafraîchir les données">
              <IconButton 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                sx={{ 
                  color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(91, 52, 139, 0.08)',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <TableContainer sx={{ maxHeight: '600px' }}>
            {isRefreshing && (
              <LinearProgress sx={{ height: 3 }} />
            )}
            
            <Table stickyHeader aria-label="tableau des projets">
              <TableHead>
                <TableRow sx={{ 
                  '& th': { 
                    fontWeight: 'bold', 
                    bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  } 
                }}>
                  <TableCell>Projet</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Catégories</TableCell>
                  <TableCell align="center">Likes</TableCell>
                  <TableCell align="center">Images</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <ListIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="body1" color="text.secondary">
                          Aucun projet ne correspond à vos critères
                        </Typography>
                        <Button 
                          variant="text" 
                          color="primary" 
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedStatus('');
                            setSelectedCategory('');
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      sx={{ 
                        '&:hover': { 
                          bgcolor: theme => theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.04)' 
                        },
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <TableCell sx={{ maxWidth: '250px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {project.images && project.images.length > 0 ? (
                            <Avatar
                              src={getFullImageUrl(project.images[0])}
                              variant="rounded"
                              sx={{ width: 50, height: 50, borderRadius: 2 }}
                            />
                          ) : (
                            <Avatar
                              variant="rounded" 
                              sx={{ 
                                width: 50, 
                                height: 50, 
                                borderRadius: 2,
                                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <ImageIcon />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {project.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}
                            >
                              {project.shortDescription}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.status === 'completed' ? 'Terminé' : project.status === 'in_progress' ? 'En cours' : 'Abandonné'}
                          color={
                            project.status === 'completed' 
                              ? 'success' 
                              : project.status === 'in_progress' 
                                ? 'warning' 
                                : 'error'
                          }
                          variant={isDarkMode ? "outlined" : "filled"}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            ...(isDarkMode && project.status === 'completed' && {
                              color: '#66bb6a',
                              borderColor: '#66bb6a'
                            }),
                            ...(isDarkMode && project.status === 'in_progress' && {
                              color: '#ff9800',
                              borderColor: '#ff9800'
                            }),
                            ...(isDarkMode && project.status === 'abandoned' && {
                              color: '#f44336',
                              borderColor: '#f44336'
                            })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '200px' }}>
                          {project.categories.slice(0, 3).map((category, index) => (
                            <Chip
                              key={index}
                              label={category}
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: '#5B348B' }}
                            />
                          ))}
                          {project.categories.length > 3 && (
                            <Chip
                              label={`+${project.categories.length - 3}`}
                              size="small"
                              sx={{ bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(91, 52, 139, 0.2)' : 'rgba(91, 52, 139, 0.1)' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Badge 
                          badgeContent={project.likes || 0} 
                          color="error"
                          sx={{ 
                            '& .MuiBadge-badge': { 
                              fontSize: '0.8rem',
                              top: 2,
                              right: 2 
                            } 
                          }}
                        >
                          <FavoriteIcon 
                            color="error" 
                            fontSize="small" 
                            sx={{ opacity: 0.8 }}
                          />
                        </Badge>
                      </TableCell>
                      <TableCell align="center">
                        {project.images && project.images.length > 0 ? (
                          <Badge 
                            badgeContent={project.images.length > 3 ? `+${project.images.length - 3}` : 0} 
                            color="primary"
                            invisible={project.images.length <= 3}
                            sx={{ 
                              '& .MuiBadge-badge': { 
                                fontSize: '0.7rem',
                                top: -4,
                                right: -4,
                                padding: '0 4px',
                              } 
                            }}
                          >
                            <AvatarGroup max={3} sx={{ justifyContent: 'center' }}>
                              {project.images.map((image, index) => (
                                <Avatar
                                  key={index}
                                  src={getFullImageUrl(image)}
                                  sx={{ width: 30, height: 30 }}
                                />
                              ))}
                            </AvatarGroup>
                          </Badge>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Aucune
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Voir">
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/${project.id}`);
                              }}
                              size="small"
                              sx={{ 
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                                mr: 1
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Éditer">
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(project);
                              }}
                              size="small"
                              sx={{ 
                                color: theme => theme.palette.mode === 'dark' ? '#5B348B' : 'primary.main',
                                mr: 1
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project.id);
                              }}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard Admin
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              Gérez vos projets et suivez leur performance
            </Typography>
          </Grid>
          <Grid item>
            <Zoom in={true} timeout={500} style={{ transitionDelay: '500ms' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedProject(null);
                  setIsFormOpen(true);
                }}
                sx={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  color: 'white',
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#5B348B',
                  borderRadius: 8,
                  boxShadow: 3,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : '#4a2a70',
                  }
                }}
              >
                Ajouter un projet
              </Button>
            </Zoom>
          </Grid>
        </Grid>
      </Box>

      {/* Navigation par onglets */}
      <Paper sx={{ borderRadius: 2, mb: 3, boxShadow: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleChangeTab} 
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#5B348B' : '#5B348B',
            },
            '& .MuiTab-root': {
              color: theme => theme.palette.mode === 'dark' ? '#CCAA1D !important' : '#5B348B',
              opacity: 0.7,
              '&:hover': {
                color: theme => theme.palette.mode === 'dark' ? '#CCAA1D !important' : '#5B348B',
                opacity: 1,
              },
              '&.Mui-selected': {
                color: theme => theme.palette.mode === 'dark' ? '#F7F7F7 !important' : '#5B348B',
                opacity: 1,
                fontWeight: 'bold',
              },
            },
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Vue d'ensemble" 
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none' }}
          />
          <Tab 
            icon={<ListIcon />} 
            label="Liste des projets" 
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none' }}
          />
        </Tabs>
      </Paper>

      {/* Contenu selon l'onglet sélectionné */}
      {activeTab === 0 && renderStatistics()}
      {activeTab === 1 && renderTableView()}

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
          existingTags={allTags}
        />
      )}
    </Container>
  );
};

export default AdminDashboard; 