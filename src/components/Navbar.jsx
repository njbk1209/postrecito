import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart(); // Para obtener la cantidad real

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-serif font-semibold text-rose-500 tracking-tight cursor-pointer">
            Postrecito<span className="text-rose-300">.</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-rose-400 transition-colors">Inicio</a>
            <a href="#catalogo" className="hover:text-rose-400 transition-colors">Catálogo</a>
            <a href="#nosotros" className="hover:text-rose-400 transition-colors">Nosotros</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-500 hover:text-rose-400 transition-colors relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-400 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* El Drawer se renderiza fuera del nav para evitar problemas de z-index */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  )
}

export default Navbar