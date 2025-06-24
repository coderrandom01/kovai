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
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategories] = useState<any>({})
  const [childCategories, setChildCategories] = useState([])
  const [filteredListings,setFilteredListings] = useState([])
  const [childSelected,setChildSelected] = useState(false)
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
    // setLoading(false)
    const fetchListings = async () => {
      const res = await fetch('/api/listings');
      const data = await res.json();
      setListings(data);
      setFilteredListings(data)
      setLoading(false)
          fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
    };

    fetchListings();
  }, []);
 const handleCategory = (item : any) => {
  setSelectedCategories(item)
  if(childCategories.length > 0 && item?.name){
const filteredListings = listings.filter(
  (listing : any) => listing.category === item._id
);
setChildSelected(true)
setFilteredListings(filteredListings)
  }
  else if(item?.name){
    const childCategories = categories.filter(
    (cat : any) => cat.parent?._id === item._id
  );
  setChildCategories(childCategories)
  }else{
    setFilteredListings(listings)
    setChildCategories([])
  }
 }

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
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-500">Categories</h2>
<div className="flex flex-wrap justify-center gap-4 mb-6 px-4">        
            <div className='m-2 text-center font-medium'>
      <img src= "https://jprcwo3zvr1gqikh.public.blob.vercel-storage.com/allfish-1750699914748-gxkQc8Ruyo-z75Kuwy8iQ.jpg" className = "w-28 h-28 object-cover rounded-lg mx-auto"/>
    
        <button className = "bg-sky-500 hover:bg-sky-600 text-white w-full px-4 py-1 rounded mt-2" onClick = {() => handleCategory({})}>All Fishes</button>
    </div>

        {selectedCategory?.name ? childCategories.map((item : any) => (
    <div key={item._id} className='m-2 text-center font-medium'>
      <img src={item.image} className = "w-28 h-28 object-cover rounded-lg mx-auto"/>
      
        <button className = "bg-sky-500 hover:bg-sky-600 text-white w-full px-4 py-1 rounded mt-2" onClick = {() => handleCategory(item)}>{item.name}</button>

    </div>
)) : categories
  ?.filter((item : any) => item.parent === null)
  .map((item : any) => (
    <div key={item._id} className='m-2 text-center font-medium'>
      <img src={item.image} className = "w-28 h-28 rounded-lg"/>
      
        <button className = "bg-sky-500 hover:bg-sky-600 text-white w-full px-4 py-1 rounded mt-2" onClick = {() => handleCategory(item)}>{item.name}</button>

    </div>
))}
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-500">{childSelected ? selectedCategory.name : "All Fishes"}</h2>
        {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <ListingCardSkeleton key={i} />
    ))}
  </div>
) : filteredListings.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {filteredListings.map((listing: any) => (
      <ListingCard key={listing._id} listing={listing} />
    ))}
  </div>
) : (
  <div className = "flex justify-center items-center flex-col">
  <div className="text-center text-gray-500 mt-10 text-lg">No Fishes or Products found.</div>
  <button className = "bg-sky-500 hover:bg-sky-600 text-white w-52 px-4 py-1 rounded mt-2" onClick = {() => handleCategory({})}>All Fishes</button>
  </div>
)}
      </section>
    </div>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 animate-pulse border border-sky-100">
      <div className="w-full h-52 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
  );
}

// Enhanced ListingCard with zoom effect and modern design
function ListingCard({ listing }: { listing: any }) {
  const [index, setIndex] = useState(0);
  const images = listing.images || [];
    const [count, setCount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState('');
  const nextImage = () => setIndex((index + 1) % images.length);
  const prevImage = () => setIndex((index - 1 + images.length) % images.length);
   const businessWhatsAppNumber = '919344644827'; // example: India number

  // Create WhatsApp URL with message
  const createWhatsAppUrl = () => {
    const msg = `Hello, I want to buy ${count} unit(s) of *${listing.title}* priced at ₹${listing.display_price}.\nMy Name is: ${mobile}`;
    return `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Handle submit from modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return alert('Please enter your Name');
    // Redirect to WhatsApp chat
window.location.href = createWhatsAppUrl();
    setShowModal(false);
    setCount("");
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
          <p className='text-lg font-bold line-through mt-2'>Price: ₹{listing.price}</p>
          <p className="text-red-600 font-bold mt-2">Discount: ₹{listing.discount_price}</p>
          <p className="text-sky-500 font-semibold text-xl mt-2">Final Price: ₹{listing.display_price}</p>
        </div>
        {listing.top_selling && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block mt-2">
            Top Selling
          </span>
        )}
        {listing.clearance_sale && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full inline-block mt-2">
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
          placeholder='0'
          value={count}
          onChange={(e) => setCount((e.target.value))}
          className="w-16 border rounded px-2 py-1 text-black"
        />
      </div>

      {/* Buy button */}
      <button
        disabled={Number(count) <= 0}
        onClick={() => setShowModal(true)}
        className={`w-full py-2 rounded text-white ${
          Number(count) > 0 ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Buy
      </button>
    </motion.div>
     {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h4 className="text-xl mb-4 font-semibold text-black">Enter your Name</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Name"
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