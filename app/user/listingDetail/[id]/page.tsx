'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Link from 'next/link';
import ListingSkeleton from '@/components/listingDetailSkeleton';
import { useCart } from '@/context/cartContext';
interface Props {
  params: { id?: string }; // id param is optional for create
}
interface ListingFormData {
  id: string
  title: string;
  description: string;
  price: string;
  discount_percent: string;
  discount_price: string;
  display_price: string;
  top_selling: boolean;
  clearance_sale: boolean;
  images: string[];
  status: boolean
  category: any
}
export default function ListingDetail({ params }: Props) {
  // const { checkCart } = useCartStore();
  const { updateCartCount } = useCart();
  const id = params?.id;
  const [cart, setCart] = useLocalStorage<any[]>('cart', []);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState('');
  const [formData, setFormData] = useState<ListingFormData>({
    id: "",
    title: '',
    description: '',
    price: "",
    discount_percent: "",
    discount_price: "",
    display_price: "",
    top_selling: false,
    clearance_sale: false,
    images: [],
    status: true,
    category: ''
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  useEffect(() => {
    if (!emblaApi) return;

    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', updateButtons);
    updateButtons();
  }, [emblaApi]);
  useEffect(() => {
    if (!id || id === "new") {
      setLoading(false)
      return;
    }
    setLoading(true);
    fetch(`/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          id: data._id,
          title: data.title,
          description: data.description,
          price: data.price,
          discount_percent: "", // you can calculate from price & discount_price if needed
          discount_price: data.discount_price,
          display_price: data.display_price,
          top_selling: data.top_selling,
          clearance_sale: data.clearance_sale,
          images: data.images || [],
          status: data.status,
          category: data.category
        });
      })
      .finally(() => setLoading(false));
  }, [id]);
  const {
    title,
    description,
    price,
    discount_price,
    display_price,
    images = [],
    top_selling,
    clearance_sale,
    category,
    status,
  } = formData;

  const addToCart = () => {
    const countValue = Number(count)
    if (countValue <= 0) return;
    console.log("cartcartcartcartcart", cart);
    const existingItemIndex = cart.findIndex(item => item.id === formData.id);

    let updatedCart = [...cart];
    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].count += countValue;
    } else {
      console.log("formDataformData", formData);
      updatedCart.push({
        ...formData,
        count: countValue,
      });
    }

    setCart(updatedCart);
    updateCartCount(updatedCart);
    alert('Added to cart!');
  };
  if (loading) return <ListingSkeleton />;
  return (

    <div className="max-w-5xl mx-auto px-4 py-8">
  {/* Breadcrumb */}
  <div className="text-sm text-gray-500 dark:text-white mb-4">
    <Link href={"/"}>
      <span className="text-gray-400 dark:text-gray-500">Home</span>
    </Link> / <span className=" dark:text-white text-black">Product</span>
  </div>

  {/* Image Carousel */}
  <div className="relative max-w-4xl mb-6">
    <div className="overflow-hidden rounded-lg" ref={emblaRef}>
      <div className="flex">
        {images.map((img, idx) => (
          <div key={idx} className="min-w-full h-[300px] sm:h-[450px] relative">
            <Image
              src={img}
              alt={`Fish ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
    </div>

    {images.length > 1 && (
      <>
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white p-2 rounded-full shadow z-10"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white p-2 rounded-full shadow z-10"
        >
          <ChevronRight />
        </button>
      </>
    )}
  </div>

  {/* Product Info */}
  <div className="space-y-4 text-gray-800 dark:text-gray-100">
    <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>

    <div className="space-y-1">
      <p>
        <span className="font-semibold">Price:</span> ₹{price}
      </p>
      {discount_price && (
        <p className="text-red-600 font-medium">Discount: {discount_price}% off</p>
      )}
      <p className="text-sky-600 dark:text-sky-400 font-bold text-lg">
        Final Price: ₹{display_price}
      </p>
    </div>

    {top_selling && (
      <span className="inline-block text-xs bg-green-100 dark:bg-green-700 dark:text-white text-green-700 px-2 py-1 rounded-full">
        Top Selling
      </span>
    )}
    {clearance_sale && (
      <span className="inline-block text-xs bg-red-100 dark:bg-red-700 dark:text-white text-red-700 px-2 py-1 rounded-full ml-2">
        Clearance Sale
      </span>
    )}

    <div className="pt-6">
      <h3 className="font-semibold text-lg">More Info</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Follow us on Instagram for more fish care and aquarium tips: <br />
        @KovaiGuppies @KovaiAquatics
      </p>
    </div>

    <div className="flex gap-2 items-center mb-4">
      <label htmlFor="quantity" className="font-medium text-black dark:text-white">Quantity:</label>
      <input
        id="quantity"
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        placeholder='0'
        className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-800 dark:text-white"
      />
    </div>

    <button
      className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow"
      onClick={addToCart}
    >
      Add to Cart
    </button>
  </div>
</div>

  );
}
