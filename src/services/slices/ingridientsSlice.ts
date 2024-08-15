import { getIngredientsApi } from '@api';
import { RootState } from '../store';
import { TIngredient } from './../../utils/types';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';

export const fetchIngridients = createAsyncThunk(
  'ingridients/fetchIngridients',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const ingridientsState = state.ingridients;
    if (ingridientsState.data.length > 0) {
      return ingridientsState.data;
    } else {
      try {
        const response = await getIngredientsApi();
        return response;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  }
);

type TIngridientsState = {
  isLoading: boolean;
  error: null | string;
  data: TIngredient[];
};

export const initialState: TIngridientsState = {
  isLoading: true,
  error: null,
  data: []
};

const IngridientsSlice = createSlice({
  name: 'ingridientsSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngridients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngridients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(fetchIngridients.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = action.error.message || 'Ошибка сети';
        }
      });
  }
});

export default IngridientsSlice.reducer;
