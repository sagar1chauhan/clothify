import { create } from 'zustand';

// Helper to generate slug from name
export const generateSlug = (name, existingCampaigns = []) => {
    let slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

    // Check for duplicates
    let finalSlug = slug;
    let counter = 1;
    while (existingCampaigns.some(c => c.slug === finalSlug)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    return finalSlug;
};

export const useCampaignStore = create((set, get) => ({
    campaigns: [],
    isLoading: false,

    initialize: () => {
        const savedCampaigns = localStorage.getItem('admin-campaigns');
        if (savedCampaigns) {
            set({ campaigns: JSON.parse(savedCampaigns) });
        } else {
            // Initial empty state or some mock data if needed
            set({ campaigns: [] });
        }
    },

    createCampaign: (campaignData) => {
        const { campaigns } = get();
        const newCampaign = {
            ...campaignData,
            id: campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1,
            createdAt: new Date().toISOString()
        };
        const updated = [...campaigns, newCampaign];
        set({ campaigns: updated });
        localStorage.setItem('admin-campaigns', JSON.stringify(updated));
        return newCampaign;
    },

    updateCampaign: (id, campaignData) => {
        const { campaigns } = get();
        const updated = campaigns.map(c => c.id === id ? { ...c, ...campaignData, updatedAt: new Date().toISOString() } : c);
        set({ campaigns: updated });
        localStorage.setItem('admin-campaigns', JSON.stringify(updated));
        return updated.find(c => c.id === id);
    },

    deleteCampaign: (id) => {
        const { campaigns } = get();
        const updated = campaigns.filter(c => c.id !== id);
        set({ campaigns: updated });
        localStorage.setItem('admin-campaigns', JSON.stringify(updated));
    },

    getCampaignById: (id) => {
        return get().campaigns.find(c => c.id === id);
    },

    getCampaignsByType: (type) => {
        return get().campaigns.filter(c => c.type === type);
    }
}));
