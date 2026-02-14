import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../../data';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Filter, X, ChevronDown, ChevronUp, Star, Eye, ShoppingBag, Search, ArrowLeft, Heart, Share2, Check } from 'lucide-react';

const ProductsPage = () => {
    const { toggleWishlist, isInWishlist, wishlistItems } = useWishlist();
    const { addToCart } = useCart();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);

    // Active Filters State
    const [activeFilterTab, setActiveFilterTab] = useState('Brand');
    const [searchValue, setSearchValue] = useState(''); // Brand search in drawer
    const [headerSearchValue, setHeaderSearchValue] = useState(searchParams.get('search') || ''); // Main grid search
    const [selectedSort, setSelectedSort] = useState('New Arrivals');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    // Desktop Section states
    const [openSections, setOpenSections] = useState({
        brand: true,
        subCategory: true,
        productType: true,
        trend: false,
        size: false,
        fit: false,
        fabric: false,
        pattern: false,
        closureType: false,
        originCountry: false,
        gender: false,
        colorFamily: false,
        color: false
    });

    const division = searchParams.get('division');
    const category = searchParams.get('category');
    const subCategoryFromUrl = searchParams.get('subCategory') || searchParams.get('subcategory');
    const brandFromUrl = searchParams.get('brand');

    useEffect(() => {
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setHeaderSearchValue(searchFromUrl);
            setIsHeaderSearchOpen(true);
        }
        if (brandFromUrl) {
            setSelectedBrands([brandFromUrl]);
        }
    }, [searchParams, brandFromUrl]);

    // Mock unique values for filters
    const filterCategories = [
        'Brand', 'Sub Category', 'Product Type', 'Trend', 'Trend Type', 'Size', 'Fit', 'Fabric', 'Pattern', 'Closure Type', 'Neck Type', 'Rise Type', 'Length'
    ];

    const brands = [...new Set(products.map(p => p.brand))].sort();
    const subCategories = [...new Set(products.map(p => p.subCategory))];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Derived filtered products
    const filteredProducts = React.useMemo(() => {
        let result = [...products];

        // 1. Gender Filter (Manual override)
        if (selectedGender !== 'All') {
            result = result.filter(p => p.division.toLowerCase() === selectedGender.toLowerCase());
        }

        // 2. URL Params Filter (Only if no manual override)
        if (selectedGender === 'All') {
            if (division) {
                result = result.filter(p => p.division.toLowerCase() === division.toLowerCase());
            }
            if (category) {
                result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
            }
        }

        if (subCategoryFromUrl) {
            result = result.filter(p => p.subCategory.toLowerCase() === subCategoryFromUrl.toLowerCase());
        }

        // 4. Header Search Filter
        if (headerSearchValue) {
            const query = headerSearchValue.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.subCategory.toLowerCase().includes(query)
            );
        }

        // 5. Brand Filter
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }

        // 6. Sorting Logic
        switch (selectedSort) {
            case 'Price: Low to High':
                result.sort((a, b) => a.discountedPrice - b.discountedPrice);
                break;
            case 'Price: High to Low':
                result.sort((a, b) => b.discountedPrice - a.discountedPrice);
                break;
            case 'Discount':
                result.sort((a, b) => {
                    const getDisc = (s) => parseInt(s.split('%')[0]) || 0;
                    return getDisc(b.discount) - getDisc(a.discount);
                });
                break;
            default:
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [headerSearchValue, selectedGender, selectedSort, selectedBrands, division, category]);

    const handleSelectBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const clearFilters = () => {
        setSelectedBrands([]);
        setSelectedSizes([]);
        setSelectedGender('All');
        setHeaderSearchValue('');
    };

    const FilterSection = ({ title, id, children }) => (
        <div className="border-b border-gray-100 py-4">
            <button
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between text-[14px] font-black uppercase tracking-wider text-gray-900 mb-2"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl font-medium">{openSections[id] ? '-' : '+'}</span>
                    {title}
                </div>
                {selectedBrands.length > 0 && id === 'brand' && (
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                )}
            </button>
            {openSections[id] && (
                <div className="mt-3 space-y-2.5 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20 md:pb-0">
            {/* Top Scroller - Mobile Only */}
            <div className="md:hidden sticky top-0 bg-white z-40 border-b border-gray-100">
                <div className="flex items-center gap-4 px-4 py-3">
                    <button className="p-2 -ml-2 rounded-full hover:bg-gray-100" onClick={() => window.history.back()}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        {isHeaderSearchOpen ? (
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search products..."
                                className="w-full text-sm font-bold border-none outline-none py-1"
                                value={headerSearchValue}
                                onChange={(e) => setHeaderSearchValue(e.target.value)}
                            />
                        ) : (
                            <>
                                <h1 className="text-base font-black truncate leading-tight uppercase tracking-tight">{selectedBrands[0] || subCategoryFromUrl || category}</h1>
                                <p className="text-[11px] font-bold text-gray-400">{filteredProducts.length} Items</p>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Search
                            size={20}
                            onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                        />
                        <Link to="/wishlist" className="relative transition-colors">
                            <Heart size={20} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Desktop Product Info */}
                <div className="hidden md:block mb-8">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Home <span className="scale-75">›</span> {selectedBrands[0] || division} <span className="scale-75">›</span> {category}
                    </div>
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-2xl font-black uppercase tracking-tight">{selectedBrands[0] || subCategoryFromUrl || category}</h1>
                            <span className="text-gray-400 font-bold text-sm italic">{filteredProducts.length} items</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-widest cursor-pointer hover:border-black transition-all">
                                    Sort By <ChevronDown size={14} />
                                </div>
                                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    {['Price: Low to High', 'Price: High to Low', 'Discount', 'Popularity', 'New Arrivals'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedSort(option)}
                                            className={`w-full text-left px-6 py-3 text-[12px] font-bold hover:bg-gray-50 transition-colors ${selectedSort === option ? 'text-black bg-gray-50' : 'text-gray-500'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedBrands.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4 animate-fadeIn">
                            {selectedBrands.map(brand => (
                                <div key={brand} className="flex items-center gap-3 bg-white border border-gray-200 pl-4 pr-3 py-2 rounded-lg text-[13px] font-black uppercase tracking-tight shadow-sm">
                                    {brand}
                                    <div
                                        onClick={() => handleSelectBrand(brand)}
                                        className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={12} className="text-gray-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-12">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-[260px] shrink-0">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-lg font-black flex items-center gap-3">
                                    <Filter size={18} /> FILTERS
                                </h2>
                                <button onClick={clearFilters} className="text-[12px] font-black text-red-600 uppercase tracking-tighter hover:underline">
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin">
                                <FilterSection title="Brand" id="brand">
                                    <div className="space-y-4 pt-2">
                                        {brands.map(brand => (
                                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => handleSelectBrand(brand)}
                                                />
                                                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? 'bg-black border-black shadow-lg scale-110' : 'border-gray-300 group-hover:border-black'
                                                    }`}>
                                                    {selectedBrands.includes(brand) && <Check size={10} className="text-white" strokeWidth={4} />}
                                                </div>
                                                <span className={`text-[13px] font-bold transition-colors ${selectedBrands.includes(brand) ? 'text-black' : 'text-gray-500 group-hover:text-black'
                                                    }`}>{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FilterSection>

                                <FilterSection title="Sub Category" id="subCategory">
                                    <div className="space-y-3 pt-2">
                                        {subCategories.map(sub => (
                                            <div key={sub} className="text-[13px] font-bold text-gray-500 hover:text-black cursor-pointer">{sub}</div>
                                        ))}
                                    </div>
                                </FilterSection>

                                <FilterSection title="Product Type" id="productType" />
                                <FilterSection title="Trend" id="trend" />
                                <FilterSection title="Size" id="size">
                                    <div className="grid grid-cols-3 gap-2">
                                        {sizes.map(size => (
                                            <button key={size} className="border border-gray-200 py-2 text-[12px] font-black rounded-lg hover:border-black hover:bg-black hover:text-white transition-all">
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </FilterSection>
                                <FilterSection title="Fit" id="fit" />
                                <FilterSection title="Fabric" id="fabric" />
                                <FilterSection title="Pattern" id="pattern" />
                                <FilterSection title="Closure Type" id="closureType" />
                                <FilterSection title="Gender" id="gender" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group cursor-pointer flex flex-col"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="relative aspect-[3/4] rounded-[24px] md:rounded-[32px] overflow-hidden mb-4 bg-gray-50 shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />

                                        {/* Click Collect Connect Banner */}
                                        {product.tryAndBuy && (
                                            <div className="absolute bottom-0 left-0 w-full">
                                                <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-black px-4 py-2 flex items-center justify-center uppercase tracking-[0.15em]">
                                                    Click Connect Collect
                                                </div>
                                            </div>
                                        )}

                                        {/* Icons */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart({ ...product, selectedSize: product.size ? product.size[0] : 'M' });
                                                }}
                                                className="w-10 h-10 bg-white/90 backdrop-blur-md text-black rounded-xl flex items-center justify-center shadow-lg hover:bg-[#ffcc00] hover:scale-110 transition-all"
                                            >
                                                <ShoppingBag size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWishlist(product);
                                                }}
                                                className={`w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-90 ${isInWishlist(product.id) ? 'bg-[#ffcc00] text-black' : 'text-black hover:bg-[#ffcc00]'}`}
                                            >
                                                <Heart size={18} className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-1">
                                        <div className="text-[12px] font-black text-gray-400 uppercase tracking-tight mb-0.5">{product.brand}</div>
                                        <h3 className="text-[14px] font-bold text-gray-800 leading-tight line-clamp-1 mb-2 group-hover:text-black transition-colors">{product.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[15px] font-black text-black">₹{product.discountedPrice}</span>
                                            <span className="text-[12px] font-bold text-gray-400 line-through">₹{product.originalPrice}</span>
                                            <span className="text-[11px] font-black text-[#00a278] bg-[#00a278]/5 px-2 py-0.5 rounded-full">
                                                {product.discount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-24 text-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={40} className="text-gray-200" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">No products match your filters</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-8 px-10 py-4 bg-black text-white text-[12px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-xl"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 flex h-16 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                <button
                    onClick={() => setIsGenderOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 text-[13px] font-black uppercase tracking-wider border-r border-gray-100"
                >
                    Gender
                </button>
                <button
                    onClick={() => setIsSortOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 text-[13px] font-black uppercase tracking-wider border-r border-gray-100"
                >
                    Sort
                </button>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 text-[13px] font-black uppercase tracking-wider"
                >
                    Filter
                </button>
            </div>
        </div >
    );
};

export default ProductsPage;
