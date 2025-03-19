import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_ENDPOINTS } from '../config/api';

interface UseLikesReturn {
  likedProjects: Set<number>;
  handleLike: (projectId: number) => Promise<void>;
  isProjectLiked: (projectId: number) => boolean;
}

export const useLikes = (): UseLikesReturn => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());

  const handleLike = useCallback(async (projectId: number) => {
    if (!token) {
      // Rediriger vers la page de connexion ou afficher un message
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like project');
      }

      setLikedProjects(prev => {
        const newSet = new Set(prev);
        if (newSet.has(projectId)) {
          newSet.delete(projectId);
        } else {
          newSet.add(projectId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error liking project:', error);
    }
  }, [token]);

  const isProjectLiked = useCallback((projectId: number) => {
    return likedProjects.has(projectId);
  }, [likedProjects]);

  return {
    likedProjects,
    handleLike,
    isProjectLiked,
  };
}; 