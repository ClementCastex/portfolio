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
  longDescription: string;
  status: 'completed' | 'in_progress' | 'abandoned';
  categories: string[];
  images: string[];
  websiteUrl?: string;
  githubUrl?: string;
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