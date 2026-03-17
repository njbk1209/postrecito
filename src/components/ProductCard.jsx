
import React from 'react'

const ProductCard = ({ name, price, image, category }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-rose-100">
      <div className="aspect-square overflow-hidden bg-rose-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 text-center">
        <span className="text-xs uppercase tracking-widest text-rose-400 font-medium">{category}</span>
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mt-1">{name}</h3>
        <p className="text-rose-500 font-semibold mt-2">{price}€</p>
        <button className="mt-4 w-full py-2 border border-rose-200 text-rose-400 rounded-lg hover:bg-rose-50 transition-colors text-sm font-medium">
          Agregar al Carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard
