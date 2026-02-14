import React, { useState } from 'react';
import { categories, products } from '../../data';
import { useCategory } from '../../context/CategoryContext';
import { Sparkles, ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
    const { activeCategory, setActiveCategory } = useCategory();
    const navigate = useNavigate();

    // Find the currently selected top-level category (e.g., Women)
    const currentCategory = categories.find(cat => cat.name === activeCategory) || categories[0];
    const subCategories = currentCategory?.sections || [];

    const [activeSubCatId, setActiveSubCatId] = useState(subCategories[0]?.title || '');

    // Synchronize active sub-category when top category changes
    React.useEffect(() => {
        if (subCategories.length > 0) {
            setActiveSubCatId(subCategories[0].title);
        }
    }, [activeCategory, subCategories]);

    const activeSubCat = subCategories.find(sub => sub.title === activeSubCatId);

    const handleItemClick = (item) => {
        // Find a representative product for this specific item/sub-category
        // We prioritize exact subCategory match, then name inclusion
        const product = products.find(p =>
            p.subCategory.toLowerCase() === item.name.toLowerCase() ||
            p.name.toLowerCase().includes(item.name.toLowerCase())
        );

        if (product) {
            // If we found a matching product, go directly to its detail page
            navigate(`/product/${product.id}`);
        } else {
            // Fallback to PLP with filters if no specific mock product found
            navigate(`/products?category=${activeCategory}&subCategory=${activeSubCatId}&name=${encodeURIComponent(item.name)}`);
        }
    };

    return (
        <div className="flex bg-[#fafafa] h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] overflow-hidden">
            {/* Left Vertical Sidebar - Glassmorphism */}
            <aside className="w-[85px] md:w-[130px] flex flex-col overflow-y-auto scrollbar-hide border-r border-gray-200/50 relative z-10 glass-effect">
                <div className="flex-1 py-4">
                    {subCategories.map((sub, idx) => (
                        <button
                            key={sub.title}
                            onClick={() => setActiveSubCatId(sub.title)}
                            className={`relative w-full flex flex-col items-center gap-2.5 py-5 px-2 transition-all duration-500 outline-none group ${activeSubCatId === sub.title
                                ? 'bg-white/50 backdrop-blur-md'
                                : 'hover:bg-white/30'
                                }`}
                        >
                            {/* Active Indicator - Premium Glow */}
                            {activeSubCatId === sub.title && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#ffcc00] rounded-r-full shadow-[0_0_15px_#ffcc00] animate-pulse" />
                            )}

                            <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-[22px] overflow-hidden transition-all duration-700 ${activeSubCatId === sub.title
                                ? 'scale-110 shadow-xl ring-2 ring-[#ffcc00]/30 -translate-y-1'
                                : 'scale-90 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-100'
                                }`}>
                                <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                />
                                {activeSubCatId === sub.title && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                )}
                            </div>
                            <span className={`text-[9px] md:text-[11px] font-black text-center leading-none tracking-tight uppercase transition-all duration-500 max-w-full px-1 ${activeSubCatId === sub.title ? 'text-black translate-y-0.5' : 'text-gray-400'
                                }`}>
                                {sub.title}
                            </span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Right Content Area (Items Grid) */}
            <main className="flex-1 bg-white/30 overflow-y-auto p-5 md:p-8 pb-24 scroll-smooth">
                {activeSubCat ? (
                    <div className="max-w-[1000px] mx-auto animate-fadeInUp">
                        {/* Featured Header */}
                        <div className="mb-10 flex items-end justify-between border-b border-gray-100 pb-6">
                            <div>
                                <div className="flex items-center gap-2 text-[#ffcc00] mb-1">
                                    <Sparkles size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Discover</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-3">
                                    {activeSubCat.title}
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#ffcc00] mt-auto mb-2" />
                                </h2>
                            </div>
                            <div
                                onClick={() => navigate(`/products?category=${activeCategory}&subCategory=${activeSubCatId}`)}
                                className="hidden md:flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest cursor-pointer hover:text-black transition-colors group"
                            >
                                View Collection <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Staggered Masonry-ish Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                            {activeSubCat.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleItemClick(item)}
                                    className={`flex flex-col gap-4 animate-fadeInUp stagger-${(idx % 5) + 1} group cursor-pointer`}
                                >
                                    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-[#f0f0f0] premium-shadow group-hover:-translate-y-2 transition-all duration-700">
                                        <div className="w-full h-full">
                                            <img
                                                src={item.image || `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}&backgroundColor=f0f0f0&textColor=a0a0a0`}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>
                                        {/* Premium Wishlist Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle wishlist
                                            }}
                                            className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-md rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#ffcc00] hover:scale-110 active:scale-90 group-hover:translate-y-0 -translate-y-2"
                                        >
                                            <Heart size={14} className="text-black" />
                                        </button>

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                                        <div className="absolute bottom-5 left-0 w-full px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 z-20 text-center">
                                            <button className="w-[85%] mx-auto py-2.5 bg-white hover:bg-[#ffcc00] text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl active:scale-[0.98] transition-all duration-300">
                                                Explore Now
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-3 flex justify-between items-start">
                                        <div>
                                            <span className="text-[13px] md:text-[15px] font-black text-black leading-tight tracking-tight uppercase block group-hover:text-[#ffcc00] transition-colors mb-1">
                                                {item.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                New Collection
                                                <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                Premium
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                        <Sparkles size={48} className="opacity-20 translate-y-12 animate-bounce" />
                        <span className="text-sm font-black uppercase tracking-widest opacity-40">Choose your style</span>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ShopPage;
