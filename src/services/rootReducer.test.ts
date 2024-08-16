import { rootReducer } from '../services/store';
import { initialState as feedsInitialState } from './slices/feedsSlice';
import { initialState as constructorInitialState } from './slices/burgerConstructorSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as orderInitialState } from './slices/ordersSlice';
import { initialState as ingridientInitialState } from './slices/ingridientsSlice';

describe('rootReducer', () => {
  test('должен возвращать начальное состояние при неизвестном действии', () => {
    // Вызов rootReducer с undefined состоянием и неизвестным действием
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    // Ожидаемое начальное состояние
    const expectedState = {
      user: userInitialState,
      orders: orderInitialState,
      ingridients: ingridientInitialState,
      burgerConstructor: constructorInitialState,
      feeds: feedsInitialState
    };

    // Проверяем, что состояние соответствует начальному
    expect(state).toEqual(expectedState);
  });
});
