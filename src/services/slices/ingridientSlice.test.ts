import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fetchIngridients, initialState } from './ingridientsSlice';
import { getIngredientsApi } from '@api';
import ingridientSlice from './ingridientsSlice';
import { AppDispatch } from '../store';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  }
];

describe('Тестирование ingredients', () => {
  let store: EnhancedStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingridients: ingridientSlice
      }
    });
  });

  test('Проверка начального состояния слайса', () => {
    expect(store.getState().ingridients).toEqual(initialState);
  });

  test('Проверка редьюсера для состояния fetchIngridients.pending', () => {
    const action = fetchIngridients.pending('', undefined);
    const actualState = ingridientSlice(initialState, action);

    expect(actualState).toEqual({
      data: [],
      isLoading: true,
      error: null
    });
  });

  test('Проверка редьюсера для состояния fetchIngridients.fulfilled', () => {
    const action = fetchIngridients.fulfilled(
      ingredientsMockData,
      '',
      undefined
    );
    const actualState = ingridientSlice(initialState, action);

    expect(actualState).toEqual({
      data: ingredientsMockData,
      isLoading: false,
      error: null
    });
  });

  test('Проверка редьюсера для состояния fetchIngridients.rejected', () => {
    const mockError = 'Ошибка сети';
    const action = fetchIngridients.rejected(
      new Error(mockError),
      '',
      undefined
    );
    const actualState = ingridientSlice(initialState, action);

    expect(actualState).toEqual({
      data: [],
      isLoading: false,
      error: mockError
    });
  });
});
