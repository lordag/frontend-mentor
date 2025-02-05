import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Crea un thunk per ottenere il token con una GET
export const fetchToken = createAsyncThunk(
    'token/fetchToken',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:5000/generate-jwt'); // Cambiato in GET
        if (!response.ok) {
          throw new Error('Token not found');
        }
        const data = await response.json();
        return data.token; // Restituisci il token
      } catch (error) {
        console.log(error);
        return rejectWithValue(error.message); // In caso di errore, usa rejectWithValue per passare l'errore
      }
    }
  );
  
// Crea lo slice di Redux per il token
const tokenSlice = createSlice({
    name: 'token',
    initialState: {
      token: null,
      loading: false,
      error: null,
    },
    reducers: {
      clearToken: (state) => {
        state.token = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchToken.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchToken.fulfilled, (state, action) => {
          state.token = action.payload;
          state.loading = false;
        })
        .addCase(fetchToken.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { clearToken } = tokenSlice.actions;
  export default tokenSlice.reducer;