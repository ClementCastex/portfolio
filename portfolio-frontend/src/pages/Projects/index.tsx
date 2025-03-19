import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Fade,
  Grow,
  Chip,
  Divider,
  useTheme,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Tab,
  Tabs,
  useMediaQuery,
  alpha,
  Stack,
  Zoom,
} from '@mui/material';
import { 
  Add as AddIcon,
  FilterList as FilterListIcon,
  FormatListBulleted as ListIcon,
  GridView as GridViewIcon,
  Favorite as FavoriteIcon,
  WorkOutline as ProjectIcon,
  ShowChart as StatusIcon,
  LocalOffer as TagIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import { fetchProjects, deleteProject } from '../../store/slices/projectSlice';
import ProjectCard from '../../components/ProjectCard';
import ProjectFilters from '../../components/ProjectFilters';
import ProjectForm from '../../components/ProjectForm';
import { useProjectsWithLikes } from '../../hooks/useProjectsWithLikes';
import { Project } from '../../types';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    filteredProjects,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    allTags,
    isLiked,
    handleLikeToggle,
    showOnlyLiked,
    setShowOnlyLiked,
  } = useProjectsWithLikes();

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await dispatch(deleteProject(projectToDelete) as any);
        await dispatch(fetchProjects() as any);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProjects() as any).then(() => {
      setTimeout(() => setRefreshing(false), 1000);
    });
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Calculer les statistiques des projets
  const totalProjects = filteredProjects.length;
  const completedProjects = filteredProjects.filter(p => p.status === 'completed').length;
  const inProgressProjects = filteredProjects.filter(p => p.status === 'in_progress').length;
  const abandonedProjects = filteredProjects.filter(p => p.status === 'abandoned').length;
  const totalLikes = filteredProjects.reduce((sum, project) => sum + project.likes, 0);
  
  // Obtenir les tags les plus populaires (top 5)
  const tagCounts = allTags.map(tag => {
    const count = filteredProjects.filter(p => p.categories.includes(tag)).length;
    return { tag, count };
  }).sort((a, b) => b.count - a.count).slice(0, 5);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
        <CircularProgress size={60} thickness={4} sx={{ color: '#5B348B', mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Chargement des projets...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* En-tête stylisé */}
      <Fade in={true} timeout={800}>
        <Box sx={{ 
          position: 'relative', 
          textAlign: 'center', 
          mb: 4,
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold"
            sx={{ 
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#333333',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '4px',
                backgroundColor: '#5B348B',
                borderRadius: '2px'
              }
            }}
          >
            Mes Projets
          </Typography>
          <Typography 
            variant="h6" 
            color="text.primary" 
            sx={{ maxWidth: '800px', mx: 'auto', mt: 3 }}
          >
            Découvrez mes réalisations et leurs détails, des concepts aux résultats finaux
          </Typography>
        </Box>
      </Fade>
      
      {/* Barre de navigation avec onglets */}
      <Paper sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
              },
              '& .Mui-selected': {
                color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
              },
            }}
          >
            <Tab label="Tous les projets" value={0} />
            <Tab label="Terminés" value={1} />
            <Tab label="En cours" value={2} />
          </Tabs>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={filtersVisible ? "Masquer les filtres" : "Afficher les filtres"}>
              <IconButton onClick={() => setFiltersVisible(!filtersVisible)}>
                <FilterListIcon 
                  color={filtersVisible && !isDarkMode ? "primary" : "inherit"} 
                  sx={{ color: filtersVisible && isDarkMode ? 'white' : undefined }}
                />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Rafraîchir">
              <IconButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Vue grille">
              <IconButton 
                color={view === 'grid' ? 'primary' : 'default'}
                onClick={() => setView('grid')}
              >
                <GridViewIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Vue liste">
              <IconButton 
                color={view === 'list' ? 'primary' : 'default'}
                onClick={() => setView('list')}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Barre de progression pendant le rafraîchissement */}
        {refreshing && <LinearProgress sx={{ height: 3 }} />}
      </Paper>
      
      {/* Filtres */}
      <Fade in={filtersVisible}>
        <Box>
          <ProjectFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            sortBy={sortBy}
            setSortBy={setSortBy}
            allTags={allTags}
            showOnlyLiked={showOnlyLiked}
            setShowOnlyLiked={setShowOnlyLiked}
          />
          
          {/* Tags populaires */}
          {tagCounts.length > 0 && (
            <Box sx={{ mb: 3, mt: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium' }}>
                  Tags populaires:
                </Typography>
                {tagCounts.map(({tag, count}) => (
                  <Chip 
                    key={tag}
                    label={`${tag} (${count})`}
                    size="small"
                    clickable
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    color={selectedTag === tag ? (isDarkMode ? "default" : "primary") : "default"}
                    variant={selectedTag === tag ? "filled" : "outlined"}
                    sx={{ 
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.23)',
                      ...(isDarkMode && {
                        '&.MuiChip-outlined': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.MuiChip-filled': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                        }
                      }),
                      ...(!isDarkMode && {
                        '&.MuiChip-outlined': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        }
                      })
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Fade>
      
      {/* Message quand aucun projet ne correspond */}
      {filteredProjects.length === 0 ? (
        <Fade in={true}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : theme.palette.background.paper,
            }}
          >
            <ProjectIcon sx={{ fontSize: 60, color: 'text.primary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Aucun projet ne correspond à vos critères
            </Typography>
            <Typography variant="body1" color="text.primary" paragraph>
              Essayez de modifier vos filtres ou votre recherche pour trouver des projets.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('');
                setSelectedTag('');
                setSortBy('date_desc');
              }}
              sx={{ 
                mt: 1,
                color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                borderColor: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                '&:hover': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#4a2a70',
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(91, 52, 139, 0.08)'
                }
              }}
            >
              Réinitialiser les filtres
            </Button>
          </Paper>
        </Fade>
      ) : (
        <>
          {/* Onglets filtrant les projets par statut */}
          {activeTab === 0 ? (
            <Grid container spacing={3}>
              {filteredProjects.map((project, index) => (
                <Grid 
                  item 
                  key={project.id} 
                  xs={12} 
                  sm={view === 'list' ? 12 : 6} 
                  md={view === 'list' ? 12 : 4}
                >
                  <Grow 
                    in={true} 
                    style={{ transformOrigin: '0 0 0' }} 
                    timeout={(index % 9) * 100 + 300}
                  >
                    <Box>
                      <ProjectCard
                        project={project}
                        onLike={handleLikeToggle}
                        isLiked={isLiked(project.id)}
                        isAdmin={user?.roles?.includes('ROLE_ADMIN')}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          ) : activeTab === 1 ? (
            <Grid container spacing={3}>
              {filteredProjects
                .filter(project => project.status === 'completed')
                .map((project, index) => (
                  <Grid 
                    item 
                    key={project.id} 
                    xs={12} 
                    sm={view === 'list' ? 12 : 6} 
                    md={view === 'list' ? 12 : 4}
                  >
                    <Grow 
                      in={true} 
                      style={{ transformOrigin: '0 0 0' }} 
                      timeout={(index % 9) * 100 + 300}
                    >
                      <Box>
                        <ProjectCard
                          project={project}
                          onLike={handleLikeToggle}
                          isLiked={isLiked(project.id)}
                          isAdmin={user?.roles?.includes('ROLE_ADMIN')}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </Box>
                    </Grow>
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {filteredProjects
                .filter(project => project.status === 'in_progress')
                .map((project, index) => (
                  <Grid 
                    item 
                    key={project.id} 
                    xs={12} 
                    sm={view === 'list' ? 12 : 6} 
                    md={view === 'list' ? 12 : 4}
                  >
                    <Grow 
                      in={true} 
                      style={{ transformOrigin: '0 0 0' }} 
                      timeout={(index % 9) * 100 + 300}
                    >
                      <Box>
                        <ProjectCard
                          project={project}
                          onLike={handleLikeToggle}
                          isLiked={isLiked(project.id)}
                          isAdmin={user?.roles?.includes('ROLE_ADMIN')}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </Box>
                    </Grow>
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Bouton flottant pour ajouter un projet (admin uniquement) */}
      {user?.roles?.includes('ROLE_ADMIN') && (
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
      )}

      {/* Formulaire d'édition/création */}
      {isFormOpen && token && (
        <ProjectForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProject(null);
          }}
          onSuccess={() => {
            dispatch(fetchProjects() as any);
            setIsFormOpen(false);
            setSelectedProject(null);
          }}
          token={token}
          existingTags={allTags}
          project={selectedProject || undefined}
        />
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          Confirmer la suppression
          <IconButton
            aria-label="close"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 10,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ 
              color: 'text.primary',
              borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              bgcolor: theme.palette.error.main,
              '&:hover': {
                bgcolor: theme.palette.error.dark,
              }
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects; 