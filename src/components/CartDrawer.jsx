import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingBag, Trash2, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast';

export default function CartDrawer({ isOpen, setIsOpen }) {
    const { cart, total, removeFromCart, updateQuantity, setCart } = useCart();
    const [form, setForm] = useState({ nombre: '', whatsapp: '' });
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXL_cm-daDemRxlGKbWcuJAg3XO67hZJZMxaLYaS6_WpMzZRcxRh04DJaYOg9m0CF17A/exec";

        const listaProductosWA = cart.map(item => `• ${item.qty}x ${item.name}`).join('%0A');
        const mensaje = `*Nuevo Pedido - Postrecito* 🍰%0A%0A*Cliente:* ${form.nombre}%0A*WhatsApp:* ${form.whatsapp}%0A%0A*Detalle:*%0A${listaProductosWA}%0A%0A*Total a pagar:* $${total}%0A%0A_Enviado desde la web_`;

        const dataToSend = {
            nombre: form.nombre,
            whatsapp: form.whatsapp,
            cart: cart,
            order_total: total
        };

        try {
            // 1. Enviamos a Google Sheets
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            // 2. Mostramos el Toast de éxito
            toast.success("¡Pedido registrado! Abriendo WhatsApp...", {
                duration: 4000, // Que dure un poco más en pantalla
                icon: '🍰',
            });

            setCart([]);

            // 3. Delay de 2 segundos (2000ms) usando una promesa
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 4. Abrir WhatsApp y cerrar el drawer
            window.open(`https://wa.me/584245305968?text=${mensaje}`, '_blank');


            setIsOpen(false);

        } catch (error) {
            toast.error("Error al conectar con el servidor, Serás redirigido al Whatasapp corporativo para finalizar la compra.");
            window.open(`https://wa.me/584245305968?text=${mensaje}`, '_blank');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-100" onClose={setIsOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-rose-900/20 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-2xl">
                                        <div className="flex-1 overflow-y-auto px-6 py-6">
                                            <div className="flex items-start justify-between border-b border-rose-100 pb-4">
                                                <Dialog.Title className="text-2xl font-serif text-rose-800 flex items-center gap-2">
                                                    <ShoppingBag className="w-6 h-6" /> Mi Carrito
                                                </Dialog.Title>
                                                <button onClick={() => setIsOpen(false)} className="text-rose-400 hover:rotate-90 transition-all">
                                                    <X className="h-7 w-7" />
                                                </button>
                                            </div>

                                            <div className="mt-8">
                                                {cart.length === 0 ? (
                                                    <p className="text-center text-rose-400 font-light italic mt-20">Tu carrito está vacío... por ahora 🧁</p>
                                                ) : (
                                                    <ul className="divide-y divide-rose-50">
                                                        {cart.map((product) => (
                                                            <li key={product.id} className="flex py-6 items-center gap-4">
                                                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-rose-100">
                                                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                                </div>

                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                                                                    <p className="text-xs text-rose-400 mb-2 font-light">Unitario: ${product.price}</p>

                                                                    {/* Controles de Cantidad */}
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center border border-rose-100 rounded-lg overflow-hidden">
                                                                            <button
                                                                                onClick={() => updateQuantity(product.id, -1)}
                                                                                className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <span className="px-3 py-1 text-sm font-medium text-gray-700">{product.qty}</span>
                                                                            <button
                                                                                onClick={() => updateQuantity(product.id, 1)}
                                                                                className={`px-2 py-1 bg-rose-50 text-rose-600 transition-colors ${product.qty >= product.stock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-rose-100'}`}
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col items-end gap-2">
                                                                    <p className="font-medium text-rose-600">${(product.price * product.qty).toFixed(2)}</p>
                                                                    <button onClick={() => removeFromCart(product.id)} className="text-rose-300 hover:text-rose-500 transition-colors">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        {cart.length > 0 && (
                                            <div className="border-t border-rose-100 px-6 py-6 bg-rose-50/50">
                                                <div className="flex justify-between text-xl font-serif text-rose-900 mb-6">
                                                    <p>Total Estimado</p>
                                                    <p>${total}</p>
                                                </div>

                                                <form onSubmit={handleCheckout} className="space-y-3">
                                                    <input
                                                        required
                                                        placeholder="Tu Nombre"
                                                        className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none text-sm"
                                                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                                                    />
                                                    <input
                                                        required
                                                        placeholder="WhatsApp (0412...)"
                                                        className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none text-sm"
                                                        onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={loading || cart.length === 0} // Deshabilitado si carga o no hay items
                                                        className={`w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-lg 
                                                            ${loading
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                                                            }`}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="animate-spin mr-2">⏳</span>
                                                                Procesando pedido...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MessageCircle className="w-5 h-5" />
                                                                Pedir por WhatsApp
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}