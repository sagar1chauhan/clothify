import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, User, ShoppingBag, Menu, X, LayoutGrid, Compass, Heart, ChevronRight } from 'lucide-react';
import MegaMenu from './MegaMenu';
import DiscoverModal from './DiscoverModal';
import TryAndBuyModal from './TryAndBuyModal';
import { categories } from '../../data';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCategory } from '../../context/CategoryContext';
import { useAuth } from '../../context/AuthContext';

const CLICK_COLLECT_PHRASES = ["Click", "Connect", "Collect"];

const Header = () => {
    const { user } = useAuth();
    const { wishlistItems } = useWishlist();
    const { activeCategory, setActiveCategory, getCategoryColor } = useCategory();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
    const [isClickCollectOpen, setIsClickCollectOpen] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const { getCartCount, lastAddedItem } = useCart();
    const cartCount = getCartCount();
    const location = useLocation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                // At the very top - always show header
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling Down - hide header
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling Up - show header for navigation
                setIsVisible(true);
            }

            setIsScrolled(currentScrollY > 20);
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % CLICK_COLLECT_PHRASES.length);
        }, 3000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [lastScrollY]);

    const [searchSuggestions, setSearchSuggestions] = useState([]);

    const handleSearchInput = (value) => {
        setSearchQuery(value);
        if (value.trim().length > 1) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase()) ||
                p.brand.toLowerCase().includes(value.toLowerCase()) ||
                p.category.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 6);
            setSearchSuggestions(filtered);
        } else {
            setSearchSuggestions([]);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        navigate(`/product/${suggestion.id}`);
        setSearchQuery('');
        setSearchSuggestions([]);
    };

    // Only show categories on Home and Shop pages
    const showCategories = location.pathname === '/' || location.pathname === '/shop';

    const currentBgColor = getCategoryColor(activeCategory);

    return (
        <header className={`w-full sticky top-0 z-[1000] transition-all duration-300 transform ${isScrolled ? 'shadow-lg' : 'shadow-sm'} ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* Top Colored Section */}
            <div
                className={`relative z-[60] transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/20' : ''}`}
                style={{ backgroundColor: isScrolled ? 'transparent' : currentBgColor }}
            >
                {/* Location Bar */}
                <div className="px-4 py-1.5 flex justify-between items-center group no-underline hover:bg-white/5 transition-colors">
                    <Link to="/addresses" className="flex items-center gap-3 no-underline">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm border border-white/10">
                            60
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-black text-[15px] leading-tight transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-white'}`}>
                                Mins
                            </span>
                            <div className={`flex items-center gap-1 text-[12px] font-bold transition-colors duration-500 ${isScrolled ? 'text-gray-500' : 'text-white/90'}`}>
                                <span>Current: Add Address</span>
                                <span className="text-[14px] font-black group-hover:translate-x-1 transition-transform">›</span>
                            </div>
                        </div>
                    </Link>
                    <div className="flex md:hidden items-center gap-3">
                        <Link to="/wishlist" className="relative p-2">
                            <Heart size={24} className={isScrolled ? 'text-black' : 'text-white'} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                        <button className="p-1" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={28} className={isScrolled ? 'text-black' : 'text-white'} />
                        </button>
                    </div>
                </div>

                {/* Search Bar - Visible on All Screens */}
                <div className="px-4 pb-3 flex items-center gap-2 relative">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            placeholder='Search for "Jackets"'
                            className="w-full py-3.5 pl-5 pr-12 border-none rounded-xl bg-white text-[15px] font-medium text-black outline-none placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-[#ffcc00]/30 transition-all"
                            value={searchQuery}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <Search
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer group-hover:text-black transition-colors"
                            size={18}
                            onClick={() => searchQuery.trim() && handleSearch({ key: 'Enter' })}
                        />

                        {/* Search Suggestions Dropdown */}
                        {searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-[20px] shadow-2xl overflow-hidden z-[1010] border border-gray-100 animate-fadeInUp">
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-tight text-gray-400">Products Found</span>
                                    <span className="text-[10px] font-black text-blue-600 uppercase">View All</span>
                                </div>
                                {searchSuggestions.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="px-4 py-3 hover:bg-gray-50 flex items-center gap-4 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-bold text-gray-800 truncate mb-0.5">{item.name}</h4>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight">{item.brand} • ₹{item.discountedPrice}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsClickCollectOpen(true)}
                        className="bg-[#ffcc00] text-black font-black text-[13px] px-5 py-3.5 rounded-xl uppercase tracking-tighter whitespace-nowrap shadow-md active:scale-95 transition-all overflow-hidden h-[46px] flex flex-col items-center justify-center relative min-w-[110px]"
                    >
                        <div className="relative w-full h-full flex flex-col items-center">
                            {CLICK_COLLECT_PHRASES.map((text, idx) => (
                                <span
                                    key={text}
                                    className={`absolute transition-all duration-700 ease-in-out flex items-center justify-center w-full px-2 ${idx === currentTextIndex
                                        ? 'top-0 opacity-100 blur-0 scale-100'
                                        : idx < currentTextIndex
                                            ? '-top-full opacity-0 blur-sm scale-90'
                                            : 'top-full opacity-0 blur-sm scale-90'
                                        }`}
                                >
                                    {text}
                                </span>
                            ))}
                        </div>
                    </button>
                </div>

                <div className="hidden md:flex flex-col">
                    <div className="flex items-center justify-between px-6 py-2">
                        <Link to="/" className="no-underline">
                            <h1 className={`text-[28px] font-extrabold tracking-widest drop-shadow-sm transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-white'}`}>Clothify</h1>
                        </Link>

                        <div className="flex items-center gap-8">
                            <div
                                className={`flex items-center gap-2 text-[13px] font-black uppercase tracking-widest cursor-pointer transition-colors py-1 group ${isScrolled ? 'text-gray-800 hover:text-black' : 'text-white/90 hover:text-white'}`}
                                onMouseEnter={() => setIsMegaMenuOpen(true)}
                            >
                                <LayoutGrid size={18} className="text-[#39ff14] group-hover:scale-110 transition-transform" />
                                Categories
                            </div>
                            <div
                                onClick={() => setIsDiscoverOpen(true)}
                                className={`flex items-center gap-2 text-[13px] font-black uppercase tracking-widest cursor-pointer transition-colors ${isScrolled ? 'text-gray-800 hover:text-black' : 'text-white/90 hover:text-white'}`}
                            >
                                <Compass size={18} className="text-pink-400 animate-spin-slow" />
                                Discover
                            </div>
                            <Link to="/wishlist" className={`relative flex items-center gap-2 text-[13px] font-black uppercase tracking-widest no-underline transition-colors ${isScrolled ? 'text-gray-800 hover:text-black' : 'text-white/90 hover:text-white'}`}>
                                <Heart size={18} className="text-red-400" />
                                Wishlist
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>
                            <Link to="/cart" className={`relative transition-colors ${isScrolled ? 'text-black hover:text-[#39ff14]' : 'text-white hover:text-[#39ff14]'}`}>
                                <ShoppingBag size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#39ff14] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                to={user ? "/profile" : "/login"}
                                className={`transition-colors flex flex-col items-center group relative ${isScrolled ? 'text-black hover:text-[#39ff14]' : 'text-white hover:text-[#39ff14]'}`}
                            >
                                <User size={22} className={user ? 'text-[#39ff14]' : ''} />
                                {!user && (
                                    <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all ${isScrolled ? 'text-gray-400 group-hover:text-black' : 'text-white/50 group-hover:text-white'}`}>
                                        Login
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mega Menu Dropdown */}
                    <MegaMenu
                        isOpen={isMegaMenuOpen}
                        onClose={() => setIsMegaMenuOpen(false)}
                    />
                </div>
            </div>

            {/* Backdrop Overlay for Mega Menu */}
            <div
                className={`fixed inset-0 bg-[#0a192f]/80 backdrop-blur-[6px] transition-all duration-500 z-[40] ${isMegaMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={() => setIsMegaMenuOpen(false)}
            />

            {/* Premium Category Tabs - Dynamic Background - Conditional Rendering */}
            {showCategories && (
                <div
                    className="relative z-[30] transition-colors duration-500 ease-in-out border-t border-white/10"
                    style={{ backgroundColor: currentBgColor }}
                >
                    <div className="flex overflow-x-auto scrollbar-hide gap-1 md:gap-3 px-3 md:px-6 pt-1.5 pb-0 items-end scroll-smooth snap-x snap-mandatory">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className="flex flex-col items-center shrink-0 w-24 md:w-32 snap-center outline-none mx-1 group pt-2 pb-4"
                                onClick={() => setActiveCategory(cat.name)}
                            >
                                {/* Outer Circle (The Background Highlight) */}
                                <div
                                    className={`flex items-center justify-center rounded-full transition-all duration-500 ${activeCategory === cat.name
                                        ? 'w-20 h-20 md:w-24 md:h-24 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] scale-110'
                                        : 'w-16 h-16 md:w-20 md:h-20 bg-transparent group-hover:bg-white/10'
                                        }`}
                                >
                                    {/* Inner Image Circle with Pading gap */}
                                    <div
                                        className={`rounded-full overflow-hidden transition-all duration-500 ${activeCategory === cat.name
                                            ? 'w-16 h-16 md:w-20 md:h-20 border-2 border-gray-50 shadow-sm'
                                            : 'w-14 h-14 md:w-18 md:h-18 border border-white/30'
                                            }`}
                                    >
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                                {/* Category Text - Just below the outer circle */}
                                <span
                                    className={`mt-4 text-[10px] md:text-[11px] font-black text-center transition-all duration-500 uppercase tracking-widest ${activeCategory === cat.name
                                        ? 'text-white scale-110 drop-shadow-md'
                                        : 'text-white/60 group-hover:text-white'
                                        }`}
                                >
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 h-[100dvh] w-full bg-[#ffffff] !opacity-100 z-[99999] transition-all duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden flex flex-col`}>
                {/* Header of Menu */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                            <ShoppingBag size={20} className="text-[#ffcc00]" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tight leading-none">Menu</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">Browse Categories</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
                    >
                        <X size={24} strokeWidth={3} className="text-black" />
                    </button>
                </div>

                {/* Categories List */}
                <div className="flex-1 overflow-y-auto bg-white py-2 px-4 shadow-inner">
                    <div className="space-y-1 pb-10">
                        {categories.map((cat) => (
                            <div key={cat.id} className="group">
                                <button
                                    className="w-full flex items-center gap-3 py-3 px-1 active:bg-gray-50 rounded-xl transition-all duration-200 text-left outline-none"
                                    onClick={() => {
                                        setActiveCategory(cat.name);
                                        navigate('/shop');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm transition-transform active:scale-95">
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-black text-gray-900 text-[13px] uppercase tracking-tight block leading-none mb-1">
                                            {cat.name}
                                        </span>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block opacity-70">
                                            {cat.sections?.length || 0} Sets
                                        </span>
                                    </div>
                                    <ChevronRight className="text-gray-300" size={14} />
                                </button>

                                {/* Drill-down Sections (Optional visibility on click) */}
                                <div className="ml-[60px] flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mt-1 pr-4">
                                    {(cat.sections || []).map(section => (
                                        <span
                                            key={section.title}
                                            className="whitespace-nowrap text-[8px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md active:bg-black active:text-white transition-colors"
                                        >
                                            {section.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Access Section */}
                    <div className="mt-10 mb-20 space-y-4">
                        <div className="h-[1px] bg-gray-100 w-full mb-8" />
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">My Account</h4>
                        <Link
                            to="/orders"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-[24px] group hover:bg-black transition-all"
                        >
                            <span className="font-black text-[11px] uppercase tracking-widest text-black group-hover:text-white transition-colors">Order History</span>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                                <ChevronRight size={14} className="text-black" />
                            </div>
                        </Link>
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-3 w-full py-5 bg-black text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-xl"
                        >
                            Login / Create Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Discover Modal */}
            <DiscoverModal
                isOpen={isDiscoverOpen}
                onClose={() => setIsDiscoverOpen(false)}
            />

            {/* Click Collect Modal */}
            <TryAndBuyModal
                isOpen={isClickCollectOpen}
                onClose={() => setIsClickCollectOpen(false)}
            />
            {/* Cart Toast Notification */}
            {lastAddedItem && (
                <div className="fixed top-24 right-4 z-[5000] bg-black text-white px-6 py-4 rounded-[20px] shadow-2xl animate-fadeInRight flex items-center gap-4 min-w-[300px] border border-white/10">
                    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-white/20">
                        <img src={lastAddedItem.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#39ff14] mb-1">Added to Bag</p>
                        <h4 className="text-[13px] font-bold truncate max-w-[180px] mb-1">{lastAddedItem.name}</h4>
                        <Link to="/cart" className="text-[11px] font-black uppercase text-[#ffcc00] hover:underline transition-all">View Bag</Link>
                    </div>
                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X size={16} />
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
