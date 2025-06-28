'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/cartContext';
export default function CartIcon() {
  const router = useRouter()
  const { cartCount } = useCart();
  const [isClient, setIsClient] = useState(false);
  //  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setIsClient(true); // Ensure rendering only happens on client
  }, []);
  if (!isClient) return null;
  return (
    <header className="bg-sky-500 text-white p-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href={"/"}>
          <div className="flex items-center">
            <img
              src="https://kovai-guppies-images.s3.eu-north-1.amazonaws.com/4hY0fNISWkkqxy7bvBk_o.jpg"
              className="w-20 h-20"
              alt="Logo"
            />
            <h1 className="text-3xl font-bold ml-3">Kovai Guppies</h1>
          </div>
        </Link>
        <div className='relative'>
          <ShoppingCart className="w-8 h-8 cursor-pointer" onClick={() => router.push('/user/cart')} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
