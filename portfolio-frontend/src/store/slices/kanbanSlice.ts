import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { KanbanState, KanbanBoard, KanbanCard } from '../../types';
import { API_BASE_URL } from '../../config/api';

const initialState: KanbanState = {
  boards: [],
  activeBoard: null,
  loading: false,
  error: null,
  draggedCard: null,
};

// API Endpoints
const KANBAN_API = {
  KANBANS: `${API_BASE_URL}/api/kanbans`,
  CALENDAR: `${API_BASE_URL}/api/calendar`,
};

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Async thunks
export const fetchKanbans = createAsyncThunk(
  'kanban/fetchKanbans',
  async (params: { search?: string; sortBy?: string } = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);

      const response = await fetch(
        `${KANBAN_API.KANBANS}?${searchParams.toString()}`,
        { headers: getAuthHeaders(auth.token) }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchKanban = createAsyncThunk(
  'kanban/fetchKanban',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${KANBAN_API.KANBANS}/${id}`, {
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createKanban = createAsyncThunk(
  'kanban/createKanban',
  async (boardData: { name: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(KANBAN_API.KANBANS, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(boardData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateKanban = createAsyncThunk(
  'kanban/updateKanban',
  async ({ id, ...boardData }: { id: number; name?: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${KANBAN_API.KANBANS}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(boardData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteKanban = createAsyncThunk(
  'kanban/deleteKanban',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${KANBAN_API.KANBANS}/${id}`, {
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

export const createColumn = createAsyncThunk(
  'kanban/createColumn',
  async ({ kanbanId, ...columnData }: { kanbanId: number; name: string; position?: number }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/kanbans/${kanbanId}/columns`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(columnData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCard = createAsyncThunk(
  'kanban/createCard',
  async ({ columnId, ...cardData }: { columnId: number; title: string; descriptionHtml?: string; dueAt?: string; tagIds?: number[] }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/columns/${columnId}/cards`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(cardData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCard = createAsyncThunk(
  'kanban/updateCard',
  async ({ id, ...cardData }: { id: number; title?: string; descriptionHtml?: string; dueAt?: string; position?: number; columnId?: number; tagIds?: number[] }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/cards/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify(cardData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateColumn = createAsyncThunk(
  'kanban/updateColumn',
  async ({ id, name }: { id: number; name: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/columns/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteColumn = createAsyncThunk(
  'kanban/deleteColumn',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/columns/${id}`, {
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

export const createTag = createAsyncThunk(
  'kanban/createTag',
  async ({ kanbanId, name, colorHex }: { kanbanId: number; name: string; colorHex: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/kanbans/${kanbanId}/tags`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify({ name, colorHex }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadCardFile = createAsyncThunk(
  'kanban/uploadCardFile',
  async ({ cardId, file }: { cardId: number; file: File }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardFile = createAsyncThunk(
  'kanban/deleteCardFile',
  async (fileId: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCardLink = createAsyncThunk(
  'kanban/createCardLink',
  async ({ cardId, url }: { cardId: number; url: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}/links`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardLink = createAsyncThunk(
  'kanban/deleteCardLink',
  async (linkId: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return linkId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCardComment = createAsyncThunk(
  'kanban/createCardComment',
  async ({ cardId, content }: { cardId: number; content: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(auth.token),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardComment = createAsyncThunk(
  'kanban/deleteCardComment',
  async (commentId: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(auth.token),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCalendarEvents = createAsyncThunk(
  'kanban/fetchCalendarEvents',
  async ({ from, to }: { from: string; to: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) throw new Error('No token');

      const searchParams = new URLSearchParams({ from, to });
      const response = await fetch(
        `${KANBAN_API.CALENDAR}?${searchParams.toString()}`,
        { headers: getAuthHeaders(auth.token) }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<KanbanBoard | null>) => {
      state.activeBoard = action.payload;
    },
    setDraggedCard: (state, action: PayloadAction<KanbanCard | null>) => {
      state.draggedCard = action.payload;
    },
    // Optimistic updates for drag & drop
    moveCard: (state, action: PayloadAction<{ cardId: number; fromColumnId: number; toColumnId: number; newPosition: number }>) => {
      if (!state.activeBoard) return;
      
      const { cardId, fromColumnId, toColumnId, newPosition } = action.payload;
      
      // Find and remove card from source column
      const fromColumn = state.activeBoard.columns.find(col => col.id === fromColumnId);
      const toColumn = state.activeBoard.columns.find(col => col.id === toColumnId);
      
      if (!fromColumn || !toColumn) return;
      
      const cardIndex = fromColumn.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return;
      
      const [card] = fromColumn.cards.splice(cardIndex, 1);
      
      // Add card to destination column at new position
      toColumn.cards.splice(newPosition, 0, card);
      
      // Update positions
      fromColumn.cards.forEach((card, index) => {
        card.position = index;
      });
      toColumn.cards.forEach((card, index) => {
        card.position = index;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch kanbans
      .addCase(fetchKanbans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKanbans.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
        state.error = null;
      })
      .addCase(fetchKanbans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single kanban
      .addCase(fetchKanban.fulfilled, (state, action) => {
        // Ensure all card properties are properly initialized
        const board = action.payload;
        if (board.columns) {
          board.columns.forEach((column: any) => {
            if (column.cards) {
              column.cards.forEach((card: any) => {
                card.tags = card.tags || [];
                card.files = card.files || [];
                card.links = card.links || [];
                card.comments = card.comments || [];
                card.checklist = card.checklist || [];
                card.assignedUserIds = card.assignedUserIds || [];
                card.checklistProgress = card.checklistProgress || { completed: 0, total: 0, percentage: 0 };
                card.priorityColor = card.priorityColor || '#9e9e9e';
              });
            }
          });
        }
        state.activeBoard = board;
      })
      // Create kanban
      .addCase(createKanban.fulfilled, (state, action) => {
        state.boards.unshift(action.payload);
        state.activeBoard = action.payload;
      })
      // Update kanban
      .addCase(updateKanban.fulfilled, (state, action) => {
        const index = state.boards.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
        if (state.activeBoard?.id === action.payload.id) {
          state.activeBoard = action.payload;
        }
      })
      // Delete kanban
      .addCase(deleteKanban.fulfilled, (state, action) => {
        state.boards = state.boards.filter(b => b.id !== action.payload);
        if (state.activeBoard?.id === action.payload) {
          state.activeBoard = null;
        }
      })
      // Create column
      .addCase(createColumn.fulfilled, (state, action) => {
        if (state.activeBoard) {
          state.activeBoard.columns.push(action.payload);
        }
      })
      // Update column
      .addCase(updateColumn.fulfilled, (state, action) => {
        if (state.activeBoard) {
          const columnIndex = state.activeBoard.columns.findIndex(col => col.id === action.payload.id);
          if (columnIndex !== -1) {
            state.activeBoard.columns[columnIndex] = action.payload;
          }
        }
      })
      // Delete column
      .addCase(deleteColumn.fulfilled, (state, action) => {
        if (state.activeBoard) {
          state.activeBoard.columns = state.activeBoard.columns.filter(col => col.id !== action.payload);
        }
      })
      // Create card
      .addCase(createCard.fulfilled, (state, action) => {
        if (state.activeBoard) {
          const column = state.activeBoard.columns.find(col => col.id === action.meta.arg.columnId);
          if (column) {
            const card = action.payload;
            // Ensure all properties are initialized
            card.tags = card.tags || [];
            card.files = card.files || [];
            card.links = card.links || [];
            card.comments = card.comments || [];
            card.checklist = card.checklist || [];
            card.assignedUserIds = card.assignedUserIds || [];
            card.checklistProgress = card.checklistProgress || { completed: 0, total: 0, percentage: 0 };
            card.priorityColor = card.priorityColor || '#9e9e9e';
            column.cards.push(card);
          }
        }
      })
      // Update card
      .addCase(updateCard.fulfilled, (state, action) => {
        if (state.activeBoard) {
          // Find and update the card in the active board
          for (const column of state.activeBoard.columns) {
            const cardIndex = column.cards.findIndex(card => card.id === action.payload.id);
            if (cardIndex !== -1) {
              column.cards[cardIndex] = action.payload;
              break;
            }
          }
        }
      })
      // Create tag
      .addCase(createTag.fulfilled, (state, action) => {
        if (state.activeBoard) {
          state.activeBoard.tags.push(action.payload);
        }
      })
      // Upload file
      .addCase(uploadCardFile.fulfilled, (state, action) => {
        if (state.activeBoard) {
          for (const column of state.activeBoard.columns) {
            const card = column.cards.find(c => c.id === action.meta.arg.cardId);
            if (card) {
              card.files.push(action.payload);
              break;
            }
          }
        }
      })
      // Delete file
      .addCase(deleteCardFile.fulfilled, (state, action) => {
        if (state.activeBoard) {
          for (const column of state.activeBoard.columns) {
            for (const card of column.cards) {
              card.files = card.files.filter(file => file.id !== action.payload);
            }
          }
        }
      })
      // Create link
      .addCase(createCardLink.fulfilled, (state, action) => {
        if (state.activeBoard) {
          for (const column of state.activeBoard.columns) {
            const card = column.cards.find(c => c.id === action.meta.arg.cardId);
            if (card) {
              card.links.push(action.payload);
              break;
            }
          }
        }
      })
      // Delete link
      .addCase(deleteCardLink.fulfilled, (state, action) => {
        if (state.activeBoard) {
          for (const column of state.activeBoard.columns) {
            for (const card of column.cards) {
              card.links = card.links.filter(link => link.id !== action.payload);
            }
          }
        }
      })
      // Create comment
      .addCase(createCardComment.fulfilled, (state, action) => {
        if (state.activeBoard) {
          for (const column of state.activeBoard.columns) {
            const card = column.cards.find(c => c.id === action.meta.arg.cardId);
            if (card) {
              card.comments.push(action.payload);
              break;
            }
          }
        }
      })
      // Delete comment
      .addCase(deleteCardComment.fulfilled, (state, action) => {
        if (state.activeBoard) {
          for (const column of state.activeBoard.columns) {
            for (const card of column.cards) {
              card.comments = card.comments.filter(comment => comment.id !== action.payload);
            }
          }
        }
      });
  },
});

export const { setActiveBoard, setDraggedCard, moveCard } = kanbanSlice.actions;
export default kanbanSlice.reducer;
