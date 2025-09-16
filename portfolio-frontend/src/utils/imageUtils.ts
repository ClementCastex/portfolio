import { API_BASE_URL } from '../config/api';

export const getFullImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
}; 