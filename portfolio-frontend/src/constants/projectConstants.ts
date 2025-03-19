export enum ProjectStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  ABANDONED = 'ABANDONED',
}

export const PROJECT_STATUS_LABELS = {
  [ProjectStatus.COMPLETED]: 'Terminé',
  [ProjectStatus.IN_PROGRESS]: 'En cours',
  [ProjectStatus.ABANDONED]: 'Abandonné',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  [ProjectStatus.COMPLETED]: 'success',
  [ProjectStatus.IN_PROGRESS]: 'warning',
  [ProjectStatus.ABANDONED]: 'error',
};

export const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date (Plus récent)' },
  { value: 'date_asc', label: 'Date (Plus ancien)' },
  { value: 'title_asc', label: 'Titre (A-Z)' },
  { value: 'title_desc', label: 'Titre (Z-A)' },
  { value: 'likes_desc', label: 'Likes (Plus populaire)' },
  { value: 'likes_asc', label: 'Likes (Moins populaire)' },
]; 