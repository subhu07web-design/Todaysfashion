/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Twitter, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  ChevronRight,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './lib/supabase';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  description: string;
  trending?: boolean;
  newArrival?: boolean;
}

interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic White Linen Shirt",
    price: 1299,
    category: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M", "L", "XL"],
    description: "Breathable and stylish linen shirt for a clean summer look.",
    trending: true,
    newArrival: true
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    price: 2499,
    category: "Women's Fashion",
    image: "https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg",
    sizes: ["S", "M", "L"],
    description: "Elegant floral dress perfect for garden parties and summer outings.",
    trending: true,
    newArrival: false
  },
  {
    id: 3,
    name: "Slim Fit Denim Jeans",
    price: 1899,
    category: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
    sizes: ["M", "L", "XL"],
    description: "Durable and comfortable slim-fit denim for everyday wear.",
    trending: false,
    newArrival: true
  },
  {
    id: 4,
    name: "Leather Chelsea Boots",
    price: 3499,
    category: "Men's Shoes",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800",
    sizes: ["7", "8", "9", "10"],
    description: "Premium leather boots that add a touch of sophistication to any outfit.",
    trending: true,
    newArrival: false
  },
  {
    id: 5,
    name: "Silk Evening Gown",
    price: 5999,
    category: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M"],
    description: "Luxurious silk gown for special occasions and formal events.",
    trending: false,
    newArrival: true
  },
  {
    id: 6,
    name: "Minimalist Gold Necklace",
    price: 899,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    sizes: ["One Size"],
    description: "A delicate gold-plated necklace for a subtle touch of elegance.",
    trending: true,
    newArrival: false
  },
  {
    id: 7,
    name: "Casual Canvas Sneakers",
    price: 1499,
    category: "Women's Footwear",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800",
    sizes: ["5", "6", "7", "8"],
    description: "Versatile canvas sneakers for all-day comfort and style.",
    trending: false,
    newArrival: true
  },
  {
    id: 8,
    name: "Summer Straw Hat",
    price: 699,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?auto=format&fit=crop&q=80&w=800",
    sizes: ["One Size"],
    description: "Classic straw hat to protect you from the sun in style.",
    trending: false,
    newArrival: false
  },
  {
    id: 9,
    name: "Premium Men's Fashion Shoes",
    price: 2999,
    category: "Men's Shoes",
    image: "https://i.postimg.cc/Y06Vdf3Q/todaysfashion-IMG1.jpg",
    sizes: ["7", "8", "9", "10"],
    description: "Stylish and comfortable men's shoes from Today's Fashion collection.",
    trending: true,
    newArrival: true
  },
  {
    id: 10,
    name: "Classic Men's Casual Shoes",
    price: 2499,
    category: "Men's Shoes",
    image: "https://i.postimg.cc/9XZvXCj6/todaysfashion-IMG2.jpg",
    sizes: ["7", "8", "9", "10"],
    description: "Elegant and durable casual shoes for men, perfect for any occasion.",
    trending: true,
    newArrival: true
  },
  {
    id: 11,
    name: "Modern Men's Sporty Shoes",
    price: 2499,
    category: "Men's Shoes",
    image: "https://i.postimg.cc/xjMWjn2n/todaysfashion-IMG4.jpg",
    sizes: ["7", "8", "9", "10"],
    description: "Lightweight and stylish sporty shoes for men, designed for comfort and performance.",
    trending: true,
    newArrival: true
  },
  {
    id: 12,
    name: "Classic Men's Suit",
    price: 4999,
    category: "Men's Fashion",
    image: "https://images.pexels.com/photos/29882823/pexels-photo-29882823.jpeg",
    sizes: ["S", "M", "L", "XL"],
    description: "A sharp and sophisticated suit for the modern man.",
    trending: true,
    newArrival: true
  },
  {
    id: 13,
    name: "Modern Casual Shirt",
    price: 1999,
    category: "Men's Fashion",
    image: "https://images.pexels.com/photos/27871997/pexels-photo-27871997.jpeg",
    sizes: ["S", "M", "L", "XL"],
    description: "A stylish and comfortable casual shirt for everyday wear.",
    trending: true,
    newArrival: true
  },
  {
    id: 14,
    name: "Elegant Summer Dress",
    price: 2999,
    category: "Women's Fashion",
    image: "https://images.pexels.com/photos/23501005/pexels-photo-23501005.jpeg",
    sizes: ["S", "M", "L", "XL"],
    description: "A beautiful and elegant summer dress, perfect for any occasion.",
    trending: true,
    newArrival: true
  }
];

const CATEGORIES = [
  "Men's Fashion",
  "Women's Fashion",
  "Summer Collection",
  "Trending",
  "Men's Shoes",
  "Women's Footwear",
  "Accessories"
];

// --- Components ---

const Navbar = ({ cartCount }: { cartCount: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled || isSearchOpen ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-black uppercase">
          Today's Fashion
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">Home</Link>
          <Link to="/shop" className="text-sm font-medium hover:text-emerald-600 transition-colors">Shop</Link>
          <Link to="/about" className="text-sm font-medium hover:text-emerald-600 transition-colors">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-emerald-600 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center space-x-5">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <Link to="/cart" className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="max-w-3xl mx-auto px-6 py-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for products, categories..."
                  className="w-full text-2xl font-bold tracking-tighter border-none focus:ring-0 outline-none placeholder:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
                  Search
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold tracking-tighter uppercase">Today's Fashion</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-6 text-2xl font-medium">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </div>
            <div className="mt-auto pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-4">Follow Us</p>
              <div className="flex space-x-4">
                <Instagram size={20} />
                <Facebook size={20} />
                <Twitter size={20} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-black text-white pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div>
        <h3 className="text-xl font-bold mb-6 tracking-tighter uppercase">Today's Fashion</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Premium fashion for the modern individual. Quality, style, and comfort delivered to your doorstep.
        </p>
        <div className="flex space-x-4">
          <Instagram size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          <Facebook size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          <Twitter size={18} className="text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
        <ul className="space-y-4 text-sm text-gray-400">
          <li><Link to="/shop" className="hover:text-white">Shop All</Link></li>
          <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
          <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Contact Info</h4>
        <ul className="space-y-4 text-sm text-gray-400">
          <li className="flex items-start space-x-3">
            <MapPin size={16} className="mt-1 flex-shrink-0" />
            <span>NT Rd, near North Lakhimpur, Assam, India</span>
          </li>
          <li className="flex items-center space-x-3">
            <Phone size={16} className="flex-shrink-0" />
            <span>+91 87618 65300</span>
          </li>
          <li className="flex items-center space-x-3">
            <Clock size={16} className="flex-shrink-0" />
            <span>Open daily: 10 AM - 10 PM</span>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
        <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
        <div className="flex">
          <input 
            type="email" 
            placeholder="Your email" 
            className="bg-zinc-900 border-none px-4 py-2 text-sm w-full focus:ring-1 focus:ring-emerald-600 outline-none"
          />
          <button className="bg-emerald-600 px-4 py-2 hover:bg-emerald-700 transition-colors">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} Today's Fashion. All rights reserved.
    </div>
  </footer>
);

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void, key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-lg">
      <img 
        src={product.image} 
        alt={product.name}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      
      {product.newArrival && (
        <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-sm">
          New
        </span>
      )}
      
      <button 
        onClick={() => onAddToCart(product)}
        className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 text-xs font-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
      >
        Add to Cart
      </button>
    </div>
    <Link to={`/product/${product.id}`} className="block">
      <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <p className="text-base font-bold text-black">₹{product.price.toLocaleString()}</p>
    </Link>
  </motion.div>
);

// --- Pages ---

const Home = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern Fashion Shop"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-4 text-emerald-400">
              Welcome to
            </span>
            <div className="mb-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 text-emerald-100">
                টুডেইছ ফেশ্বন
              </h2>
              <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8] uppercase">
                Today's Fashion
              </h1>
            </div>
            <p className="text-lg text-gray-200 mb-10 max-w-lg leading-relaxed">
              Premium quality fashion for the modern individual. Experience the best collection in North Lakhimpur, Assam.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center group">
                Shop Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="bg-transparent border border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Featured Categories</h2>
              <p className="text-gray-500 text-sm">Explore our curated collections for every occasion.</p>
            </div>
            <Link to="/shop" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Men's Fashion", img: "https://images.pexels.com/photos/29882823/pexels-photo-29882823.jpeg" },
              { name: "Women's Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" },
              { name: "Accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-[500px] overflow-hidden group cursor-pointer rounded-xl"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">{cat.name}</h3>
                  <Link to={`/category/${cat.name}`} className="text-xs font-bold uppercase tracking-widest bg-white text-black px-4 py-2 hover:bg-emerald-600 hover:text-white transition-colors">
                    Explore
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Trending Now</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Our most popular pieces that everyone is talking about this season.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.filter(p => p.trending).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">New Arrivals</h2>
              <p className="text-gray-500 text-sm">Freshly added pieces to elevate your style.</p>
            </div>
            <Link to="/shop" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.filter(p => p.newArrival).slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* New Location Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">Visit Our Store</span>
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Find Us</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We are located in the heart of North Lakhimpur. Come visit us for the latest fashion trends.</p>
          </div>
          <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <iframe 
              src="https://www.google.com/maps?q=NT%20Rd,%20near%20North%20Lakhimpur,%20North%20Lakhimpur,%20Assam%20787001,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Store Location Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-black rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-12 md:p-20 text-white">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4 block">Limited Time Offer</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-none">UP TO 50% OFF SUMMER SALE.</h2>
            <p className="text-gray-400 mb-10 leading-relaxed">Don't miss out on our biggest sale of the year. Refresh your wardrobe with premium pieces at unbeatable prices.</p>
            <Link to="/shop" className="inline-block bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
              Shop the Sale
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[400px] md:h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200" 
              alt="Promo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">What Our Customers Say</h2>
              <div className="flex items-center space-x-1 text-emerald-600">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-black font-bold ml-2">4.8/5 Rating</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", text: "The quality of the linen shirts is amazing. Perfect fit and very breathable for the Assam heat!", role: "Verified Buyer" },
              { name: "Rahul Das", text: "Today's Fashion has become my go-to store in Lakhimpur. Great collection and friendly staff.", role: "Local Guide" },
              { name: "Anjali Baruah", text: "Ordered online and received my dress in 2 days. The packaging was premium and the dress is beautiful.", role: "Fashion Blogger" }
            ].map((t, i) => (
              <div key={i} className="p-8 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-gray-600 italic mb-6">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-black">{t.name}</h4>
                  <p className="text-xs text-emerald-600 uppercase tracking-widest font-bold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Shop = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const { category } = useParams();
  const [activeCategory, setActiveCategory] = useState(category || "All");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);
  const searchQuery = searchParams.get("q") || "";
  
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter uppercase mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : "Shop All"}
              </h1>
              {searchQuery && (
                <p className="text-gray-500 text-sm">Found {filteredProducts.length} products matching your search.</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveCategory("All")}
                className={cn(
                  "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all",
                  activeCategory === "All" ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                )}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all",
                    activeCategory === cat ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <Search size={48} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold tracking-tighter uppercase mb-4">No products found</h2>
            <p className="text-gray-500 mb-8">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => {
                setActiveCategory("All");
                window.history.pushState({}, '', '/shop');
              }}
              className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        <div className="flex flex-col justify-center">
          <nav className="flex items-center space-x-2 text-xs text-gray-400 uppercase tracking-widest mb-6">
            <Link to="/shop" className="hover:text-black">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-black">{product.category}</span>
          </nav>
          
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-emerald-600 mb-8">₹{product.price.toLocaleString()}</p>
          
          <p className="text-gray-600 leading-relaxed mb-10">
            {product.description}
          </p>
          
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all",
                    selectedSize === size ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => onAddToCart(product)}
            disabled={!selectedSize && product.sizes[0] !== "One Size"}
            className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            {selectedSize || product.sizes[0] === "One Size" ? "Add to Cart" : "Select a Size"}
          </button>
          
          <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Shipping</h4>
              <p className="text-xs text-gray-600">Free delivery on orders over ₹2,000. Standard delivery in 3-5 days.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Returns</h4>
              <p className="text-xs text-gray-600">Easy 7-day return policy for all unworn items with tags.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = ({ items, onUpdateQty, onRemove }: { items: CartItem[], onUpdateQty: (id: number, size: string, delta: number) => void, onRemove: (id: number, size: string) => void }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="pt-48 pb-48 px-6 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="inline-block bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {items.map((item, i) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex items-center space-x-6 pb-8 border-b border-gray-100">
                <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg uppercase tracking-tight">{item.name}</h3>
                    <button onClick={() => onRemove(item.id, item.selectedSize)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Size: {item.selectedSize} | {item.category}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => onUpdateQty(item.id, item.selectedSize, -1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.selectedSize, 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl h-fit">
            <h2 className="text-xl font-bold uppercase tracking-tighter mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-emerald-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="block w-full bg-black text-white py-5 text-center text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
              Checkout Now
            </Link>
            <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest">Secure Payment Guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = ({ items, total, onClearCart }: { items: CartItem[], total: number, onClearCart: () => void }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    pinCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            street_address: formData.address,
            city: formData.city,
            zip_code: formData.pinCode,
            product_name: items.map(item => `${item.name} (x${item.quantity})`).join(', '),
            total_amount: total,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      onClearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-48 pb-48 px-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Thank you for shopping with Today's Fashion. Your order has been placed and will be delivered soon.</p>
        <Link to="/" className="inline-block bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  required
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name" 
                  className="bg-gray-50 border-none px-4 py-3 text-sm rounded-lg w-full focus:ring-1 focus:ring-emerald-600 outline-none" 
                />
                <input 
                  required
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                  className="bg-gray-50 border-none px-4 py-3 text-sm rounded-lg w-full focus:ring-1 focus:ring-emerald-600 outline-none" 
                />
              </div>
              <input 
                required
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address" 
                className="bg-gray-50 border-none px-4 py-3 text-sm rounded-lg w-full mb-4 focus:ring-1 focus:ring-emerald-600 outline-none" 
              />
              <input 
                required
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address" 
                className="bg-gray-50 border-none px-4 py-3 text-sm rounded-lg w-full mb-4 focus:ring-1 focus:ring-emerald-600 outline-none" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City" 
                  className="bg-gray-50 border-none px-4 py-3 text-sm rounded-lg w-full focus:ring-1 focus:ring-emerald-600 outline-none" 
                />
                <input 
                  required
                  type="text" 
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="PIN Code" 
                  className="bg-gray-50 border-none px-4 py-3 text-sm rounded-lg w-full focus:ring-1 focus:ring-emerald-600 outline-none" 
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-600 transition-colors">
                  <input type="radio" name="payment" className="text-emerald-600 focus:ring-emerald-600" defaultChecked />
                  <span className="ml-3 text-sm font-medium">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-600 transition-colors opacity-50">
                  <input type="radio" name="payment" className="text-emerald-600 focus:ring-emerald-600" disabled />
                  <span className="ml-3 text-sm font-medium">Credit / Debit Card (Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl h-fit">
            <h2 className="text-xl font-bold uppercase tracking-tighter mb-8">Final Review</h2>
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-emerald-600">{total > 2000 ? "FREE" : "₹150"}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-emerald-600 text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Processing...
                </>
              ) : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const About = () => (
  <div className="pt-32 pb-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">Our Story</span>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mb-8">Redefining Fashion in Lakhimpur.</h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Founded in the heart of North Lakhimpur, Today's Fashion began with a simple mission: to bring premium, high-quality fashion to our local community at accessible prices.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe that what you wear is an extension of your personality. That's why we meticulously curate our collections, ensuring every piece meets our high standards of style, comfort, and durability.
          </p>
        </div>
        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <img src="https://i.postimg.cc/Wzdq8x4p/todaysfashionfront-IMG.png" alt="Store" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star size={32} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Quality First</h3>
          <p className="text-sm text-gray-500">We source only the finest fabrics and materials for our clothing line.</p>
        </div>
        <div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Curated Style</h3>
          <p className="text-sm text-gray-500">Our team handpicks every item to ensure it aligns with modern trends.</p>
        </div>
        <div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Local Roots</h3>
          <p className="text-sm text-gray-500">Proudly serving the North Lakhimpur community since our inception.</p>
        </div>
      </div>
    </div>
  </div>
);

const Contact = () => (
  <div className="pt-32 pb-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tighter uppercase mb-4">Get in Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Have a question about our products or your order? We're here to help.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <MapPin size={24} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-tight mb-1">Visit Us</h4>
                <p className="text-sm text-gray-500">NT Rd, near North Lakhimpur, Assam, India</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Phone size={24} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-tight mb-1">Call Us</h4>
                <p className="text-sm text-gray-500">+91 87618 65300</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Clock size={24} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-tight mb-1">Hours</h4>
                <p className="text-sm text-gray-500">Daily: 10 AM - 10 PM</p>
              </div>
            </div>
          </div>
          
          <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps?q=NT%20Rd,%20near%20North%20Lakhimpur,%20North%20Lakhimpur,%20Assam%20787001,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Store Location Small"
            ></iframe>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5">
          <h2 className="text-2xl font-bold uppercase tracking-tighter mb-8">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input type="text" className="w-full bg-gray-50 border-none px-4 py-4 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border-none px-4 py-4 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
              <input type="text" className="w-full bg-gray-50 border-none px-4 py-4 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
              <textarea rows={5} className="w-full bg-gray-50 border-none px-4 py-4 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none resize-none" placeholder="Your message here..."></textarea>
            </div>
            <button className="bg-black text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all rounded-xl w-full md:w-auto">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* New Location Section */}
      <section className="mt-24">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">Visit Our Store</span>
          <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Our Location</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Come and experience our collection in person. We are located in the heart of North Lakhimpur, providing you with the best fashion experience.</p>
        </div>
        <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <iframe 
            src="https://www.google.com/maps?q=NT%20Rd,%20near%20North%20Lakhimpur,%20North%20Lakhimpur,%20Assam%20787001,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            title="Our Location Map"
          ></iframe>
        </div>
      </section>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === (product.sizes[0] || "One Size"));
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === (product.sizes[0] || "One Size")) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: product.sizes[0] || "One Size", quantity: 1 }];
    });
    // Optional: Show toast or navigate to cart
  };

  const updateQty = (id: number, size: string, delta: number) => {
    setCart(prev => prev.map(item => 
      (item.id === id && item.selectedSize === size) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeItem = (id: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
      
      <main>
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
          <Route path="/category/:category" element={<Shop onAddToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<Cart items={cart} onUpdateQty={updateQty} onRemove={removeItem} />} />
          <Route path="/checkout" element={<Checkout items={cart} total={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + (cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) > 2000 ? 0 : 150)} onClearCart={() => setCart([])} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/918761865300" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-8 bg-[#25D366] text-white shadow-2xl p-4 rounded-full hover:scale-110 transition-all z-40 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="fill-current"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
          Chat with us
        </span>
      </a>

      {/* Scroll to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-white border border-gray-100 shadow-xl p-3 rounded-full hover:bg-emerald-600 hover:text-white transition-all z-40"
      >
        <ChevronRight size={20} className="-rotate-90" />
      </button>
    </div>
  );
}
