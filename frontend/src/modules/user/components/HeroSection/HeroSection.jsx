import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBannerStore } from '../../../../shared/store/bannerStore';

const HeroSection = () => {
    const navigate = useNavigate();
    const { banners, initialize } = useBannerStore();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        initialize();
    }, []);

    // Filter active banners
    const activeBanners = banners.filter(b => b.status === 'active');

    useEffect(() => {
        if (activeBanners.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [activeBanners.length]);

    if (activeBanners.length === 0) return null;

    return (
        <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden !p-0">
            <div className="w-full h-full relative">
                {activeBanners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute top-0 left-0 w-full h-full flex items-center transition-all duration-1000 ${index === currentSlide ? 'opacity-100 z-[1]' : 'opacity-0'
                            }`}
                    >
                        {/* Background with Ken Burns Effect */}
                        <div
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 ${index === currentSlide ? 'animate-ken-burns' : ''}`}
                            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})` }}
                        />

                        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 text-white animate-fadeInUp">
                            <div className="max-w-[750px]">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-[2px] bg-[#ffcc00]" />
                                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ffcc00]">Premium Collection</span>
                                </div>
                                <h2 className="font-display text-4xl md:text-6xl lg:text-[80px] font-black mb-6 uppercase tracking-tight leading-[0.9] drop-shadow-2xl">
                                    {banner.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 === 1 ? 'text-[#ffcc00]' : ''}>{word} </span>
                                    ))}
                                </h2>
                                <p className="text-sm md:text-xl mb-10 font-medium opacity-80 max-w-[500px] leading-relaxed border-l-2 border-[#ffcc00] pl-6 animate-fadeInRight delay-300">
                                    {banner.subtitle}
                                </p>
                                <div className="flex items-center gap-6 animate-fadeInUp delay-500">
                                    <button
                                        onClick={() => navigate(banner.link)}
                                        className="group bg-white text-black py-4 md:py-6 px-10 md:px-14 text-xs md:text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-[#ffcc00] rounded-r-full" />
                                        {banner.cta || 'Shop Now'}
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Indicators */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[2]">
                    {activeBanners.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1.5 transition-all duration-500 rounded-full ${index === currentSlide ? 'w-10 bg-[#ffcc00]' : 'w-4 bg-white/30'
                                }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSection;
