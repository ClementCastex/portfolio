import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotesState, Note, NoteTag } from '../../types';
import { API_BASE_URL } from '../../config/api';

const initialState: NotesState = {
  notes: [],
  tags: [],
  activeNoteId: null,
  loading: false,
  error: null,
  unsavedChanges: {},
};

// API Endpoints
const NOTES_API = {
  NOTES: `${API_BASE_URL}/api/notes`,
  TAGS: `${API_BASE_URL}/api/note-tags`,
};

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params: { search?: string; tagId?: number; archived?: boolean }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.tagId) searchParams.append('tagId', params.tagId.toString());
      if (params.archived) searchParams.append('archived', 'true');

      const response = await fetch(
        `${NOTES_API.NOTES}?${searchParams.toString()}`,
        { headers: getAuthHeaders(auth.token) }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData: { title: string; contentHtml?: string; tagIds?: number[] }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      console.log('🔑 Auth state:', { hasToken: !!auth.token, user: auth.user });
      
      if (!auth.token) throw new Error('No token available');

      console.log('📡 Sending request to:', NOTES_API.NOTES);
      console.log('📦 Data:', noteData);

      const response = await fetch(NOTES_API.NOTES, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(noteData),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Note created successfully:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Create note error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, ...noteData }: { id: number; title?: string; contentHtml?: string; tagIds?: number[]; isArchived?: boolean }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${NOTES_API.NOTES}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(noteData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${NOTES_API.NOTES}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const duplicateNote = createAsyncThunk(
  'notes/duplicateNote',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${NOTES_API.NOTES}/${id}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTags = createAsyncThunk(
  'notes/fetchTags',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(NOTES_API.TAGS, {
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTag = createAsyncThunk(
  'notes/createTag',
  async (tagData: { name: string; colorHex: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(NOTES_API.TAGS, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(tagData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setActiveNote: (state, action: PayloadAction<number | null>) => {
      state.activeNoteId = action.payload;
    },
    setUnsavedChanges: (state, action: PayloadAction<{ noteId: number; hasChanges: boolean }>) => {
      state.unsavedChanges[action.payload.noteId] = action.payload.hasChanges;
    },
    clearUnsavedChanges: (state, action: PayloadAction<number>) => {
      delete state.unsavedChanges[action.payload];
    },
    updateNoteContent: (state, action: PayloadAction<{ id: number; title?: string; contentHtml?: string }>) => {
      const note = state.notes.find(n => n.id === action.payload.id);
      if (note) {
        if (action.payload.title !== undefined) note.title = action.payload.title;
        if (action.payload.contentHtml !== undefined) note.contentHtml = action.payload.contentHtml;
        state.unsavedChanges[note.id] = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.activeNoteId = action.payload.id;
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
          delete state.unsavedChanges[action.payload.id];
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.id !== action.payload);
        if (state.activeNoteId === action.payload) {
          state.activeNoteId = state.notes.length > 0 ? state.notes[0].id : null;
        }
        delete state.unsavedChanges[action.payload];
      })
      // Duplicate note
      .addCase(duplicateNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.activeNoteId = action.payload.id;
      })
      // Fetch tags
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      // Create tag
      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      });
  },
});

export const { setActiveNote, setUnsavedChanges, clearUnsavedChanges, updateNoteContent } = notesSlice.actions;
export default notesSlice.reducer;
