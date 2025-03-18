import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { API_ENDPOINTS, API_BASE_URL } from '../../config/api';

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
    color: '#CCAA1D',
    '&.Mui-focused': {
      color: '#CCAA1D',
    },
  },
  '& .MuiInputBase-input': {
    color: '#CCAA1D',
  },
};

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  project?: {
    id?: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    status: string;
    categories: string[];
    images: string[];
    websiteUrl?: string;
    githubUrl?: string;
  };
}

const getFullImageUrl = (imagePath: string) => {
  // Si l'image est une URL complète ou une URL de données (preview), la retourner telle quelle
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Sinon, construire l'URL complète
  return `${API_BASE_URL}${imagePath}`;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onClose,
  onSuccess,
  token,
  project,
}) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    shortDescription: project?.shortDescription || '',
    longDescription: project?.longDescription || '',
    status: project?.status || 'in_progress',
    categories: project?.categories || [],
    websiteUrl: project?.websiteUrl || '',
    githubUrl: project?.githubUrl || '',
  });

  const [images, setImages] = useState<string[]>(project?.images || []);
  const [newCategory, setNewCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImageOnlyMode, setIsImageOnlyMode] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription,
        status: project.status,
        categories: project.categories,
        websiteUrl: project.websiteUrl || '',
        githubUrl: project.githubUrl || '',
      });
      setImages(project.images);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (project?.id && isImageOnlyMode) {
        // Si on est en mode image uniquement, on ne met à jour que les images
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append('images[]', file);
          });

          const uploadResponse = await fetch(`${API_ENDPOINTS.PROJECTS}/${project.id}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload images');
          }
        }
      } else {
        // Sinon, on met à jour tout le projet
        const url = project?.id 
          ? `${API_ENDPOINTS.PROJECTS}/${project.id}`
          : API_ENDPOINTS.PROJECTS;
          
        const response = await fetch(url, {
          method: project?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, images }),
        });

        if (!response.ok) {
          throw new Error('Failed to save project');
        }

        const savedProject = await response.json();

        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append('images[]', file);
          });

          const uploadResponse = await fetch(`${API_ENDPOINTS.PROJECTS}/${savedProject.id}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload images');
          }
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory],
      });
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(category => category !== categoryToDelete),
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (project?.id) {
      // Si le projet existe déjà, uploader directement
      setUploading(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images[]', file);
      });

      try {
        const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${project.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload images');
        }

        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setUploading(false);
      }
    } else {
      // Si nouveau projet, stocker les fichiers pour plus tard
      setSelectedFiles(Array.from(files));
      // Créer des URLs temporaires pour l'aperçu
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (project?.id) {
      // Si le projet existe, supprimer l'image du serveur
      try {
        const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${project.id}/images/${index}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    } else {
      // Si nouveau projet, supprimer juste de la prévisualisation
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {project?.id ? 'Modifier le projet' : 'Ajouter un projet'}
        </Typography>
        {project?.id && (
          <Button
            variant="outlined"
            onClick={() => setIsImageOnlyMode(!isImageOnlyMode)}
            sx={{ ml: 2 }}
          >
            {isImageOnlyMode ? 'Mode complet' : 'Gérer les images uniquement'}
          </Button>
        )}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {!isImageOnlyMode && (
              <>
                <TextField
                  fullWidth
                  required
                  label="Titre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  sx={textFieldStyle}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  required
                  label="Description courte"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  sx={textFieldStyle}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  required
                  label="Description longue"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  multiline
                  rows={4}
                  sx={textFieldStyle}
                  margin="normal"
                />

                <FormControl fullWidth margin="normal" sx={textFieldStyle}>
                  <InputLabel id="status-label">Statut</InputLabel>
                  <Select
                    labelId="status-label"
                    value={formData.status}
                    label="Statut"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="in_progress">En cours</MenuItem>
                    <MenuItem value="completed">Terminé</MenuItem>
                    <MenuItem value="abandoned">Abandonné</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Nouvelle catégorie"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      sx={textFieldStyle}
                      margin="normal"
                    />
                    <Button
                      onClick={handleAddCategory}
                      variant="contained"
                      sx={{ ml: 1 }}
                    >
                      Ajouter
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.categories.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        onDelete={() => handleDeleteCategory(category)}
                      />
                    ))}
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="URL du site"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  sx={textFieldStyle}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="URL GitHub"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  sx={textFieldStyle}
                  margin="normal"
                />
              </>
            )}

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Images du projet
              </Typography>
              {!project?.id && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Les images seront uploadées après la création du projet
                </Alert>
              )}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Envoi en cours...' : 'Ajouter des images'}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Button>
              {images.length > 0 && (
                <ImageList cols={3} rowHeight={200} sx={{ mb: 2 }}>
                  {images.map((image, index) => (
                    <ImageListItem key={index} sx={{ position: 'relative' }}>
                      <img
                        src={getFullImageUrl(image)}
                        alt={`Project image ${index + 1}`}
                        loading="lazy"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={() => handleDeleteImage(index)}
                      >
                        <DeleteIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {isImageOnlyMode ? 'Sauvegarder les images' : (project?.id ? 'Modifier' : 'Créer')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm; 