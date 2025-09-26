export type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc' | 'likes_desc' | 'likes_asc';

export const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date (Plus récent)' },
  { value: 'date_asc', label: 'Date (Plus ancien)' },
  { value: 'title_asc', label: 'Titre (A-Z)' },
  { value: 'title_desc', label: 'Titre (Z-A)' },
  { value: 'likes_desc', label: 'Likes (Plus populaire)' },
  { value: 'likes_asc', label: 'Likes (Moins populaire)' },
];

export const sortProjects = <T extends { title: string; likeTotal: number; createdAt: string }>(
  projects: T[],
  sortBy: SortOption
): T[] => {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      case 'likes_asc':
        return a.likeTotal - b.likeTotal;
      case 'likes_desc':
        return b.likeTotal - a.likeTotal;
      case 'date_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date_desc':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}; 