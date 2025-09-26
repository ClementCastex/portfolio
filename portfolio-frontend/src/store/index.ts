import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import notesReducer from './slices/notesSlice';
import kanbanReducer from './slices/kanbanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    bookmarks: bookmarkReducer,
    notes: notesReducer,
    kanban: kanbanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 