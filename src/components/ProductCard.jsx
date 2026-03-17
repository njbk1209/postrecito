import React from 'react'
import { useCart } from '../context/CartContext'

const ProductCard = ({ id, name, price, image, category, stock }) => {
  const { addToCart } = useCart();
  const isOutOfStock = stock <= 0;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 transition-all duration-300 ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'}`}>
      <div className="aspect-square overflow-hidden bg-rose-100 relative">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-105'}`}
        />
        
        {/* Badge de Agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-5 text-center">
        <span className="text-xs uppercase tracking-widest text-rose-400 font-medium">{category}</span>
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mt-1">{name}</h3>
        <p className="text-rose-500 font-semibold mt-2">{price}€</p>
        
        <button 
          disabled={isOutOfStock}
          onClick={() => addToCart({ id, name, price, image, stock })}
          className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-all duration-75 active:scale-95 
            ${isOutOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'border border-rose-200 text-rose-400 hover:bg-rose-50'}`}
        >
          {isOutOfStock ? 'No disponible' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard;