import { SvgIconProps } from '@mui/material';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  categories: string[];
  status: string;
  githubUrl?: string;
  websiteUrl?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: number;
  project: Project;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
}

export interface ProjectCardProps {
  project: Project;
  onLikeToggle: (projectId: number) => void;
  isLiked: boolean;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
  actionLoading?: number | null;
}

export interface SkillCardProps {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  description: string;
}

// Notes system types
export interface Note {
  id: number;
  title: string;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
  lastSyncAt: string;
  isArchived: boolean;
  tags: NoteTag[];
  assets: NoteAsset[];
}

export interface NoteTag {
  id: number;
  name: string;
  colorHex: string;
  createdAt: string;
}

export interface NoteAsset {
  id: number;
  type: 'image' | 'file';
  filename: string;
  mime: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface NotesState {
  notes: Note[];
  tags: NoteTag[];
  activeNoteId: number | null;
  loading: boolean;
  error: string | null;
  unsavedChanges: Record<number, boolean>;
}

export interface NoteTabProps {
  note: Note;
  isActive: boolean;
  hasUnsavedChanges: boolean;
  onSelect: () => void;
  onClose: () => void;
  onDuplicate: () => void;
}

// Kanban system types
export interface KanbanBoard {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  columns: KanbanColumn[];
  tags: KanbanCardTag[];
}

export interface KanbanColumn {
  id: number;
  name: string;
  position: number;
  cards: KanbanCard[];
}

export interface KanbanCard {
  id: number;
  title: string;
  descriptionHtml: string;
  dueAt: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  tags: KanbanCardTag[];
  files: KanbanCardFile[];
  links: KanbanCardLink[];
  isOverdue: boolean;
}

export interface KanbanCardTag {
  id: number;
  name: string;
  colorHex: string;
  createdAt: string;
}

export interface KanbanCardFile {
  id: number;
  filename: string;
  mime: string;
  size: number;
  url: string;
  isImage: boolean;
  createdAt: string;
}

export interface KanbanCardLink {
  id: number;
  url: string;
  title: string | null;
  faviconUrl: string | null;
  createdAt: string;
}

export interface KanbanState {
  boards: KanbanBoard[];
  activeBoard: KanbanBoard | null;
  loading: boolean;
  error: string | null;
  draggedCard: KanbanCard | null;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  isOverdue: boolean;
  card: KanbanCard;
}

export interface SocialButtonProps {
  href: string;
  icon: React.ReactElement;
  ariaLabel?: string;
} 