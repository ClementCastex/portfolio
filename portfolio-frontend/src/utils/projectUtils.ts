import { API_BASE_URL } from '../config/api';

// Obtenir l'URL complète pour les images
export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

// Obtenir la couleur du statut
export const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'warning';
    case 'ABANDONED':
      return 'error';
    default:
      return 'default';
  }
};

// Obtenir le libellé du statut
export const getStatusLabel = (status: string): string => {
  return status.replace('_', ' ').toLowerCase();
};

// Vérifier si un projet est liké par l'utilisateur
export const isProjectLiked = (projectId: number, bookmarks: any[]): boolean => {
  return bookmarks.some(bookmark => 
    bookmark && 
    bookmark.project && 
    bookmark.project.id === projectId
  );
}; 