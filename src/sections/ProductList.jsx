import React, { useState, useEffect } from 'react';
import ProductCard from "../components/ProductCard";
import Papa from 'papaparse';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // 🔗 REEMPLAZA ESTO CON TU LINK DE PUBLICAR EN LA WEB (CSV)
  const SHEET_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            setProducts(results.data);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error cargando postres:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ["Todos", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) return (
    <div className="py-20 text-center text-rose-400 animate-pulse font-serif">
      Cargando dulzura...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col lg:flex-row">
        
        {/* SIDEBAR (LG+) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Categorías</h3>
          <ul className="space-y-4">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm transition-all duration-300 cursor-pointer ${
                    activeCategory === cat 
                    ? "text-rose-500 font-semibold translate-x-2" 
                    : "text-gray-500 hover:text-rose-400 hover:translate-x-1"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1">
          <div className="mb-6 lg:mb-10">
            <h2 className="text-3xl font-semibold text-rose-800 font-serif">Nuestro Catálogo</h2>
            <div className="h-1 w-12 bg-rose-300 mt-2"></div>
          </div>

          {/* FILTROS MÓVILES */}
          <div className="lg:hidden mb-8 overflow-x-auto no-scrollbar py-2">
            <div className="flex gap-3 whitespace-nowrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat 
                    ? "bg-rose-400 text-white shadow-md shadow-rose-200" 
                    : "bg-rose-50 text-rose-500 border border-rose-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;