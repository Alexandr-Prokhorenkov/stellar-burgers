import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngridients } from '../../services/slices/ingridientsSlice';
import { resetOrderModalData } from '../../services/slices/ordersSlice';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? element : <Navigate to='/login' />;
};

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
    dispatch(resetOrderModalData());
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngridients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Order Info' onClose={handleClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ingredient Details' onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Info' onClose={handleClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
