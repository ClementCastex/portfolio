import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { API_ENDPOINTS } from '../../config/api';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Récupérer le token et l'utilisateur du localStorage au démarrage
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

if (storedToken) {
  initialState.token = storedToken;
}
if (storedUser) {
  try {
    initialState.user = JSON.parse(storedUser);
  } catch (e) {
    localStorage.removeItem('user');
  }
}

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(API_ENDPOINTS.ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        return rejectWithValue('Failed to load user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Failed to load user');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      console.log('Tentative de connexion à:', API_ENDPOINTS.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          password
        }),
      });

      console.log('Status de la réponse:', response.status);
      const data = await response.json().catch(e => {
        console.error('Erreur parsing JSON:', e);
        return null;
      });
      console.log('Réponse du serveur:', data);

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || 'Échec de la connexion';
        console.error('Erreur de connexion:', errorMessage);
        return rejectWithValue(errorMessage);
      }

      if (!data || !data.token) {
        console.error('Réponse invalide du serveur:', data);
        return rejectWithValue('Réponse invalide du serveur');
      }

      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);

      // Charger les informations utilisateur complètes
      const userResponse = await fetch(API_ENDPOINTS.ME, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        return rejectWithValue('Impossible de charger les informations utilisateur');
      }

      const userData = await userResponse.json();
      console.log('User data from /api/me:', userData);

      // Stocker les informations utilisateur dans le localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return {
        token: data.token,
        user: userData
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return rejectWithValue('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ 
    email, 
    password, 
    firstName, 
    lastName 
  }: { 
    email: string; 
    password: string;
    firstName: string;
    lastName: string;
  }, { rejectWithValue }) => {
    try {
      console.log('Tentative d\'inscription à:', API_ENDPOINTS.REGISTER);
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      console.log('Status de la réponse:', response.status);
      const data = await response.json().catch(e => {
        console.error('Erreur parsing JSON:', e);
        return null;
      });
      console.log('Réponse du serveur:', data);

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || 'Échec de l\'inscription';
        console.error('Erreur d\'inscription:', errorMessage);
        return rejectWithValue(errorMessage);
      }

      if (!data || !data.token) {
        console.error('Réponse invalide du serveur:', data);
        return rejectWithValue('Réponse invalide du serveur');
      }

      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return rejectWithValue('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        // Sauvegarder l'utilisateur mis à jour
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Une erreur est survenue lors de la connexion';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Une erreur est survenue lors de l\'inscription';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 