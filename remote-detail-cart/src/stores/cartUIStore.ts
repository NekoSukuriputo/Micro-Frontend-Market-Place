import { defineStore } from 'pinia';
import { ref } from 'vue';

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

export const useCartUIStore = defineStore('cartUI', () => {
  const couponInput = ref('');
  const isValidating = ref(false);
  const discount = ref(0);
  const activeCoupon = ref<string | null>(null);
  const cartItems = ref<any[]>([]);

  const init = async () => {
    const shared = await getSharedStore();
    if (shared && shared.cartStore && shared.shopStore) {
      // Sync initial state
      cartItems.value = shared.cartStore.getState().items;
      discount.value = shared.shopStore.getState().discount;
      activeCoupon.value = shared.shopStore.getState().activeCoupon;

      // Subscribe to changes
      shared.cartStore.subscribe((state: any) => {
        cartItems.value = state.items;
      });

      shared.shopStore.subscribe((state: any) => {
        discount.value = state.discount;
        activeCoupon.value = state.activeCoupon;
      });
    }
  };

  const applyDiscount = async () => {
    isValidating.value = true;
    const shared = await getSharedStore();
    if (shared && shared.applyDiscount) {
      setTimeout(() => {
        const success = shared.applyDiscount(couponInput.value);
        if (!success) {
          alert('Invalid coupon code!');
        }
        isValidating.value = false;
        couponInput.value = '';
      }, 500); // Simulate network delay
    } else {
      isValidating.value = false;
    }
  };

  const removeCartItem = async (id: number) => {
    const shared = await getSharedStore();
    if (shared && shared.removeFromCart) {
      shared.removeFromCart(id);
    }
  };

  return {
    couponInput,
    isValidating,
    discount,
    activeCoupon,
    cartItems,
    init,
    applyDiscount,
    removeCartItem
  };
});
