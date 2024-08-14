import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fetchFeeds, initialState } from './feedsSlice';
import { getFeedsApi } from '../../utils/burger-api';
import feedsSlice from './feedsSlice';
import { AppDispatch } from '../store';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

const feedsMockData = {
  orders: [],
  total: 1,
  totalToday: 1
};

describe('Тестирование feedsSlice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feeds: feedsSlice
      }
    });
  });

  test('Проверка начального состояния слайса', () => {
    expect(store.getState().feeds).toEqual(initialState);
  });

  test('Проверка состояния при запросе fetchFeeds (pending)', async () => {
    // Мокаем запрос API
    (getFeedsApi as jest.Mock).mockResolvedValue(feedsMockData);

    const dispatch = store.dispatch as AppDispatch;
    const action = dispatch(fetchFeeds());

    // Проверяем, что isLoading установлен в true
    expect(store.getState().feeds.isLoading).toBe(true);
    expect(store.getState().feeds.error).toBeNull();

    await action; // Дожидаемся завершения асинхронной операции

    // Проверяем состояние после завершения запроса
    const state = store.getState().feeds;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(feedsMockData);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном выполнении запроса fetchFeeds (fulfilled)', async () => {
    // Мокаем успешный ответ API
    (getFeedsApi as jest.Mock).mockResolvedValue(feedsMockData);

    const dispatch = store.dispatch as AppDispatch;
    await dispatch(fetchFeeds());

    // Проверяем состояние после успешного выполнения запроса
    const state = store.getState().feeds;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(feedsMockData);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при ошибке выполнения запроса fetchFeeds (rejected)', async () => {
    // Мокаем ошибку API
    const mockErrorMessage = 'Ошибка сети';
    (getFeedsApi as jest.Mock).mockRejectedValue(new Error(mockErrorMessage));

    const dispatch = store.dispatch as AppDispatch;
    const action = dispatch(fetchFeeds());

    // Проверяем состояние при выполнении запроса
    expect(store.getState().feeds.isLoading).toBe(true);
    expect(store.getState().feeds.error).toBeNull();

    await action; // Дожидаемся завершения асинхронной операции

    // Проверяем состояние после завершения запроса
    const state = store.getState().feeds;
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual({
      orders: [],
      total: NaN,
      totalToday: NaN
    });
    expect(state.error).toEqual(mockErrorMessage); // Проверяем, что error содержит сообщение об ошибке
  });
});
