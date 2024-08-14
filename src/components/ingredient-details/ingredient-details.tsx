import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngridients } from '../../services/slices/ingridientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isLoading = useSelector((state) => state.ingridients.isLoading);
  const ingredientData = useSelector((state) =>
    state.ingridients.data.find((ingridient) => ingridient._id === id)
  );

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
