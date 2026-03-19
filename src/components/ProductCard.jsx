// components/ProductCard.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import ImageCarousel from './ImageCarousel'

const ProductCard = ({
  id, name, category, stock, date_added,
  price, compare_price,
  price_bs, compare_price_bs,
  discount_percent,
  images,
}) => {
  const { addToCart } = useCart()
  const { isBS }      = useCurrency()

  const isOutOfStock = stock <= 0

  const isNew = () => {
    if (!date_added) return false
    const diffDays = (new Date() - new Date(date_added)) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  const activePrice        = isBS ? price_bs        : parseFloat(price)
  const activeComparePrice = isBS ? compare_price_bs : parseFloat(compare_price)
  const symbol             = isBS ? 'Bs'            : '€'
  const discount           = discount_percent > 0 ? discount_percent : null

  const formatPrice = (val) =>
    val != null
      ? val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : null

  const mainImage = images?.find(img => img.is_main)?.image ?? images?.[0]?.image ?? null

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 transition-all duration-300 relative
      ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'}`}
    >
      {/* Badges */}
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

      {/* Carrusel */}
      <div className="aspect-square overflow-hidden bg-white relative">
        <ImageCarousel images={images} name={name} isOutOfStock={isOutOfStock} />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 text-center">
        <span className="text-xs uppercase tracking-widest text-rose-400 font-medium">{category}</span>
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mt-1">{name}</h3>

        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-rose-500 font-semibold">
            {formatPrice(activePrice)} {symbol}
          </p>
          {discount && activeComparePrice && (
            <p className="text-gray-400 text-sm line-through">
              {formatPrice(activeComparePrice)} {symbol}
            </p>
          )}
        </div>

        <button
          disabled={isOutOfStock}
          onClick={() => addToCart({
            id, name, stock,
            price:            parseFloat(price),
            compare_price:    compare_price ? parseFloat(compare_price) : null,
            price_bs,
            compare_price_bs,
            image:            mainImage,
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