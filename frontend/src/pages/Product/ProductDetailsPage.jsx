import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Heart,
    ShoppingBag,
    Star,
    Share2,
    ChevronLeft,
    ShieldCheck,
    Truck,
    RotateCcw,
    Check,
    ChevronDown,
    ChevronUp,
    Info
} from 'lucide-react';
import { products } from '../../data';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeImg, setActiveImg] = useState(0);
    const [openAccordion, setOpenAccordion] = useState('description');

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            navigate('/products');
        }
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const handleAddToCart = () => {
        if (!selectedSize) {
            // Shake effect or toast would be better
            alert('Please select a size first');
            return;
        }
        addToCart({ ...product, selectedSize });
        // Navigate to cart or show success
    };

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    // Mock images for demonstration
    const productImages = [
        product.image,
        "https://images.unsplash.com/photo-1515347648310-859a85233170?w=800&fit=crop",
        "https://images.unsplash.com/photo-1539109132314-34a77ae7012b?w=800&fit=crop",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&fit=crop"
    ];

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    return (
        <div className="bg-[#fafafa] min-h-screen pb-20">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest truncate max-w-[200px]">{product.brand}</h1>
                <div className="flex items-center gap-4">
                    <Share2 size={20} />
                    <ShoppingBag size={20} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 md:py-6">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                    {/* Left: Image Gallery */}
                    <div className="flex-1 lg:flex-[0.8] flex flex-col md:flex-row gap-4">
                        {/* Thumbnails - Desktop */}
                        <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
                            {productImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImg(idx)}
                                    className={`aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${activeImg === idx ? 'border-black shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 relative aspect-[3/4] lg:aspect-auto lg:h-[580px] rounded-[32px] md:rounded-[40px] overflow-hidden bg-white shadow-2xl group">
                            <img src={productImages[activeImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                            {/* Tags/Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <div className="bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                    New Arrival
                                </div>
                                <div className="bg-[#ffcc00] text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                    Top Rated
                                </div>
                            </div>

                            {/* Wishlist Mobile */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl md:hidden"
                            >
                                <Heart size={24} className={isInWishlist(product?.id) ? 'fill-red-500 text-red-500' : 'text-black'} />
                            </button>

                            {/* Rating Badge */}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                                <div className="flex items-center gap-1">
                                    <span className="text-[15px] font-black">4.5</span>
                                    <Star size={14} className="fill-black" />
                                </div>
                                <div className="w-[1px] h-3 bg-gray-300" />
                                <span className="text-[13px] font-bold text-gray-500">1.2k Reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex-1 max-w-xl">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-1.5">
                                <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em]">{product.brand}</h2>
                                <div className="hidden md:flex items-center gap-4">
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Share2 size={20} /></button>
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <Heart size={22} className={isInWishlist(product?.id) ? 'fill-red-500 text-red-500 border-none' : 'text-black'} />
                                    </button>
                                </div>
                            </div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-black leading-tight mb-4 uppercase tracking-tight">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-3xl font-black text-black">₹{product.discountedPrice}</span>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                                        <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                                            {product.discount} OFF
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider italic">inclusive of all taxes</p>
                                </div>
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-5">
                                <h3 className="text-[12px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                                    Select Size <Info size={14} className="text-gray-400" />
                                </h3>
                                <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600 pb-0.5">Size Chart</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[56px] h-14 md:min-w-[64px] rounded-2xl flex items-center justify-center font-black text-[15px] transition-all relative ${selectedSize === size
                                            ? 'bg-black text-white shadow-xl scale-110'
                                            : 'bg-white border-2 border-gray-100 text-gray-800 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                        {selectedSize === size && (
                                            <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 border-2 border-white">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {selectedSize && (
                                <p className="mt-4 text-[13px] font-bold text-emerald-600 flex items-center gap-2 animate-fadeIn">
                                    <ShieldCheck size={16} /> Fast shipping available for size {selectedSize}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className="flex-[3] h-16 bg-black text-white rounded-[20px] font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-[#1a1a1a]"
                            >
                                <ShoppingBag size={20} />
                                Add to Bag
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`flex-1 h-16 rounded-[20px] font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${isInWishlist(product?.id)
                                    ? 'bg-red-50 border-red-100 text-red-500'
                                    : 'bg-white border-gray-100 text-gray-800 hover:border-black'
                                    }`}
                            >
                                <Heart size={20} className={isInWishlist(product?.id) ? 'fill-red-500' : ''} />
                                <span className="hidden md:inline">Wishlist</span>
                            </button>
                        </div>

                        {/* USP Features */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                                <Truck className="text-gray-400 shrink-0" size={24} />
                                <div>
                                    <h4 className="text-[12px] font-black uppercase tracking-tight">Free Delivery</h4>
                                    <p className="text-[10px] font-bold text-gray-500">On all orders above ₹999</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                                <RotateCcw className="text-gray-400 shrink-0" size={24} />
                                <div>
                                    <h4 className="text-[12px] font-black uppercase tracking-tight">Easy Returns</h4>
                                    <p className="text-[10px] font-bold text-gray-500">14 days exchange policy</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Accordion */}
                        <div className="space-y-1">
                            {[
                                {
                                    id: 'description', title: 'Product Details', content: (
                                        <div className="space-y-4">
                                            <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                                                This premium piece from {product.brand} showcases exceptional craftsmanship and timeless style.
                                                Designed for the modern individual who values both comfort and aesthetics.
                                            </p>
                                            <ul className="grid grid-cols-2 gap-y-3 gap-x-6">
                                                {['Cotton Blend', 'Regular Fit', 'Machine Washable', 'Breathable Fabric', 'Eco-friendly', 'Premium Quality'].map(item => (
                                                    <li key={item} className="flex items-center gap-2 text-[13px] font-bold text-gray-500">
                                                        <div className="w-1 h-1 bg-black rounded-full" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                },
                                {
                                    id: 'specifications', title: 'Specifications', content: (
                                        <div className="grid grid-cols-2 gap-y-4">
                                            <div>
                                                <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Occasion</h5>
                                                <p className="text-[14px] font-bold">Casual / Streetwear</p>
                                            </div>
                                            <div>
                                                <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Pattern</h5>
                                                <p className="text-[14px] font-bold">Solid / Graphic</p>
                                            </div>
                                            <div>
                                                <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Fabric Type</h5>
                                                <p className="text-[14px] font-bold">Woven</p>
                                            </div>
                                            <div>
                                                <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Country of Origin</h5>
                                                <p className="text-[14px] font-bold">India</p>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    id: 'shipping', title: 'Shipping & Returns', content: (
                                        <div className="space-y-4 text-[13px] font-middle text-gray-600 leading-relaxed">
                                            <p>Estimated delivery within 3-5 business days. Express shipping available at checkout.</p>
                                            <p>You can return or exchange this item within 14 days of delivery. The item must be unused with all original tags intact.</p>
                                        </div>
                                    )
                                }
                            ].map(section => (
                                <div key={section.id} className="border-b border-gray-100">
                                    <button
                                        onClick={() => toggleAccordion(section.id)}
                                        className="w-full flex items-center justify-between py-6 text-[14px] font-black uppercase tracking-widest"
                                    >
                                        {section.title}
                                        {openAccordion === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === section.id ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions - Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white px-4 py-3 border-t border-gray-100 z-50 flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${isInWishlist(product?.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100'
                        }`}
                >
                    <Heart size={24} className={isInWishlist(product?.id) ? 'fill-red-500' : ''} />
                </button>
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white rounded-2xl font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                    <ShoppingBag size={20} />
                    Add to Bag
                </button>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
