import { create } from 'zustand';

const initialBanners = [
    { id: 1, title: 'Big Summer Sale', type: 'hero', isActive: true, order: 1, image: 'https://placehold.co/1200x400?text=Summer+Sale' },
    { id: 2, title: 'New Winter Collection', type: 'hero', isActive: true, order: 2, image: 'https://placehold.co/1200x400?text=Winter+Collection' },
    { id: 3, title: 'Buy 1 Get 1 Free', type: 'promotional', isActive: true, order: 3, image: 'https://placehold.co/800x200?text=B1G1+Offer' }
];

export const useBannerStore = create((set) => ({
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
                b.id === id ? { ...b, isActive: !b.isActive } : b
            );
            localStorage.setItem('admin-banners', JSON.stringify(updated));
            return { banners: updated };
        });
    },

    reorderBanners: (ids) => {
        set((state) => {
            const updated = ids.map((id, index) => {
                const banner = state.banners.find(b => b.id === id);
                return { ...banner, order: index + 1 };
            });
            localStorage.setItem('admin-banners', JSON.stringify(updated));
            return { banners: updated };
        });
    }
}));
