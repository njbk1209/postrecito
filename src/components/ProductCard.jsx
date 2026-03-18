import React from 'react'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

const ProductCard = ({ id, name, price, compare_price, price_bs, compare_price_bs, image, category, stock, date_added }) => {
  const { addToCart } = useCart();
  const { isBS } = useCurrency();

  const isOutOfStock = stock <= 0;

  // Normalizar todos los precios a número para evitar comparaciones string/number
  const priceNum           = parseFloat(price)            || 0;
  const comparePriceNum    = parseFloat(compare_price)    || null;
  const priceBsNum         = parseFloat(price_bs)         || 0;
  const comparePriceBsNum  = parseFloat(compare_price_bs) || null;

  const isNew = () => {
    if (!date_added) return false;
    const [day, month, year] = date_added.split('/').map(Number);
    const added = new Date(year, month - 1, day);
    const diffDays = (new Date() - added) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // Precios activos según moneda seleccionada
  const activePrice        = isBS ? priceBsNum        : priceNum;
  const activeComparePrice = isBS ? comparePriceBsNum : comparePriceNum;
  const symbol             = isBS ? 'Bs' : '€';

  const discount = activeComparePrice && activeComparePrice > activePrice
    ? Math.round(((activeComparePrice - activePrice) / activeComparePrice) * 100)
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

      <div className="aspect-square overflow-hidden bg-white relative">
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
          <p className="text-rose-500 font-semibold">
            {activePrice ? `${activePrice} ${symbol}` : '—'}
          </p>
          {discount && activeComparePrice && (
            <p className="text-gray-400 text-sm line-through">
              {activeComparePrice} {symbol}
            </p>
          )}
        </div>

        <button
          disabled={isOutOfStock}
          onClick={() => addToCart({ id, name,
            price: priceNum, compare_price: comparePriceNum,
            price_bs: priceBsNum, compare_price_bs: comparePriceBsNum,
            image, stock
          })}
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

export default ProductCard