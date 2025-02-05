import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = import.meta.env.VITE_API_URL;

// Thunk per ottenere la lista dei repository
export const fetchRepositories = createAsyncThunk(
    'repositories/fetchRepositories',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState();
        const token = state.token.token; // Recupera il token dallo stato globale Redux
  
        if (!token) {
          throw new Error('Token non disponibile');
        }
  
        const response = await fetch(`${apiUrl}/repositories`, {
          headers: {
            Authorization: token, // Passa il token nell'intestazione
          },
        });
  
        if (!response.ok) {
          throw new Error('Errore nel recupero dei repository');
        }
  
        const data = await response.json();
        return data.repositories; // Restituisci la lista dei repository
      } catch (error) {
        return rejectWithValue(error.message); // Gestione degli errori
      }
    }
  );
  

const repositoriesSlice = createSlice({
  name: 'repositories',
  initialState: {
    repositories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.repositories = action.payload;
        state.loading = false;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default repositoriesSlice.reducer;
