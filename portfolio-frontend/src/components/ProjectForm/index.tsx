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
import { Theme } from '@mui/material/styles';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon, Close as CloseIcon } from '@mui/icons-material';
import { API_ENDPOINTS, API_BASE_URL } from '../../config/api';
import { Project } from '../../types';

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#5B348B',
    },
    '&:hover fieldset': {
      borderColor: '#5B348B',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5B348B',
    },
  },
  '& .MuiInputLabel-root': {
    color: (theme: Theme) => theme.palette.text.primary,
    '&.Mui-focused': {
      color: (theme: Theme) => theme.palette.text.primary,
    },
  },
  '& .MuiInputBase-input': {
    color: (theme: Theme) => theme.palette.text.primary,
  },
};

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  existingTags?: string[];
  project?: Project;
}

const initialFormData: Project = {
  id: 0,
  title: '',
  shortDescription: '',
  description: '',
  status: 'IN_PROGRESS',
  categories: [],
  images: [],
  githubUrl: '',
  websiteUrl: '',
  likes: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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
  existingTags = [],
  project,
}) => {
  const [formData, setFormData] = useState<Project>(initialFormData);

  const [newCategory, setNewCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImageOnlyMode, setIsImageOnlyMode] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData(initialFormData);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (project?.id && isImageOnlyMode) {
        // Si on est en mode image uniquement, on ne met à jour que les images
        if (selectedFiles.length > 0) {
          const imageFormData = new FormData();
          selectedFiles.forEach((file) => {
            imageFormData.append('images[]', file);
          });

          const uploadResponse = await fetch(`${API_ENDPOINTS.PROJECTS}/${project.id}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: imageFormData,
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
          body: JSON.stringify({ ...formData, images: formData.images }),
        });

        if (!response.ok) {
          throw new Error('Failed to save project');
        }

        const data = await response.json();
        setFormData({
          ...formData,
          images: data.images || [],
          id: data.id || formData.id,
          title: formData.title,
          shortDescription: formData.shortDescription,
          description: formData.description,
          status: formData.status,
          categories: formData.categories,
          githubUrl: formData.githubUrl,
          websiteUrl: formData.websiteUrl,
          likes: formData.likes,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt,
        });

        if (selectedFiles.length > 0) {
          const imageFormData = new FormData();
          selectedFiles.forEach((file) => {
            imageFormData.append('images[]', file);
          });

          const uploadResponse = await fetch(`${API_ENDPOINTS.PROJECTS}/${data.id}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: imageFormData,
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
      const imageFormData = new FormData();
      Array.from(files).forEach((file) => {
        imageFormData.append('images[]', file);
      });

      try {
        const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${project.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: imageFormData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload images');
        }

        const data = await response.json();
        setFormData({
          ...formData,
          images: data.images || [],
          id: data.id || formData.id,
          title: formData.title,
          shortDescription: formData.shortDescription,
          description: formData.description,
          status: formData.status,
          categories: formData.categories,
          githubUrl: formData.githubUrl,
          websiteUrl: formData.websiteUrl,
          likes: formData.likes,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt,
        });
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
      setFormData({ ...formData, images: newImages });
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

        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    } else {
      // Si nouveau projet, supprimer juste de la prévisualisation
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {project ? 'Modifier le projet' : 'Nouveau projet'}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
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
                  label="Description complète"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={4}
                  sx={textFieldStyle}
                  margin="normal"
                />

                <FormControl fullWidth margin="normal" sx={textFieldStyle}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="IN_PROGRESS">En cours</MenuItem>
                    <MenuItem value="COMPLETED">Terminé</MenuItem>
                    <MenuItem value="ABANDONED">Abandonné</MenuItem>
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
                      sx={{ 
                        ml: 1,
                        color: 'white',
                        '&:hover': {
                          color: 'white',
                        }
                      }}
                    >
                      Ajouter
                    </Button>
                  </Box>
                  
                  {/* Existing Tags Section */}
                  {existingTags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tags existants
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {existingTags
                          .filter(tag => !formData.categories.includes(tag))
                          .map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  categories: [...formData.categories, tag],
                                });
                              }}
                              variant="outlined"
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                      </Box>
                    </Box>
                  )}

                  {/* Selected Categories */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags sélectionnés
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          onDelete={() => handleDeleteCategory(category)}
                          color="primary"
                          variant="filled"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Lien GitHub"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  sx={textFieldStyle}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Lien Demo"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
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
                sx={{ 
                  mb: 2,
                  color: 'white',
                  '&:hover': {
                    color: 'white',
                  }
                }}
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
              {formData.images.length > 0 && (
                <ImageList cols={3} rowHeight={200} sx={{ mb: 2 }}>
                  {formData.images.map((image, index) => (
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
          <Button onClick={onClose} sx={{ color: theme => theme.palette.text.primary }}>Annuler</Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              color: 'white',
              '&:hover': {
                color: 'white',
              }
            }}
          >
            {project ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm; 