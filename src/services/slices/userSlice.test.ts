import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import userSlice, {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  fetchUser,
  initialState,
  TUserState
} from '../slices/userSlice';

// Мокаем API
jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

// Моковые данные
const userMockData = {
  email: 'example@example.mail',
  name: 'Example'
};

const registerMockData = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example'
};

const loginMockData = {
  email: 'example@example.mail',
  password: 'Example'
};

type RootState = {
  user: TUserState;
};

type Store = EnhancedStore<RootState>;

describe('Тестирование userSlice', () => {
  let store: Store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userSlice
      },
      preloadedState: {
        user: initialState
      }
    }) as Store;
  });

  describe('Асинхронная функция для регистрации: register', () => {
    test('Начало запроса: register.pending', () => {
      store.dispatch(registerUser.pending('pending', registerMockData));
      const state = store.getState();
      expect(state.user.registerError).toBeUndefined();
    });

    test('Результат запроса: register.fulfilled', () => {
      store.dispatch(
        registerUser.fulfilled(userMockData, 'fulfilled', registerMockData)
      );
      const state = store.getState();
      expect(state.user.isAuthenticated).toBeTruthy();
      expect(state.user.registerError).toBeUndefined();
      expect(state.user.data).toEqual(userMockData);
    });

    test('Ошибка запроса: register.rejected', () => {
      const error = 'register.rejected';
      store.dispatch(
        registerUser.rejected(new Error(error), 'rejected', registerMockData)
      );
      const state = store.getState();
      expect(state.user.registerError).toEqual(error);
    });
  });
  describe('Асинхронная функция для входа: loginUser', () => {
    test('Начало запроса: loginUser.pending', () => {
      store.dispatch(loginUser.pending('pending', loginMockData));
      const state = store.getState();
      expect(state.user.loginError).toBeUndefined();
    });

    test('Результат запроса: loginUser.fulfilled', () => {
      store.dispatch(
        loginUser.fulfilled(userMockData, 'fulfilled', loginMockData)
      );
      const state = store.getState();
      expect(state.user.isAuthenticated).toBeTruthy();
      expect(state.user.loginError).toBeUndefined();
      expect(state.user.data).toEqual(userMockData);
    });

    test('Ошибка запроса: loginUser.rejected', () => {
      const error = 'loginUser.rejected';
      store.dispatch(
        loginUser.rejected(new Error(error), 'rejected', loginMockData)
      );
      const state = store.getState();
      expect(state.user.loginError).toEqual(error);
    });
  });
  describe('Асинхронная функция для выхода: logoutUser', () => {
    test('Результат запроса: logoutUser.fulfilled', () => {
      store.dispatch(logoutUser.fulfilled(undefined, 'fulfilled'));
      const state = store.getState();
      expect(state.user.isAuthenticated).toBeFalsy();
      expect(state.user.data).toEqual({
        email: '',
        name: ''
      });
    });
  });
  describe('Асинхронная функция для обновления пользователя: updateUser', () => {
    test('Результат запроса: updateUser.fulfilled', () => {
      store.dispatch(
        updateUser.fulfilled(userMockData, 'fulfilled', { name: 'New Name' })
      );
      const state = store.getState();
      expect(state.user.data).toEqual(userMockData);
    });
  });
  describe('Асинхронная функция для получения пользователя: fetchUser', () => {
    test('Начало запроса: fetchUser.pending', () => {
      store.dispatch(fetchUser.pending('pending'));
      const state = store.getState();
      expect(state.user.isAuthChecked).toBeFalsy();
    });

    test('Результат запроса: fetchUser.fulfilled', () => {
      store.dispatch(fetchUser.fulfilled(userMockData, 'fulfilled'));
      const state = store.getState();
      expect(state.user.isAuthChecked).toBeTruthy();
      expect(state.user.isAuthenticated).toBeTruthy();
      expect(state.user.data).toEqual(userMockData);
    });

    test('Ошибка запроса: fetchUser.rejected', () => {
      const error = 'fetchUser.rejected';
      store.dispatch(fetchUser.rejected(new Error(error), 'rejected'));
      const state = store.getState();
      expect(state.user.isAuthChecked).toBeTruthy();
    });
  });
});
