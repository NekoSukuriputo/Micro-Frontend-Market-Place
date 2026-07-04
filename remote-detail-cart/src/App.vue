<template>
  <div class="py-8">
    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Your Cart</h1>
    
    <div v-if="cartItems.length === 0" class="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-100">
      <p class="text-gray-500 text-lg">Your cart is empty.</p>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <ul class="divide-y divide-gray-100">
        <li v-for="item in cartItems" :key="item.id" class="p-6 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg" />
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
              <p class="text-indigo-600 font-medium">${{ item.price }} x {{ item.quantity }}</p>
            </div>
          </div>
          <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 font-medium transition-colors">
            Remove
          </button>
        </li>
      </ul>
      <div class="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <span class="text-xl font-bold text-gray-900">Total: ${{ total }}</span>
        <button @click="goToCheckout" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
// @ts-ignore
import { cartStore, removeFromCart } from 'shared_store/store';

const cartItems = ref([]);
let unsubscribe = null;

onMounted(() => {
  const updateCart = (state) => {
    cartItems.value = state.items;
  };
  unsubscribe = cartStore.subscribe(updateCart);
  updateCart(cartStore.getState());
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const removeItem = (id) => {
  removeFromCart(id);
};

const goToCheckout = () => {
  window.history.pushState({}, '', '/checkout');
  window.dispatchEvent(new Event('popstate'));
};
</script>
