import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BookmarkState, Bookmark } from '../../types';

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_, { getState }: any) => {
    const { auth } = getState();
    const response = await fetch('http://localhost:8000/api/bookmarks', {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookmarks');
    }

    const data = await response.json();
    return data;
  }
);

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async (projectId: number, { getState }: any) => {
    const { auth } = getState();
    const response = await fetch('http://localhost:8000/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ projectId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add bookmark');
    }

    const data = await response.json();
    return data;
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async (bookmarkId: number, { getState }: any) => {
    const { auth } = getState();
    const response = await fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove bookmark');
    }

    return bookmarkId;
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
      .addCase(fetchBookmarks.fulfilled, (state, action: PayloadAction<Bookmark[]>) => {
        state.loading = false;
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookmarks';
      })
      .addCase(addBookmark.fulfilled, (state, action: PayloadAction<Bookmark>) => {
        state.bookmarks.push(action.payload);
      })
      .addCase(removeBookmark.fulfilled, (state, action: PayloadAction<number>) => {
        state.bookmarks = state.bookmarks.filter(b => b.id !== action.payload);
      });
  },
});

export default bookmarkSlice.reducer; 