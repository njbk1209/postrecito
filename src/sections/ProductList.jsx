// ProductList.jsx

import React, { useState, useEffect, useRef } from 'react';
import ProductCard from "../components/ProductCard";
import { Transition } from '@headlessui/react';

const API_URL = import.meta.env.VITE_API_URL;

const ProductList = () => {
  const [products, setProducts]           = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const catalogTopRef                     = useRef(null);

  useEffect(() => {
    if (!loading && catalogTopRef.current) {
      const y = catalogTopRef.current.getBoundingClientRect().top + window.pageYOffset - 40;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage);
        if (activeCategory !== 'Todos') params.append('category', activeCategory);

        const res = await fetch(`${API_URL}/api/products/?${params}`);
        if (!res.ok) throw new Error('Error al cargar productos');

        const data = await res.json();
        setProducts(data.results);
        setTotalPages(Math.ceil(data.count / 15)); // PAGE_SIZE de tu settings.py
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, activeCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Las categorías las pedimos una sola vez al montar
  const [categories, setCategories] = useState(['Todos']);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/products/?page=1`);
        const data = await res.json();
        const cats = [...new Set(data.results.map(p => p.category).filter(Boolean))];
        setCategories(['Todos', ...cats]);
      } catch (_) {}
    };
    fetchCategories();
  }, []);

  if (error) return (
    <div className="py-20 text-center text-rose-400 font-serif">
      {error}
    </div>
  );

  return (
    <Transition
      show={!loading}
      appear={true}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      key={currentPage}
    >
      <div ref={catalogTopRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">
              Categorías
            </h3>
            <ul className="space-y-4">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sm transition-all duration-300 ${
                      activeCategory === cat
                        ? "text-rose-500 font-semibold translate-x-2"
                        : "text-gray-500 hover:text-rose-400"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1">
            {/* CATEGORÍAS MOBILE */}
            <div className="lg:hidden mb-8 -mx-4 px-4 overflow-x-auto flex flex-nowrap gap-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-white text-rose-400 border-rose-100 hover:border-rose-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mb-6 lg:mb-10">
              <h2 className="text-3xl font-semibold text-rose-800 font-serif">Nuestro Catálogo</h2>
              <div className="h-1 w-12 bg-rose-300 mt-2"></div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-rose-400 animate-pulse font-serif">
                Cargando dulzura...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 text-sm bg-white border border-rose-200 text-rose-500 rounded-lg disabled:opacity-30 transition-colors hover:bg-rose-50"
                >
                  Anterior
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                        currentPage === i + 1
                          ? "bg-rose-400 text-white shadow-md"
                          : "text-rose-400 hover:bg-rose-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 text-sm bg-white border border-rose-200 text-rose-500 rounded-lg disabled:opacity-30 transition-colors hover:bg-rose-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default ProductList;