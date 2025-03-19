import React, { useState } from 'react';
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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h2">
          Mes Projets
        </Typography>
        {user?.roles?.includes('ROLE_ADMIN') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProject(null);
              setIsFormOpen(true);
            }}
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
      />

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4}>
            <ProjectCard
              project={project}
              onLike={handleLikeToggle}
              isLiked={isLiked(project.id)}
              isAdmin={user?.roles?.includes('ROLE_ADMIN')}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

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
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'text.primary' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects; 