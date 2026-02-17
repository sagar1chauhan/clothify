import React from 'react';
import { categories } from '../../data';
import { useCategory } from '../../context/CategoryContext';
import { useNavigate } from 'react-router-dom';

const CategoryContent = () => {
    const { activeCategory } = useCategory();
    const navigate = useNavigate();

    // Find the current category data
    const currentCategoryData = categories.find(c => c.name === activeCategory);

    if (!currentCategoryData) return null;

    return (
        <div className="pb-20 bg-white min-h-screen">
            {currentCategoryData.sections?.map((section, index) => (
                <div key={index} className="px-4 pt-4">
                    {/* Section Title */}
                    <h3 className="text-[13px] font-bold text-gray-900 mb-3 capitalize">
                        {section.title}
                    </h3>

                    {/* Grid Layout - 4 columns to match the reference image (at least 3 carts) */}
                    <div className="grid grid-cols-4 gap-3 md:gap-4">
                        {section.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center group cursor-pointer"
                                onClick={() => navigate(`/products?category=${activeCategory}&subCategory=${item.name}`)}
                            >
                                {/* Image Container */}
                                <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow p-2 flex items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover mix-blend-multiply rounded-lg"
                                    />
                                </div>

                                {/* Item Name */}
                                <span className="text-[10px] font-bold text-gray-700 text-center leading-tight group-hover:text-black transition-colors px-1">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryContent;
