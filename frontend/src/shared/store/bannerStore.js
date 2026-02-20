import { create } from 'zustand';

const initialBanners = [
    {
        id: 1,
        title: 'Summer Sale',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
        link: '/offers',
        order: 1,
        status: 'active',
        subtitle: 'Get your fit delivered in under 60mins',
        cta: 'Shop Now'
    },
    {
        id: 2,
        title: 'New Arrivals',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
        link: '/products',
        order: 2,
        status: 'active',
        subtitle: 'Elevate your drip with the latest trends',
        cta: 'Discover More'
    }
];

export const useBannerStore = create((set, get) => ({
    banners: [],
    isLoading: false,

    initialize: () => {
        const savedBanners = localStorage.getItem('admin-banners');
        if (savedBanners) {
            set({ banners: JSON.parse(savedBanners) });
        } else {
            set({ banners: initialBanners });
            localStorage.setItem('admin-banners', JSON.stringify(initialBanners));
        }
    },

    setBanners: (banners) => {
        const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
        set({ banners: sortedBanners });
        localStorage.setItem('admin-banners', JSON.stringify(sortedBanners));
    },

    deleteBanner: (id) => {
        set((state) => {
            const updated = state.banners.filter((b) => b.id !== id);
            localStorage.setItem('admin-banners', JSON.stringify(updated));
            return { banners: updated };
        });
    },

    toggleBannerStatus: (id) => {
        set((state) => {
            const updated = state.banners.map((b) =>
                b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
            );
            localStorage.setItem('admin-banners', JSON.stringify(updated));
            return { banners: updated };
        });
    },

    updateBanner: (id, bannerData) => {
        set((state) => {
            const updated = state.banners.map((b) =>
                b.id === id ? { ...b, ...bannerData } : b
            );
            const sorted = [...updated].sort((a, b) => a.order - b.order);
            localStorage.setItem('admin-banners', JSON.stringify(sorted));
            return { banners: sorted };
        });
    },

    addBanner: (bannerData) => {
        set((state) => {
            const newBanner = {
                ...bannerData,
                id: state.banners.length > 0 ? Math.max(...state.banners.map(b => b.id)) + 1 : 1,
            };
            const updated = [...state.banners, newBanner].sort((a, b) => a.order - b.order);
            localStorage.setItem('admin-banners', JSON.stringify(updated));
            return { banners: updated };
        });
    }
}));
