import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { History, ShieldCheck, RefreshCcw, Truck, ChevronLeft } from 'lucide-react';

const AccountLayout = ({ children, isMenuPage = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024); // lg breakpoint

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper to get page title based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('profile')) return 'My Profile';
        if (path.includes('orders')) return 'My Orders';
        if (path.includes('addresses')) return 'My Addresses';
        if (path.includes('offers')) return 'My Offers';
        if (path.includes('refer')) return 'Refer & Earn';
        if (path.includes('events')) return 'Events';
        return 'Account';
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-12">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-8">
                {/* Mobile Back Header */}
                {isMobile && !isMenuPage && (
                    <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => navigate('/account')}
                            className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center active:scale-95 transition-all"
                        >
                            <ChevronLeft size={20} strokeWidth={3} />
                        </button>
                        <h1 className="font-black text-xl uppercase tracking-tight">{getPageTitle()}</h1>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Hide sidebar on mobile detail pages */}
                    {(!isMobile || isMenuPage) && <ProfileSidebar />}

                    {/* Hide detail content on mobile account menu */}
                    {(!isMobile || !isMenuPage) && (
                        <main className="flex-1">
                            <div className="bg-white rounded-[32px] md:rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 min-h-[350px] md:min-h-[500px]">
                                {children}
                            </div>
                        </main>
                    )}
                </div>

                {/* Benefits Section - Hide on mobile detail pages to keep it clean */}
                {(!isMobile || isMenuPage) && (
                    <div className="mt-8 overflow-x-auto scrollbar-hide">
                        <div className="flex justify-between min-w-0 w-full border-t border-gray-100 pt-6 pb-6 lg:pb-8">
                            {[
                                { icon: <ShieldCheck size={20} />, label: 'Secure Payments' },
                                { icon: <History size={20} />, label: 'Genuine Product' },
                                { icon: <RefreshCcw size={20} />, label: 'Click Connect Collect' },
                                { icon: <Truck size={20} />, label: '7 Day Return' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1.5 px-2 flex-1">
                                    <div className="text-gray-400 group-hover:text-black transition-colors">{item.icon}</div>
                                    <span className="text-[11px] md:text-[12px] font-bold text-gray-500 text-center leading-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountLayout;
