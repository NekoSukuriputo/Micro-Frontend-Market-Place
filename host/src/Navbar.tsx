import React, { useEffect, useState } from "react";
// @ts-ignore
import { cartStore, userStore } from "shared_store/store";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    // Subscribe to cart store
    const updateCart = (state: any) => {
      const count = state.items.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };
    const unsubCart = cartStore.subscribe(updateCart);
    updateCart(cartStore.getState());

    // Subscribe to user store
    const updateUser = (state: any) => {
      setUser(state.user);
    };
    const unsubUser = userStore.subscribe(updateUser);
    updateUser(userStore.getState());

    return () => {
      unsubCart();
      unsubUser();
    };
  }, []);

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider hover:text-indigo-200 transition-colors">
          🛒 MicroMarket
        </Link>
        <div className="flex gap-6 items-center font-medium">
          <Link to="/" className="hover:text-indigo-200 transition-colors">Products</Link>
          <Link to="/cart" className="hover:text-indigo-200 transition-colors relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/user" className="hover:text-indigo-200 transition-colors flex items-center gap-2">
            {user ? (
              <span className="bg-indigo-700 px-3 py-1 rounded-full text-sm">👤 {user.username}</span>
            ) : (
              "Login"
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};
