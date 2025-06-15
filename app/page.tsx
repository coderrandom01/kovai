'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence  } from 'framer-motion';
import { Parisienne } from 'next/font/google'
const parisienne = Parisienne({
  subsets: ['latin'],
  weight: '400', // Only 400 is available
  display: 'swap',
});

export default function LandingPage() {
  const [listings, setListings] = useState([]);
  const [index, setIndex] = useState(0);

const images = [
    "https://kovai-guppies-images.s3.eu-north-1.amazonaws.com/u-Xq2bmK-PaDNbH1ZArbR.jpg",
    "https://kovai-guppies-images.s3.eu-north-1.amazonaws.com/h5W5D1HGNaRSnKJRt-Au4.jpg",
    "https://kovai-guppies-images.s3.eu-north-1.amazonaws.com/uBC4yDDJOeWLUrXyFJh1U.jpg"
]
  // auto-advance every 6 s
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch('/api/listings');
      const data = await res.json();
      setListings(data);
    };

    fetchListings();
  }, []);
 

  return (
    <div>
          <header className="bg-sky-500 text-white p-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center">
        <div>
          <img src='https://kovai-guppies-images.s3.eu-north-1.amazonaws.com/4hY0fNISWkkqxy7bvBk_o.jpg' className='w-20 h-20' />
        </div>
        <h1 className="text-3xl font-bold ml-3">Kovai Guppies</h1>
      </div>
    </header>
      {/* Video Banner */}
  <section className="relative w-full h-[80vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={images[index]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <Image
            src={images[index]}
            alt="Hero banner"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* dark overlay + headline */}
      <div className= {`${parisienne.className} absolute inset-0 bg-black/40 flex items-center justify-center`}>
  <motion.h1
  className= "text-white text-3xl md:text-5xl sm:text-2xl font-bold drop-shadow-lg"
  
  initial={{ opacity: 0, y: 20 }}
  animate={{
    opacity: [0, 1, 0.85, 1],  // fade-in and pulse
    y: [20, 0, -5, 0],         // slide up then pulse up and down
  }}
  transition={{
    duration: 3,
    ease: 'easeInOut',
    times: [0, 0.4, 0.7, 1], // control keyframe timings
    repeat: Infinity,
    repeatType: 'loop',
  }}
  style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.6)' }}
>
  Welcome to Kovai Guppies
</motion.h1>
      </div>
    </section>
      {/* Product Listings */}
      <section className="px-6 py-10 bg-sky-50">
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-500">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Enhanced ListingCard with zoom effect and modern design
function ListingCard({ listing }: { listing: any }) {
  const [index, setIndex] = useState(0);
  const images = listing.images || [];
    const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState('');
  const nextImage = () => setIndex((index + 1) % images.length);
  const prevImage = () => setIndex((index - 1 + images.length) % images.length);
   const businessWhatsAppNumber = '918883670422'; // example: India number

  // Create WhatsApp URL with message
  const createWhatsAppUrl = () => {
    const msg = `Hello, I want to buy ${count} unit(s) of *${listing.title}* priced at ₹${listing.display_price}.\nMy mobile number is: ${mobile}`;
    return `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Handle submit from modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return alert('Please enter your mobile number');
    // Redirect to WhatsApp chat
window.location.href = createWhatsAppUrl();
    setShowModal(false);
    setCount(0);
    setMobile('');
  };
  return (
    <>
  <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden group relative border border-sky-100 hover:shadow-2xl transition-all p-5"
      whileHover={{ scale: 1.02 }}
    >
      {/* Smooth Image Carousel */}
      <div className="relative w-full h-52 overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt="Product"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110 rounded"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-sky-500/80 text-white p-2 rounded-full text-lg z-10 w-8 h-8"
            >
              <span className='absolute btn_display_right'>‹</span>
              
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500/80 text-white p-1 rounded-full text-lg z-10 w-8 h-8"
            >
              <span className='absolute btn_display_right'>›</span>
              
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="py-4 space-y-1">
        <h3 className="text-xl font-bold text-sky-500">{listing.title}</h3>
        {/* <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p> */}
        <div className="text-sm text-gray-700">
          <p className='text-lg font-bold line-through'>Price: ₹{listing.price}</p>
          <p className="text-red-600 font-bold">Discount: ₹{listing.discount_price}</p>
          <p className="text-sky-500 font-semibold text-xl">Final Price: ₹{listing.display_price}</p>
        </div>
        {listing.top_selling && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block">
            Top Selling
          </span>
        )}
        {listing.clearance_sale && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full inline-block">
            Clearance Sale
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor={`count-${listing._id}`} className="font-medium text-black">
          Quantity:
        </label>
        <input
          id={`count-${listing._id}`}
          type="number"
          min={0}
          max={99}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1 text-black"
        />
      </div>

      {/* Buy button */}
      <button
        disabled={count <= 0}
        onClick={() => setShowModal(true)}
        className={`w-full py-2 rounded text-white ${
          count > 0 ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Buy
      </button>
    </motion.div>
     {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h4 className="text-xl mb-4 font-semibold text-black">Enter your mobile number</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
                className="w-full border px-3 py-2 rounded text-black"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border text-black"
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
    </>
  );
}