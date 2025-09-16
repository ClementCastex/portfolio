import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BookmarkState, Bookmark, Project } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface BookmarkResponse {
  id: number;
  project: Project;
  totalLikes: number;
  action: 'added' | 'removed';
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_, { getState, rejectWithValue }: any) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch bookmarks');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch bookmarks');
    }
  }
);

export const addBookmark = createAsyncThunk<BookmarkResponse, number>(
  'bookmarks/addBookmark',
  async (projectId: number, { getState, rejectWithValue }: any) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/api/bookmarks/project/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add bookmark');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add bookmark');
    }
  }
);

export const removeBookmark = createAsyncThunk<BookmarkResponse, number>(
  'bookmarks/removeBookmark',
  async (bookmarkId: number, { getState, rejectWithValue }: any) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to remove bookmark');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove bookmark');
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
        state.error = null;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookmarks';
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        if (action.payload.action === 'added') {
          state.bookmarks.push({
            id: action.payload.id,
            project: action.payload.project,
            createdAt: new Date().toISOString()
          });
        }
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.bookmarks = state.bookmarks.filter(b => b.id !== action.payload.id);
        }
      });
  },
});

export default bookmarkSlice.reducer; 