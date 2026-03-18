import React from 'react'
import { useCart } from '../context/CartContext'

const ProductCard = ({ id, name, price, compare_price, image, category, stock, date_added }) => {
  const { addToCart } = useCart();
  const isOutOfStock = stock <= 0;

  const isNew = () => {
    if (!date_added) return false;
    const [day, month, year] = date_added.split('/').map(Number);
    const added = new Date(year, month - 1, day);
    const diffDays = (new Date() - added) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const discount = compare_price && compare_price > price
    ? Math.round(((compare_price - price) / compare_price) * 100)
    : null;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 transition-all duration-300 relative ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'}`}>
      
      {/* Badges esquina superior derecha */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
        {isNew() && !isOutOfStock && (
          <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide uppercase animate-pulse">
            ¡Nuevo!
          </span>
        )}
        {discount && !isOutOfStock && (
          <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide">
            -{discount}%
          </span>
        )}
      </div>

      <div className="aspect-square overflow-hidden bg-rose-100 relative">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-105'}`}
        />
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

        {/* Precios */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-rose-500 font-semibold">{price}€</p>
          {discount && (
            <p className="text-gray-400 text-sm line-through">{compare_price}€</p>
          )}
        </div>
        
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