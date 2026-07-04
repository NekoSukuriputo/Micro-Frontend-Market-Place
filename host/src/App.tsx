import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { MicroFrontend } from "./MicroFrontend";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";

// @ts-ignore
const RemoteProduct = React.lazy(() => import("remote_product/App"));

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>
        
        <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
              <Routes>
                <Route path="/" element={<RemoteProduct />} />
                <Route path="/cart" element={<MicroFrontend mountFunction={import("remote_detail_cart/mount" as any)} />} />
                <Route path="/checkout" element={<MicroFrontend mountFunction={import("remote_checkout/mount" as any)} />} />
                <Route path="/user" element={<MicroFrontend mountFunction={import("remote_user/mount" as any)} />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center">
          <p className="opacity-75">&copy; 2026 MicroMarket. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(<App />);

export default App;