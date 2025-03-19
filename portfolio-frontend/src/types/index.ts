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
  onLike?: (projectId: number) => void;
  isLiked?: boolean;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
}

export interface SkillCardProps {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  description: string;
}

export interface SocialButtonProps {
  href: string;
  icon: React.ReactElement;
  ariaLabel?: string;
} 