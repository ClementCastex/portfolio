import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState, Project } from '../../types';
import { API_ENDPOINTS } from '../../config/api';

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await fetch(API_ENDPOINTS.PROJECTS, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    return data;
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

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
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
      });
  },
});

export default projectSlice.reducer; 