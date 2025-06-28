'use client';

import { useCart } from '@/context/cartContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
type CartItem = {
  title: string;
  count: number;
  display_price: number;
};
export default function CartPage() {
  const { updateCartCount } = useCart();

  const [cart, setCart] = useLocalStorage<any[]>('cart', []);
  const [subtotal, setSubtotal] = useState(0);
  const [showModal, setShowModal] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const shipping = 100;
  const taxRate = 0.08;
  const businessWhatsAppNumber = '919344644827'; // example: India number

  // Calculate subtotal
  useEffect(() => {
    const sub = cart.reduce((sum, item) => sum + item.display_price * item.count, 0);
    setSubtotal(sub);
  }, [cart]);

  const updateQty = (index: number, value: number) => {
    const updated = [...cart];
    updated[index].count = Math.max(1, updated[index].count + value);
    setCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    updateCartCount(updated)
  };

  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = subtotal + shipping + tax;
  const createWhatsAppUrl = (cartData: CartItem[], name: string) => {
    if (!cartData.length) return '';

    let total = 0;
    const itemLines = cartData.map((item, i) => {
      const itemTotal = item.display_price * item.count;
      total += itemTotal;
      return `${i + 1}. ${item.title} × ${item.count} = ₹${itemTotal}`;
    });

    const msg = `Hello, I want to place an order:\n\n${itemLines.join('\n')}\n\nTotal: ₹${total}\n\nMy Name is: ${name}`;

    return `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(msg)}`;
  };
  const handleCheckout = () => {
    const waUrl = createWhatsAppUrl(cart, customerName);
    if (waUrl) {
      setCustomerName('')
      window.open(waUrl, '_blank');
    } else {
      alert('Cart is empty!');
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return alert('Please enter your Name');
    // Redirect to WhatsApp chat
    handleCheckout()
    setShowModal(false);
  };
  return (
<div className="max-w-5xl mx-auto p-6 text-black dark:text-white">
  <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

  {cart.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
  ) : (
    <>
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b pb-4 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <Link href={`/user/listingDetail/${item.id}`}>
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  width={70}
                  height={70}
                  className="rounded object-cover w-16 h-16"
                />
              </Link>
              <div className="w-16 sm:w-40 md:w-60">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{item.display_price} x {item.count} = ₹
                  {item.display_price * item.count}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(index, -1)}
                className="bg-gray-100 dark:bg-gray-800 w-7 h-7 rounded-full text-sm font-bold"
              >
                −
              </button>
              <span>{item.count}</span>
              <button
                onClick={() => updateQty(index, 1)}
                className="bg-gray-100 dark:bg-gray-800 w-7 h-7 rounded-full text-sm font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(index)}
              className="text-red-500 text-sm ml-4"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2 border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-rose-300 hover:bg-rose-400 text-white px-6 py-2 rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </>
  )}

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded p-6 max-w-sm w-full shadow-lg">
        <h4 className="text-xl mb-4 font-semibold text-black dark:text-white">
          Enter your Name
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded text-black dark:text-white dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded border text-black dark:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>


  );
}
