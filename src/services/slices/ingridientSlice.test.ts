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

  test('Проверка состояния при запросе fetchIngridients (pending)', async () => {
    // Мокаем запрос API
    (getIngredientsApi as jest.Mock).mockResolvedValue(ingredientsMockData);

    const dispatch = store.dispatch as AppDispatch;
    const action = dispatch(fetchIngridients());

    // Проверяем, что isLoading установлен в true
    expect(store.getState().ingridients.isLoading).toBe(true);
    expect(store.getState().ingridients.error).toBeNull();

    await action; // Дожидаемся завершения асинхронной операции

    // Проверяем состояние после завершения запроса
    const state = store.getState().ingridients;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(ingredientsMockData);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном выполнении запроса fetchIngridients (fulfilled)', async () => {
    // Мокаем успешный ответ API
    (getIngredientsApi as jest.Mock).mockResolvedValue(ingredientsMockData);

    const dispatch = store.dispatch as AppDispatch;
    await dispatch(fetchIngridients());

    // Проверяем состояние после успешного выполнения запроса
    const state = store.getState().ingridients;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(ingredientsMockData);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при ошибке выполнения запроса fetchIngridients (rejected)', async () => {
    // Мокаем ошибку API
    const mockError = 'Ошибка сети';
    (getIngredientsApi as jest.Mock).mockRejectedValue(mockError);

    const dispatch = store.dispatch as AppDispatch;
    const action = dispatch(fetchIngridients());

    // Проверяем состояние при выполнении запроса
    expect(store.getState().ingridients.isLoading).toBe(true);
    expect(store.getState().ingridients.error).toBeNull();

    await action; // Дожидаемся завершения асинхронной операции

    // Проверяем состояние после завершения запроса
    const state = store.getState().ingridients;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual([]);
    expect(state.error).toEqual(mockError);
  });
});
