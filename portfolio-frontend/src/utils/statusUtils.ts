export type ProjectStatus = 'completed' | 'in_progress' | 'abandoned';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'abandoned':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in_progress':
      return 'En cours';
    case 'abandoned':
      return 'Abandonné';
    default:
      return status;
  }
};

export const STATUS_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'completed', label: 'Terminé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'abandoned', label: 'Abandonné' },
]; 