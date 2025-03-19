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
  Grid,
  Paper,
  Autocomplete,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Fade,
  Zoom,
  Tooltip,
  LinearProgress,
  Backdrop,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { 
  Delete as DeleteIcon, 
  CloudUpload as CloudUploadIcon, 
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
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

const getFullImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  existingTags?: string[];
  project?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onClose,
  onSuccess,
  token,
  existingTags = [],
  project,
}) => {
  // États pour la gestion des données
  const [formData, setFormData] = useState<Partial<Project>>({
    title: project?.title || '',
    shortDescription: project?.shortDescription || '',
    description: project?.description || '',
    status: project?.status || 'in_progress',
    categories: project?.categories || [],
    githubUrl: project?.githubUrl || '',
    websiteUrl: project?.websiteUrl || '',
    images: project?.images || [],
  });
  
  // États pour la gestion de l'interface
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Validation des champs
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Étapes du formulaire
  const steps = ['Informations de base', 'Détails supplémentaires', 'Images'];
  
  // Gestionnaires d'événements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation à la volée
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleStatusChange = (e: any) => {
    setFormData(prev => ({ ...prev, status: e.target.value }));
  };

  const handleCategorySelect = (event: React.SyntheticEvent, value: string[]) => {
    setFormData(prev => ({ ...prev, categories: value }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    setUploading(true);

    if (project?.id) {
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
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...data.images],
        }));
        setSuccess('Images téléchargées avec succès');
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error uploading images:', error);
        setError('Erreur lors du téléchargement des images');
      } finally {
        setUploading(false);
      }
    } else {
      setSelectedFiles(Array.from(files));
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
      setUploading(false);
      setSuccess('Images prêtes à être téléchargées');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (project?.id) {
      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${project.id}/images/${index}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        const newImages = [...formData.images!];
        newImages.splice(index, 1);
        setFormData(prev => ({ ...prev, images: newImages }));
        setSuccess('Image supprimée avec succès');
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting image:', error);
        setError('Erreur lors de la suppression de l\'image');
      } finally {
        setLoading(false);
      }
    } else {
      const newImages = [...formData.images!];
      newImages.splice(index, 1);
      setFormData(prev => ({ ...prev, images: newImages }));
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (step === 0) {
      if (!formData.title?.trim()) {
        errors.title = 'Le titre est requis';
      }
      if (!formData.shortDescription?.trim()) {
        errors.shortDescription = 'La description courte est requise';
      }
      if (!formData.description?.trim()) {
        errors.description = 'La description détaillée est requise';
      }
    }
    
    if (step === 1) {
      if (formData.githubUrl && !/^(https?:\/\/)?(www\.)?github\.com\/.+/.test(formData.githubUrl)) {
        errors.githubUrl = 'URL GitHub invalide';
      }
      if (formData.websiteUrl && !/^(https?:\/\/)?(www\.)?.+\..+/.test(formData.websiteUrl)) {
        errors.websiteUrl = 'URL du site invalide';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = project?.id 
        ? `${API_ENDPOINTS.PROJECTS}/${project.id}`
        : API_ENDPOINTS.PROJECTS;
        
      const response = await fetch(url, {
        method: project?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const data = await response.json();

      if (selectedFiles.length > 0 && !project?.id) {
        setUploading(true);
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
        setUploading(false);
      }

      setSuccess('Projet sauvegardé avec succès!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Erreur lors de la sauvegarde du projet');
      setLoading(false);
    }
  };

  // Rendu du contenu selon l'étape active
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Titre"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={textFieldStyle}
                  error={!!validationErrors.title}
                  helperText={validationErrors.title}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="shortDescription"
                  label="Description courte"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={2}
                  sx={textFieldStyle}
                  error={!!validationErrors.shortDescription}
                  helperText={validationErrors.shortDescription}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description détaillée"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  sx={textFieldStyle}
                  error={!!validationErrors.description}
                  helperText={validationErrors.description}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required sx={textFieldStyle}>
                  <InputLabel id="status-label">
                    Statut
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    label="Statut"
                  >
                    <MenuItem value="in_progress">En cours</MenuItem>
                    <MenuItem value="completed">Terminé</MenuItem>
                    <MenuItem value="abandoned">Abandonné</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={existingTags}
                    value={formData.categories}
                    onChange={handleCategorySelect}
                    renderTags={(value: string[], getTagProps) =>
                      value.map((option: string, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={key}
                            variant="outlined"
                            label={option}
                            {...tagProps}
                            sx={{ 
                              borderColor: '#5B348B',
                              '& .MuiChip-deleteIcon': {
                                color: theme => theme.palette.text.primary,
                              }
                            }}
                          />
                        );
                      })
                    }
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Typography variant="body2">
                          {option}
                        </Typography>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Catégories"
                        placeholder="Ajouter une catégorie"
                        sx={textFieldStyle}
                      />
                    )}
                  />
                  {existingTags.length > 0 && (
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1,
                        borderColor: '#5B348B',
                        bgcolor: 'background.paper',
                        mt: 1
                      }}
                    >
                      <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                        Tags existants :
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {existingTags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              if (!formData.categories?.includes(tag)) {
                                setFormData(prev => ({
                                  ...prev,
                                  categories: [...(prev.categories || []), tag]
                                }));
                              }
                            }}
                            sx={{
                              borderColor: formData.categories?.includes(tag) ? 'primary.main' : '#5B348B',
                              bgcolor: formData.categories?.includes(tag) ? 'rgba(91, 52, 139, 0.1)' : 'transparent',
                              '&:hover': {
                                bgcolor: 'rgba(91, 52, 139, 0.1)',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="githubUrl"
                  label="URL GitHub"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                  error={!!validationErrors.githubUrl}
                  helperText={validationErrors.githubUrl}
                  InputProps={{
                    startAdornment: (
                      <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="websiteUrl"
                  label="URL du site"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                  error={!!validationErrors.websiteUrl}
                  helperText={validationErrors.websiteUrl}
                  InputProps={{
                    startAdornment: (
                      <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2,
                    borderColor: '#5B348B',
                    bgcolor: 'background.paper'
                  }}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Images du projet
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading}
                      sx={{
                        borderColor: '#5B348B',
                        color: theme => theme.palette.text.primary,
                        '&:hover': {
                          borderColor: '#5B348B',
                          bgcolor: 'rgba(91, 52, 139, 0.1)',
                        }
                      }}
                    >
                      {uploading ? 'Téléchargement...' : 'Ajouter des images'}
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                      />
                    </Button>
                  </Box>

                  {uploading && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <LinearProgress color="secondary" />
                    </Box>
                  )}

                  {formData.images && formData.images.length > 0 ? (
                    <ImageList cols={3} gap={8}>
                      {formData.images.map((image, index) => (
                        <Zoom in={true} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                          <ImageListItem 
                            sx={{ 
                              overflow: 'hidden',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <img
                              src={image.startsWith('blob:') ? image : getFullImageUrl(image)}
                              alt={`Image ${index + 1}`}
                              loading="lazy"
                              style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                              onClick={() => handleDeleteImage(index)}
                              disabled={loading}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                                },
                              }}
                            >
                              <DeleteIcon sx={{ color: 'white' }} />
                            </IconButton>
                          </ImageListItem>
                        </Zoom>
                      ))}
                    </ImageList>
                  ) : (
                    <Box sx={{ 
                      py: 4, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}>
                      <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Aucune image n'a été ajoutée
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Cliquez sur "Ajouter des images" pour télécharger des fichiers
                      </Typography>
                    </Box>
                  )}

                  {!project?.id && formData.images && formData.images.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Les images seront téléchargées après la création du projet
                    </Alert>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        );
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {project ? 'Modifier le projet' : 'Créer un nouveau projet'}
          <IconButton 
            onClick={onClose} 
            size="small"
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {getStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Button 
              onClick={onClose}
              disabled={loading}
              startIcon={<CancelIcon />}
              sx={{ color: theme => theme.palette.text.primary }}
            >
              Annuler
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              startIcon={<ArrowBackIcon />}
              sx={{ color: theme => theme.palette.text.primary }}
            >
              Précédent
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                type="submit"
                variant="contained"
                disabled={loading || uploading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  bgcolor: '#5B348B',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#4A2B70',
                    color: 'white',
                  }
                }}
              >
                {loading ? 'Enregistrement...' : (project ? 'Mettre à jour' : 'Créer')}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#5B348B',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#4A2B70',
                    color: 'white',
                  }
                }}
              >
                Suivant
              </Button>
            )}
          </Box>
        </DialogActions>
      </form>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && success !== null}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
        }}>
          <CircularProgress color="secondary" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {success}
          </Typography>
        </Box>
      </Backdrop>
    </Dialog>
  );
};

export default ProjectForm; 