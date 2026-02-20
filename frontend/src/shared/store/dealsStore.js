import { create } from 'zustand';

const initialDeals = [
    { id: 1, name: 'Denims', promo: 'MIN 25% OFF', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop', bg: 'bg-[#f8f8f8]', status: 'active', order: 1 },
    { id: 2, name: 'T-Shirts', promo: 'STARTS ₹299', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', bg: 'bg-[#fff0f3]', status: 'active', order: 2 },
    { id: 3, name: 'Ethnic Dresses', promo: 'UPTO 80% OFF', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop', bg: 'bg-[#fff9eb]', status: 'active', order: 3 },
    { id: 4, name: 'Footwear', promo: 'UPTO 60% OFF', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop', bg: 'bg-[#f0f9ff]', status: 'active', order: 4 },
    { id: 5, name: 'Accessories', promo: 'UPTO 85% OFF', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', bg: 'bg-[#fdf2ff]', status: 'active', order: 5 },
];

export const useDealsStore = create((set, get) => ({
    deals: [],
    isLoading: false,

    initialize: () => {
        const savedDeals = localStorage.getItem('admin-daily-deals');

        if (!savedDeals) {
            // First time ever: set initial deals
            set({ deals: initialDeals });
            localStorage.setItem('admin-daily-deals', JSON.stringify(initialDeals));
        } else {
            const parsedDeals = JSON.parse(savedDeals);
            // Only force reset if the data structure is totally broken (old version)
            const isOldVersion = parsedDeals.length > 0 && !parsedDeals[0].hasOwnProperty('image');

            if (isOldVersion) {
                set({ deals: initialDeals });
                localStorage.setItem('admin-daily-deals', JSON.stringify(initialDeals));
            } else {
                // Auto-fix any deals with null status or bg (caused by previous bug)
                let needsFix = false;
                const fixedDeals = parsedDeals.map(deal => {
                    const updated = { ...deal };
                    if (!deal.status) { updated.status = 'active'; needsFix = true; }
                    if (!deal.bg) { updated.bg = 'bg-[#f8f8f8]'; needsFix = true; }
                    return updated;
                });

                if (needsFix) {
                    localStorage.setItem('admin-daily-deals', JSON.stringify(fixedDeals));
                    set({ deals: fixedDeals });
                } else {
                    set({ deals: parsedDeals });
                }
            }
        }

        // Add cross-tab sync
        window.addEventListener('storage', (e) => {
            if (e.key === 'admin-daily-deals') {
                const updated = e.newValue ? JSON.parse(e.newValue) : [];
                set({ deals: updated });
            }
        });
    },

    addDeal: (dealData) => {
        set((state) => {
            const newDeal = {
                ...dealData,
                id: state.deals.length > 0 ? Math.max(...state.deals.map(d => d.id)) + 1 : 1,
            };
            const updated = [...state.deals, newDeal].sort((a, b) => a.order - b.order);
            localStorage.setItem('admin-daily-deals', JSON.stringify(updated));
            return { deals: updated };
        });
    },

    updateDeal: (id, dealData) => {
        set((state) => {
            const updated = state.deals.map((d) =>
                d.id === id ? { ...d, ...dealData } : d
            );
            const sorted = [...updated].sort((a, b) => a.order - b.order);
            localStorage.setItem('admin-daily-deals', JSON.stringify(sorted));
            return { deals: sorted };
        });
    },

    deleteDeal: (id) => {
        set((state) => {
            const updated = state.deals.filter((d) => d.id !== id);
            localStorage.setItem('admin-daily-deals', JSON.stringify(updated));
            return { deals: updated };
        });
    },

    toggleDealStatus: (id) => {
        set((state) => {
            const updated = state.deals.map((d) =>
                d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
            );
            localStorage.setItem('admin-daily-deals', JSON.stringify(updated));
            return { deals: updated };
        });
    }
}));
