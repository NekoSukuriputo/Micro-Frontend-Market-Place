<script>
  import { onMount } from "svelte";
  import { formState, cartItems, discount, initCheckoutStore, clearCart } from "./checkoutStore.js";

  let isCheckingOut = false;
  let orderComplete = false;
  
  // Svelte derived state for derived calculations
  $: subtotal = $cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  $: total = subtotal * (1 - $discount);

  onMount(() => {
    initCheckoutStore();
  });

  const handleCheckout = (e) => {
    e.preventDefault();
    isCheckingOut = true;
    setTimeout(() => {
      isCheckingOut = false;
      orderComplete = true;
      clearCart();
    }, 1500);
  };
</script>

<div class="py-8 max-w-4xl mx-auto">
  {#if orderComplete}
    <div class="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl text-center shadow-sm">
      <div class="text-5xl mb-4">🎉</div>
      <h2 class="text-3xl font-bold mb-2">Order Confirmed, {$formState.name}!</h2>
      <p class="text-lg">Thank you for your purchase. It will be shipped to {$formState.address}.</p>
      <button 
        on:click={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate')); }}
        class="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  {:else}
    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Checkout</h1>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
      <div class="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
        <h2 class="text-lg font-semibold mb-4 text-gray-900">Order Summary</h2>
        {#if $cartItems.length === 0}
          <p class="text-gray-500">Your cart is empty.</p>
        {:else}
          <ul class="space-y-3 mb-4">
            {#each $cartItems as item}
              <li class="flex justify-between text-sm">
                <span class="text-gray-600">{item.name} x {item.quantity}</span>
                <span class="font-medium text-gray-900">${item.price * item.quantity}</span>
              </li>
            {/each}
          </ul>
          {#if $discount > 0}
            <div class="pt-4 border-t border-gray-200 flex justify-between text-sm text-green-600">
              <span>Discount ({$discount * 100}%)</span>
              <span>-${(subtotal * $discount).toFixed(2)}</span>
            </div>
          {/if}
          <div class="pt-4 border-t border-gray-200 flex justify-between mt-2">
            <span class="font-bold text-gray-900">Total</span>
            <span class="font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>
        {/if}
      </div>
      
      <div class="p-6 md:w-1/2">
        <h2 class="text-lg font-semibold mb-4 text-gray-900">Shipping Details</h2>
        <form on:submit={handleCheckout} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="name">Full Name</label>
            <input required type="text" id="name" bind:value={$formState.name} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="address">Address</label>
            <input required type="text" id="address" bind:value={$formState.address} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="payment">Payment Method</label>
            <select id="payment" bind:value={$formState.paymentMethod} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={$cartItems.length === 0 || isCheckingOut}
            class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex justify-center items-center"
          >
            {#if isCheckingOut}
              <span class="mr-2">Processing...</span>
            {:else}
              Place Order
            {/if}
          </button>
        </form>
      </div>
    </div>
  {/if}
</div>
