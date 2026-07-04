import { writable, get } from 'svelte/store';

export const formState = writable({
  name: '',
  address: '',
  paymentMethod: 'credit_card'
});

export const cartItems = writable([]);
export const discount = writable(0);

// @ts-ignore
const getSharedStore = async () => {
  try {
    const storeModule = await import('shared_store/store');
    return storeModule;
  } catch (error) {
    console.warn("Failed to load shared_store", error);
    return null;
  }
};

export const initCheckoutStore = async () => {
  const shared = await getSharedStore();
  if (shared && shared.cartStore && shared.shopStore) {
    cartItems.set(shared.cartStore.getState().items);
    discount.set(shared.shopStore.getState().discount);

    shared.cartStore.subscribe((state) => {
      cartItems.set(state.items);
    });

    shared.shopStore.subscribe((state) => {
      discount.set(state.discount);
    });
  }
};

export const clearCart = async () => {
  const shared = await getSharedStore();
  if (shared && shared.clearCart) {
    shared.clearCart();
  }
  if (shared && shared.clearDiscount) {
    shared.clearDiscount();
  }
};
