import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems((prev) => {
            const isExist = prev.find((item) => item.id === product.id);
            if (isExist) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        setWishlistItems((prev) => {
            const isExist = prev.find((item) => item.id === product.id);
            if (isExist) {
                return prev.filter((item) => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
