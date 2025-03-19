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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
} from '@mui/material';
import { 
  GitHub, 
  Language, 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import { fetchProjects, updateProjectLikes } from '../../store/slices/projectSlice';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [allTags, setAllTags] = useState<string[]>([]);

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
    dispatch(fetchProjects() as any);
    dispatch(fetchBookmarks() as any);
  }, [dispatch]);

  // Get unique tags from all projects
  useEffect(() => {
    const uniqueTags = Array.from(new Set(projects.flatMap(project => project.categories)));
    setAllTags(uniqueTags);
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || project.categories.includes(selectedTag);
      const matchesStatus = !selectedStatus || project.status === selectedStatus;
      return matchesSearch && matchesTag && matchesStatus;
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

  const isLiked = (projectId: number) => {
    return bookmarks.some(bookmark => 
      bookmark && 
      bookmark.project && 
      bookmark.project.id === projectId
    );
  };

  const handleLikeToggle = async (projectId: number) => {
    if (!token) {
      navigate('/login');
      return;
    }

    console.log('Current user:', user);
    console.log('Current bookmarks:', bookmarks);
    console.log('Trying to toggle like for project:', projectId);

    try {
      const bookmark = bookmarks.find(b => b.project?.id === projectId);
      console.log('Found bookmark:', bookmark);

      if (bookmark) {
        console.log('Removing bookmark:', bookmark.id);
        const result = await dispatch(removeBookmark(bookmark.id) as any).unwrap();
        console.log('Remove result:', result);
        
        if (result.action === 'removed') {
          dispatch(fetchBookmarks() as any);
          dispatch(updateProjectLikes({
            projectId: result.project.id,
            likeTotal: result.totalLikes
          }));
        }
      } else {
        console.log('Adding bookmark for project:', projectId);
        const result = await dispatch(addBookmark(projectId) as any).unwrap();
        console.log('Add result:', result);
        
        if (result.action === 'added') {
          dispatch(fetchBookmarks() as any);
          dispatch(updateProjectLikes({
            projectId: result.project.id,
            likeTotal: result.totalLikes
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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
              startAdornment: <SearchIcon color="action" sx={{ color: '#F7F3F7', mr: 1 }} />,
            }}
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth sx={textFieldStyle}>
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
          <FormControl fullWidth sx={textFieldStyle}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={selectedTag}
              label="Catégorie"
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth sx={textFieldStyle}>
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

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {project.categories.map((category, index) => (
                    <Chip key={index} label={category} size="small" />
                  ))}
                </Box>
                <Chip
                  label={project.status.replace('_', ' ')}
                  color={getStatusColor(project.status)}
                  size="small"
                  sx={{ mb: 2 }}
                />
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {project.likeTotal}
                  </Typography>
                  <Tooltip title={
                    !token 
                      ? "Connectez-vous pour liker" 
                      : isLiked(project.id) 
                        ? "Retirer des favoris" 
                        : "Ajouter aux favoris"
                  }>
                    <IconButton
                      onClick={() => handleLikeToggle(project.id)}
                      size="small"
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
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isFormOpen && token && (
        <ProjectForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            dispatch(fetchProjects() as any);
            setIsFormOpen(false);
          }}
          token={token}
          existingTags={allTags}
        />
      )}
    </Container>
  );
};

export default Projects; 