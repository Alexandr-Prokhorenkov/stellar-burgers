import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  createOrder,
  fetchOrder,
  fetchOrders,
  resetOrderModalData,
  initialState
} from './ordersSlice';
import orderSlice from './ordersSlice';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

const ordersMockData: TOrder[] = [
  {
    _id: '66ba2cba119d45001b4ff598',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Био-марсианский флюоресцентный люминесцентный метеоритный бургер',
    createdAt: '2024-08-12T15:39:38.042Z',
    updatedAt: '2024-08-12T15:39:38.522Z',
    number: 49485
  }
];
describe('Тестирование orderSlice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: orderSlice
      }
    });
  });
  test('должен вернуть начальное состояние', () => {
    expect(store.getState().orders).toEqual(initialState);
  });
  test('должен обработать createOrder.pending', () => {
    store.dispatch(createOrder.pending('', []));
    expect(store.getState().orders.orderRequest).toBe(true);
    expect(store.getState().orders.error).toBeNull();
  });
  test('должен обработать createOrder.fulfilled', () => {
    const mockOrderResponse = {
      order: ordersMockData[0],
      name: 'Био-марсианский флюоресцентный люминесцентный метеоритный бургер'
    };
    store.dispatch(createOrder.fulfilled(mockOrderResponse, '', []));

    expect(store.getState().orders.orderRequest).toBe(false);
    expect(store.getState().orders.orderModalData).toEqual(ordersMockData[0]);
  });
  test('должен обработать createOrder.rejected', () => {
    store.dispatch(
      createOrder.rejected(new Error('Ошибка создания заказа'), '', [])
    );
    expect(store.getState().orders.orderRequest).toBe(false);
  });
  test('должен обработать fetchOrder.pending', () => {
    store.dispatch(fetchOrder.pending('', 49485));
    expect(store.getState().orders.isOrderLoading).toBe(true);
  });

  test('должен обработать fetchOrder.fulfilled', () => {
    store.dispatch(fetchOrder.fulfilled(ordersMockData[0], '', 49485));
    expect(store.getState().orders.isOrderLoading).toBe(false);
    expect(store.getState().orders.orderModalData).toEqual(ordersMockData[0]);
  });

  test('должен обработать fetchOrder.rejected', () => {
    store.dispatch(
      fetchOrder.rejected(new Error('Ошибка получения заказа'), '', 49485)
    );
    expect(store.getState().orders.isOrderLoading).toBe(false);
  });
  test('должен обработать fetchOrders.pending', () => {
    store.dispatch(fetchOrders.pending(''));
    expect(store.getState().orders.isOrdersLoading).toBe(true);
    expect(store.getState().orders.error).toBeNull();
  });

  test('должен обработать fetchOrders.fulfilled', () => {
    store.dispatch(fetchOrders.fulfilled(ordersMockData, ''));
    expect(store.getState().orders.isOrdersLoading).toBe(false);
    expect(store.getState().orders.data).toEqual(ordersMockData);
  });

  test('должен обработать fetchOrders.rejected', () => {
    const errorMessage = 'Ошибка получения заказов';
    store.dispatch(fetchOrders.rejected(new Error(errorMessage), ''));
    expect(store.getState().orders.isOrdersLoading).toBe(false);
    expect(store.getState().orders.error?.message).toBe(errorMessage);
  });

  test('должен обработать resetOrderModalData', () => {
    store.dispatch(resetOrderModalData());
    expect(store.getState().orders.orderModalData).toBeNull();
  });
});
