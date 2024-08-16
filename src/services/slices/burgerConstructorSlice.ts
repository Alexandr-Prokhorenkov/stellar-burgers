import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../services/store';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const ConstructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient | null>) {
      state.bun = action.payload;
    },
    addIngridient(state, action: PayloadAction<TConstructorIngredient>) {
      const newIngredient = action.payload;
      if (newIngredient.type === 'bun') {
        state.bun = newIngredient;
      } else {
        state.ingredients.push(newIngredient);
      }
    },
    removeIngridient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngridientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index === 0) return;
      const ingredientLink = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index - 1];
      state.ingredients[index - 1] = ingredientLink;
    },
    moveIngridientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index === state.ingredients.length - 1) return;
      const ingredientLink = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index + 1];
      state.ingredients[index + 1] = ingredientLink;
    }
  }
});

export const {
  setBun,
  addIngridient,
  removeIngridient,
  resetConstructor,
  moveIngridientUp,
  moveIngridientDown
} = ConstructorSlice.actions;

export default ConstructorSlice.reducer;

export const addIngredientWithId =
  (ingredient: TIngredient) => (dispatch: AppDispatch) => {
    const newIngredient: TConstructorIngredient = {
      ...ingredient,
      id: uuidv4()
    };
    dispatch(addIngridient(newIngredient));
  };
