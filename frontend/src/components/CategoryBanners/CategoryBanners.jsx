import React from 'react';
import { bannerCategories, secondaryBannerCategories } from '../../data';

const CategoryBanners = () => {
    return (
        <div className="py-5 md:py-10">
            <div className="container">
                {/* Primary Row */}
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-8 mb-10 md:mb-15 max-sm:flex max-sm:overflow-x-auto max-sm:gap-4 max-sm:pb-3 max-sm:scrollbar-hide">
                    {bannerCategories.map((banner) => (
                        <div key={banner.id} className="flex flex-col items-center cursor-pointer transition-all group max-sm:min-w-[120px] max-sm:shrink-0">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
                                <img src={banner.image} alt={banner.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <p className="text-sm md:text-base font-bold text-center text-text-primary">{banner.name}</p>
                        </div>
                    ))}
                </div>

                {/* Secondary Row - Circle */}
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-8 max-sm:flex max-sm:overflow-x-auto max-sm:gap-4 max-sm:pb-3 max-sm:scrollbar-hide">
                    {secondaryBannerCategories.map((banner) => (
                        <div key={banner.id} className="flex flex-col items-center cursor-pointer transition-all group max-sm:min-w-[90px] max-sm:shrink-0">
                            <div className="w-full aspect-square rounded-full overflow-hidden mb-4 shadow-sm">
                                <img src={banner.image} alt={banner.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <p className="text-xs md:text-sm font-semibold text-center text-text-secondary">{banner.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBanners;
