import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ ...product, selectedSize: product.size ? product.size[0] : 'M' });
    };

    return (
        <div className="group relative">
            <Link
                to={`/product/${product.id}`}
                className="flex flex-col bg-white rounded-md overflow-hidden transition-all duration-300 cursor-pointer no-underline text-inherit border border-gray-50 hover:border-black/5"
            >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#fafafa]">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Micro Wishlist Button */}
                    <button
                        className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-white/90 shadow-sm active:scale-90 ${isInWishlist(product.id) ? 'text-red-500' : 'text-black opacity-60'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                    >
                        <Heart size={12} className={isInWishlist(product.id) ? 'fill-red-500' : ''} />
                    </button>
                </div>

                <div className="p-2 pb-3 bg-white">
                    <h3 className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1 truncate">
                        {product.brand}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2 mb-2">
                        {product.name}
                    </p>
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[13px] font-black text-black">₹{product.discountedPrice}</span>
                            <span className="text-[10px] text-gray-400 line-through font-bold">₹{product.originalPrice}</span>
                        </div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter block mt-0.5">{product.discount}</span>
                    </div>
                </div>
            </Link>

            {/* Micro Quick Add - Bottom Right */}
            <button
                className="absolute bottom-[85px] right-2 w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 md:group-hover:opacity-100 transition-all active:scale-90 z-20"
                onClick={handleAddToCart}
            >
                <Plus size={16} strokeWidth={4} />
            </button>
        </div>
    );
};

export default ProductCard;
