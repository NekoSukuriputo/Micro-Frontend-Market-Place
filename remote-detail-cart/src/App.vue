<template>
  <div class="py-8">
    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Your Cart</h1>
    
    <div v-if="cartStore.cartItems.length === 0" class="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-100">
      <p class="text-gray-500 text-lg">Your cart is empty.</p>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <ul class="divide-y divide-gray-100">
        <li v-for="item in cartStore.cartItems" :key="item.id" class="p-6 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg" />
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
              <p class="text-indigo-600 font-medium">${{ item.price }} x {{ item.quantity }}</p>
            </div>
          </div>
          <button @click="cartStore.removeCartItem(item.id)" class="text-red-500 hover:text-red-700 font-medium transition-colors">
            Remove
          </button>
        </li>
      </ul>
      <div class="p-6 bg-gray-50 flex flex-col gap-4 border-t border-gray-100">
        
        <div class="flex items-center gap-4">
          <input 
            type="text" 
            v-model="cartStore.couponInput" 
            placeholder="Enter Coupon Code (e.g. NEKO2026)" 
            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button 
            @click="cartStore.applyDiscount" 
            :disabled="cartStore.isValidating"
            class="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {{ cartStore.isValidating ? 'Validating...' : 'Apply' }}
          </button>
        </div>

        <div v-if="cartStore.activeCoupon" class="text-green-600 font-medium text-sm">
          Coupon "{{ cartStore.activeCoupon }}" applied! ({{ cartStore.discount * 100 }}% off)
        </div>

        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-col">
            <span v-if="cartStore.discount > 0" class="text-sm text-gray-500 line-through">Subtotal: ${{ subtotal.toFixed(2) }}</span>
            <span v-if="cartStore.discount > 0" class="text-sm text-green-600 font-medium mb-1">Discount: -${{ (subtotal * cartStore.discount).toFixed(2) }}</span>
            <span class="text-xl font-bold text-gray-900">Total: ${{ total.toFixed(2) }}</span>
          </div>
          <button @click="goToCheckout" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useCartUIStore } from './stores/cartUIStore';

const cartStore = useCartUIStore();

onMounted(() => {
  cartStore.init();
});

const subtotal = computed(() => {
  return cartStore.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => {
  return subtotal.value * (1 - cartStore.discount);
});

const goToCheckout = () => {
  window.history.pushState({}, '', '/checkout');
  window.dispatchEvent(new Event('popstate'));
};
</script>
