import { useState, useMemo } from 'react';
import { Project } from '../types';

type SortOption = 'title_asc' | 'title_desc' | 'likes_asc' | 'likes_desc' | 'date_asc' | 'date_desc';

export const useProjectFilters = (projects: Project[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !selectedStatus || project.status === selectedStatus;
        const matchesCategory = !selectedCategory || project.categories.includes(selectedCategory);
        return matchesSearch && matchesStatus && matchesCategory;
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
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [projects, searchQuery, selectedStatus, selectedCategory, sortBy]);

  // Get unique categories from all projects
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    projects.forEach(project => {
      project.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories).sort();
  }, [projects]);

  // Get unique statuses from all projects
  const allStatuses = useMemo(() => {
    const statuses = new Set<string>();
    projects.forEach(project => {
      statuses.add(project.status);
    });
    return Array.from(statuses).sort();
  }, [projects]);

  return {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProjects,
    allCategories,
    allStatuses,
  };
}; 