import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [],
  totalPrice: 0,
};

const isSameCartItem = (
  a: Pick<CartItem, 'productId' | 'customizations'>,
  b: Pick<CartItem, 'productId' | 'customizations'>,
): boolean => String(a.productId) === String(b.productId) && a.customizations === b.customizations;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => isSameCartItem(item, action.payload));

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter((item) => String(item.productId) !== String(action.payload));
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateCartItem: (state, action: PayloadAction<{ productId: number | string; quantity: number }>) => {
      const item = state.items.find((i) => String(i.productId) === String(action.payload.productId));
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => String(i.productId) !== String(action.payload.productId));
        }
      }

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
