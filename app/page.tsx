'use client';

import { Key, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence  } from 'framer-motion';
import { Parisienne } from 'next/font/google'
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useRouter } from 'next/navigation';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
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
   useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(); // ensure correct resizing when data loads
    }
  }, [categories, selectedCategory]);
  const allItems = selectedCategory?.name ? childCategories : categories.filter((item : any) => item.parent === null);
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
        <div className="overflow-hidden px-4" ref={emblaRef}>
      <div className="flex gap-4 md:justify-center mb-6">
        {/* All Fishes static card */}
        <div className="min-w-[120px] text-center font-medium shrink-0 pl-5">
          <img
            src="https://jprcwo3zvr1gqikh.public.blob.vercel-storage.com/allfish-1750699914748-gxkQc8Ruyo-z75Kuwy8iQ.jpg"
            className="w-28 h-28 object-cover rounded-lg mx-auto"
          />
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white w-full px-2 py-1 rounded mt-2 text-sm"
            onClick={() => handleCategory({})}
          >
            All Fishes
          </button>
        </div>

        {allItems.map((item: any) => (
          <div key={item._id} className="min-w-[120px] text-center font-medium shrink-0">
            <img src={item.image} className="w-28 h-28 object-cover rounded-lg mx-auto" />
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white w-full px-2 py-1 rounded mt-2 text-sm"
              onClick={() => handleCategory(item)}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>
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
  const images = listing.images || [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
const router = useRouter();
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const handleBuyClick = () => {
  // if (Number(count) > 0) {
    router.push(`/user/listingDetail/${listing._id}`);
  // }
};
  return (
    <>
  <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden group relative border border-sky-100 hover:shadow-2xl transition-all p-5"
      whileHover={{ scale: 1.02 }}
    >
<div className="relative w-full h-52 overflow-hidden rounded-lg" ref={emblaRef}>
      <div className="flex h-full">
        {images.map((img: string | StaticImport, idx: Key | null | undefined) => (
          <div className="relative min-w-full h-52" key={idx}>
            <Image
              src={img}
              alt="Product"
              fill
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-sky-500/80 text-white p-2 rounded-full text-lg z-10 w-8 h-8"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500/80 text-white p-2 rounded-full text-lg z-10 w-8 h-8"
          >
            <ChevronRight size={18} />
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

      {/* Buy button */}
      <button
        // disabled={Number(count) <= 0}
        onClick={handleBuyClick}
        className={`w-full py-2 rounded text-white bg-sky-500 hover:bg-sky-600`}
      >
        Buy
      </button>
    </motion.div>
     
    </>
  );
}