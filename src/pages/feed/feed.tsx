import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedsSlice';
import { fetchIngridients } from '../../services/slices/ingridientsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.feeds.data.orders
  );

  useEffect(() => {
    dispatch(fetchFeeds());
    dispatch(fetchIngridients());
  }, [dispatch]);

  const handleGetIngredients = () => {
    setLoading(true);
    dispatch(fetchIngridients()).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  };

  if (!orders.length) {
    return <Preloader />;
  }
  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetIngredients} />;
};
