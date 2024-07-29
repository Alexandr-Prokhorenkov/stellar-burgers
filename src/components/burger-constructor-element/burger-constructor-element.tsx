import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngridientDown,
  moveIngridientUp,
  removeIngridient
} from '../../services/slices/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(moveIngridientDown(index));
    };

    const handleMoveUp = () => {
      dispatch(moveIngridientUp(index));
    };

    const handleClose = () => {
      dispatch(removeIngridient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
