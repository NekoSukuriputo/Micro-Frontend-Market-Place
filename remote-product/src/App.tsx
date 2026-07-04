import React from "react";
// @ts-ignore
import { addToCart } from "shared_store/store";
import "./index.css";

const PRODUCTS = [
  { id: 1, name: "Premium Wireless Headphones", price: 299, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", desc: "High quality wireless headphones with active noise cancellation." },
  { id: 2, name: "Mechanical Keyboard", price: 149, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80", desc: "RGB mechanical keyboard with tactile switches." },
  { id: 3, name: "Ergonomic Mouse", price: 89, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80", desc: "Comfortable ergonomic mouse designed for productivity." },
  { id: 4, name: "4K Monitor", price: 499, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80", desc: "Crisp 4K resolution monitor for creative professionals." },
];

const App = () => {
  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Latest Products</h1>
          <p className="mt-2 text-sm text-gray-500">Explore our premium selection of tech gear.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
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
        ))}
      </div>
    </div>
  );
};

export default App;