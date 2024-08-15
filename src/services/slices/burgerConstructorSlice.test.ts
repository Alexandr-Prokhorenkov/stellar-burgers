import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  setBun,
  addIngridient,
  removeIngridient,
  resetConstructor,
  moveIngridientUp,
  moveIngridientDown,
  initialState
} from '../slices/burgerConstructorSlice';

import ConstructorReducer from '../slices/burgerConstructorSlice';

const bunMockData = {
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
};

const ingredient1MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '1234567890',
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
};

const ingredient2MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '0987654321',
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
};

describe('Тестирование ConstructorSlice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        burgerConstructor: ConstructorReducer
      }
    });
  });

  test('Проверка начального состояния слайса', () => {
    expect(store.getState().burgerConstructor).toEqual(initialState);
  });

  test('Действие setBun должно правильно установить булку', () => {
    store.dispatch(setBun(bunMockData));
    expect(store.getState().burgerConstructor.bun).toEqual(bunMockData);
  });

  test('Действие addIngridient должно правильно добавить ингредиент', () => {
    store.dispatch(addIngridient(ingredient1MockData));
    expect(store.getState().burgerConstructor.ingredients).toContainEqual(
      ingredient1MockData
    );
  });

  test('Действие removeIngridient должно правильно удалить ингредиент по id', () => {
    store.dispatch(addIngridient(ingredient1MockData));
    store.dispatch(addIngridient(ingredient2MockData));
    store.dispatch(removeIngridient(ingredient1MockData.id));
    expect(store.getState().burgerConstructor.ingredients).toEqual([
      ingredient2MockData
    ]);
  });

  test('Действие resetConstructor должно сбросить состояние', () => {
    store.dispatch(setBun(bunMockData));
    store.dispatch(addIngridient(ingredient1MockData));
    store.dispatch(resetConstructor());
    expect(store.getState().burgerConstructor.bun).toBeNull();
    expect(store.getState().burgerConstructor.ingredients).toEqual([]);
  });

  test('Действие moveIngridientUp должно правильно переместить ингредиент вверх', () => {
    store.dispatch(addIngridient(ingredient1MockData));
    store.dispatch(addIngridient(ingredient2MockData));

    store.dispatch(moveIngridientUp(1)); // Переместить ingredient2 вверх

    expect(store.getState().burgerConstructor.ingredients).toEqual([
      ingredient2MockData,
      ingredient1MockData
    ]);
  });

  test('Действие moveIngridientDown должно правильно переместить ингредиент вниз', () => {
    store.dispatch(addIngridient(ingredient1MockData));
    store.dispatch(addIngridient(ingredient2MockData));
    store.dispatch(moveIngridientDown(0)); // Переместить ingredient1 вниз
    expect(store.getState().burgerConstructor.ingredients).toEqual([
      ingredient2MockData,
      ingredient1MockData
    ]);
  });
});
