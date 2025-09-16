import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { API_ENDPOINTS } from '../../config/api';

interface ImageUploadProps {
  projectId: number;
  images: string[];
  onImagesUpdate: (newImages: string[]) => void;
  token: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ projectId, images, onImagesUpdate, token }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images[]', file);
    });

    try {
      const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${projectId}/images`, {
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
      onImagesUpdate(data.images);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${projectId}/images/${index}`, {
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
      onImagesUpdate(newImages);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          disabled={uploading}
        >
          Upload Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>
        {uploading && (
          <Typography variant="body2" color="text.secondary">
            Uploading...
          </Typography>
        )}
      </Box>

      <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} rowHeight={200}>
        {images.map((image, index) => (
          <ImageListItem key={index} sx={{ position: 'relative' }}>
            <img
              src={image}
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
    </Box>
  );
};

export default ImageUpload; 