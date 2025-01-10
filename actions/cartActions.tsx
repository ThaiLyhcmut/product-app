import { Product } from "../graphql/product.graphql";

export const addToCart = (product: Product) => ({
  type: 'ADD_TO_CART',
  payload: product,
});

export const removeFromCart = (product: Product) => ({
  type: 'REMOVE_FROM_CART',
  payload: product,
});