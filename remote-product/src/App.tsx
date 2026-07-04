import React from "react";
// @ts-ignore
import { addToCart } from "shared_store/store";
import { useProductStore } from "./store/useProductStore";
import "./index.css";

const PRODUCTS = [
  { id: 1, name: "Premium Wireless Headphones", price: 299, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", desc: "High quality wireless headphones with active noise cancellation." },
  { id: 2, name: "Mechanical Keyboard", price: 149, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80", desc: "RGB mechanical keyboard with tactile switches." },
  { id: 3, name: "Ergonomic Mouse", price: 89, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80", desc: "Comfortable ergonomic mouse designed for productivity." },
  { id: 4, name: "4K Monitor", price: 499, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80", desc: "Crisp 4K resolution monitor for creative professionals." },
];

const App = () => {
  const { searchQuery, sortBy, favorites, setSearchQuery, setSortBy, toggleFavoriteLocal } = useProductStore();

  const filteredAndSortedProducts = React.useMemo(() => {
    let result = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Latest Products</h1>
          <p className="mt-2 text-sm text-gray-500">Explore our premium selection of tech gear.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredAndSortedProducts.map((product) => {
          const isFavorite = favorites.includes(product.id);
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col relative">
              <button 
                onClick={() => toggleFavoriteLocal(product.id)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10"
              >
                <svg className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
              <div className="h-48 overflow-hidden bg-gray-200">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-500 flex-1">{product.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:ring-4 focus:ring-indigo-100"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;