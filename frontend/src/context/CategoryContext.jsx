import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const categoryColors = {
    'For You': '#e91e63',
    'Women': '#ff4081',
    'Men': '#2196f3',
    'Beauty': '#9c27b0',
    'Accessories': '#4caf50',
    'Footwear': '#ff9800',
    'Home': '#795548'
};

export const CategoryProvider = ({ children }) => {
    const [activeCategory, setActiveCategory] = useState('For You');

    const getCategoryColor = (name) => {
        return categoryColors[name] || categoryColors['For You'];
    };

    return (
        <CategoryContext.Provider value={{
            activeCategory,
            setActiveCategory,
            getCategoryColor,
            categoryColors
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};
