import React from 'react';
import {
  ImageList,
  ImageListItem,
  IconButton,
  Box,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageGalleryProps {
  images: string[];
  onImageDelete?: (index: number) => void;
  onImagesUpload?: (files: FileList) => void;
  projectId?: number;
  isEditable?: boolean;
  uploading?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImageDelete,
  onImagesUpload,
  projectId,
  isEditable = false,
  uploading = false,
}) => {
  const { getFullImageUrl } = useImageUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && onImagesUpload) {
      onImagesUpload(event.target.files);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Images du projet
      </Typography>
      
      {!projectId && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Les images seront uploadées après la création du projet
        </Alert>
      )}

      {isEditable && (
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
      )}

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
              {isEditable && onImageDelete && (
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
                  onClick={() => onImageDelete(index)}
                >
                  <DeleteIcon sx={{ color: 'white' }} />
                </IconButton>
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default ImageGallery; 