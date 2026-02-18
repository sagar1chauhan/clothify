import React from 'react';
import { bannerCategories, secondaryBannerCategories } from '../../data';
import { useCategoryStore } from '../../../../shared/store/categoryStore';

const CategoryBanners = () => {
    const { categories, initialize } = useCategoryStore();

    React.useEffect(() => {
        initialize();
    }, []);

    // Filter active categories
    const activeCategories = categories.filter(c => c.isActive);

    return (
        <div className="py-5 md:py-10">
            <div className="container">
                {/* Dynamic Categories Row */}
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-8 mb-10 md:mb-15 max-sm:flex max-sm:overflow-x-auto max-sm:gap-4 max-sm:pb-3 max-sm:scrollbar-hide">
                    {activeCategories.map((category) => (
                        <div key={category.id} className="flex flex-col items-center cursor-pointer transition-all group max-sm:min-w-[120px] max-sm:shrink-0">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm bg-gray-100">
                                <img
                                    src={category.image || 'https://placehold.co/150?text=' + category.name}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.target.src = 'https://placehold.co/150?text=' + category.name }}
                                />
                            </div>
                            <p className="text-sm md:text-base font-bold text-center text-text-primary">{category.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBanners;
