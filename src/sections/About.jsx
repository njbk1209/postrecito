import React from 'react';

const About = () => {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Lado de la imagen o Decoración Visual */}
                <div className="w-full md:w-1/2 relative">
                    <div className="aspect-square bg-rose-100 rounded-2xl overflow-hidden shadow-sm group">
                        <img
                            src='https://aprende.com/wp-content/uploads/2021/10/curso-online-de-reposteria.jpg'
                            alt="Nuestro trabajo"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    {/* Elemento decorativo que flota (opcional) */}
                    <div className="absolute -bottom-4 -right-4 bg-rose-800 text-white p-6 rounded-lg hidden md:block">
                        <p className="text-sm font-light tracking-widest font-serif">Desde 2026</p>
                    </div>
                </div>

                {/* Contenido de Texto */}
                <div className="w-full md:w-1/2 text-left">
                    <h2 className="text-3xl md:text-4xl font-serif font-light text-rose-800 mb-6">
                        Nuestra <span className="italic">Historia</span>
                    </h2>

                    <div className="space-y-4 text-slate-600/80 text-lg leading-relaxed">
                        <p>
                            En la ciudad de <strong>Guanare, Portuguesa</strong>, nació nuestra pasión por transformar ingredientes sencillos en experiencias inolvidables.
                        </p>
                        <p>
                            Lo que comenzó como un sueño en nuestra cocina familiar, se ha convertido en un rincón dedicado al detalle, donde cada postre cuenta una historia de tradición y dedicación artesanal.
                        </p>
                        <p>
                            Creemos que lo dulce no solo alimenta el cuerpo, sino también el alma. Por eso, cada receta es elaborada con amor y orgullo llanero.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-rose-500 font-serif italic">
                        <span className="h-px w-8 bg-rose-200"></span>
                        <span>Hecho en Guanare con orgullo</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;