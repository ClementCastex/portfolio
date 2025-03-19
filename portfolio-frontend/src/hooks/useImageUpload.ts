import { useState, useCallback } from 'react';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

interface UseImageUploadReturn {
  uploading: boolean;
  uploadImages: (files: FileList, projectId: number, token: string) => Promise<string[]>;
  deleteImage: (imageUrl: string, projectId: number, token: string) => Promise<void>;
  getFullImageUrl: (imagePath: string) => string;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);

  const uploadImages = useCallback(async (files: FileList, projectId: number, token: string): Promise<string[]> => {
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
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
      return data.images;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageUrl: string, projectId: number, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${projectId}/images`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }, []);

  const getFullImageUrl = useCallback((imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  }, []);

  return {
    uploading,
    uploadImages,
    deleteImage,
    getFullImageUrl,
  };
}; 