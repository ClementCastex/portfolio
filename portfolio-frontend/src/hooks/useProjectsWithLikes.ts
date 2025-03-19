import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { fetchProjects, updateProjectLikesThunk } from '../store/slices/projectSlice';
import { addBookmark, removeBookmark, fetchBookmarks } from '../store/slices/bookmarkSlice';
import { Project } from '../types';
import { isProjectLiked } from '../utils/projectUtils';

type SortOption = 'title_asc' | 'title_desc' | 'likes_asc' | 'likes_desc' | 'date_asc' | 'date_desc';

interface UseProjectsWithLikesReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  filteredProjects: Project[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (option: string) => void;
  allTags: string[];
  isLiked: (projectId: number) => boolean;
  handleLikeToggle: (projectId: number) => Promise<void>;
}

export const useProjectsWithLikes = (): UseProjectsWithLikesReturn => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const { bookmarks } = useSelector((state: RootState) => state.bookmarks);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProjects() as any);
    dispatch(fetchBookmarks() as any);
  }, [dispatch]);

  useEffect(() => {
    const uniqueTags = Array.from(new Set(projects.flatMap(project => project.categories)));
    setAllTags(uniqueTags);
  }, [projects]);

  // Vérifier si un projet est liké
  const isLiked = (projectId: number) => isProjectLiked(projectId, bookmarks);

  // Filtrer et trier les projets
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || project.categories.includes(selectedTag);
      const matchesStatus = !selectedStatus || project.status === selectedStatus;
      return matchesSearch && matchesTag && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'likes_asc':
          return a.likes - b.likes;
        case 'likes_desc':
          return b.likes - a.likes;
        case 'date_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Gérer le like/unlike d'un projet
  const handleLikeToggle = async (projectId: number) => {
    if (!token) {
      navigate('/login');
      return;
    }

    console.log('Toggling like for project:', projectId);

    try {
      // 1. Trouver le bookmark correspondant au projet
      const bookmark = bookmarks.find(b => b?.project?.id === projectId);
      console.log('Found bookmark:', bookmark);

      let result;
      if (bookmark) {
        // 2. Si le bookmark existe, le supprimer
        console.log('Removing bookmark:', bookmark.id);
        result = await dispatch(removeBookmark(bookmark.id) as any).unwrap();
        console.log('Remove result:', result);
      } else {
        // 3. Sinon, ajouter un nouveau bookmark
        console.log('Adding bookmark for project:', projectId);
        result = await dispatch(addBookmark(projectId) as any).unwrap();
        console.log('Add result:', result);
      }
      
      // 4. Mettre à jour le nombre de likes du projet
      if (result && (result.action === 'added' || result.action === 'removed')) {
        console.log(`Like ${result.action} successfully, updating UI`);
        
        // 5. Mettre à jour le nombre de likes dans le store
        await dispatch(updateProjectLikesThunk({
          projectId: result.project.id,
          likes: result.totalLikes
        }) as any);
        
        // 6. Rafraîchir la liste des bookmarks
        await dispatch(fetchBookmarks() as any);
        
        // 7. Rafraîchir la liste des projets
        await dispatch(fetchProjects() as any);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Une erreur est survenue lors de l\'ajout ou de la suppression du like.');
    }
  };

  return {
    projects,
    loading,
    error,
    filteredProjects,
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
  };
}; 