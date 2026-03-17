import React from 'react'

const Hero = () => (
  <section className="bg-rose-50 py-16 px-6 text-center">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-800 mb-4">
        Momentos Dulces, <span className="italic">Hechos con Amor</span>
      </h1>
      <p className="text-rose-600/80 text-lg font-light mb-8">
        Descubre nuestra selección artesanal de postres diseñados para deleitar tus sentidos.
      </p>
      <button className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3 rounded-full transition-all shadow-sm">
        Ver Catálogo
      </button>
    </div>
  </section>
);

export default Hero