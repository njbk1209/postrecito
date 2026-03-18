import React, { useState, useEffect, useRef } from 'react';
import ProductCard from "../components/ProductCard";
import Papa from 'papaparse';
import { Transition } from '@headlessui/react'
import { useCurrency } from '../context/CurrencyContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const catalogTopRef = useRef(null);

  const { setProducts: setProductsInContext } = useCurrency();

  const SHEET_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!loading && catalogTopRef.current) {
      const yOffset = -40;
      const element = catalogTopRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProducts(results.data);
            setProductsInContext(results.data); // 👈 alimenta la tasa
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const categories = ["Todos", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter(p => p.category === activeCategory);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) return <div className="py-20 text-center text-rose-400 animate-pulse font-serif">Cargando dulzura...</div>;

  return (
    <Transition
      show={!loading}
      appear={true}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      key={currentPage}>

      <div ref={catalogTopRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Categorías</h3>
            <ul className="space-y-4">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sm transition-all duration-300 ${activeCategory === cat ? "text-rose-500 font-semibold translate-x-2" : "text-gray-500 hover:text-rose-400"}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1">
            <div className="mb-6 lg:mb-10">
              <h2 className="text-3xl font-semibold text-rose-800 font-serif">Nuestro Catálogo</h2>
              <div className="h-1 w-12 bg-rose-300 mt-2"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg-gap-8">
              {currentProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

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
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${currentPage === i + 1 ? "bg-rose-400 text-white shadow-md" : "text-rose-400 hover:bg-rose-50"}`}
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