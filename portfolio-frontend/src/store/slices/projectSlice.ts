import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState, Project } from '../../types';
import { API_ENDPOINTS } from '../../config/api';
import { API_BASE_URL } from '../../config/api';

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS);
      const data = await response.json();
      
      // Assurez-vous que chaque projet a une propriété likes
      return data.map((project: any) => ({
        ...project,
        // Vérifier si likes ou likeTotal existe, sinon mettre 0
        likes: project.likes || project.likeTotal || 0,
      }));
    } catch (error) {
      return rejectWithValue('Erreur lors du chargement des projets');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, { getState }: any) => {
    const { auth } = getState();
    const response = await fetch(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    const data = await response.json();
    return data;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: number; projectData: Partial<Project> }, { getState }: any) => {
    const { auth } = getState();
    const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    const data = await response.json();
    return data;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: number, { getState }: any) => {
    const { auth } = getState();
    const response = await fetch(`${API_ENDPOINTS.PROJECTS}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

    return id;
  }
);

export const updateProjectLikesThunk = createAsyncThunk(
  'projects/updateLikesThunk',
  async (data: { projectId: number; likes: number }, { dispatch }) => {
    console.log('Updating project likes:', data);
    // Vous pourriez appeler une API ici si nécessaire
    return data;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(updateProjectLikesThunk.fulfilled, (state, action) => {
        console.log('Updating project likes in reducer:', action.payload);
        const project = state.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          project.likes = action.payload.likes;
          console.log('Project likes updated successfully:', project);
        } else {
          console.warn('Project not found for updating likes:', action.payload.projectId);
        }
      });
  },
});

export default projectSlice.reducer; 