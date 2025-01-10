import { Product } from "../graphql/product.graphql";

const initialState: {
  items: Product[]
} = {
  items: []
};

export const cartReducer = (state = initialState, action: {
  type: string;
  payload: Product
}) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};