import { create } from 'zustand';

const initialBrands = [
    { id: 1, name: 'Adidas', description: 'World famous sportswear', isActive: true, logo: '' },
    { id: 2, name: 'Nike', description: 'Just Do It', isActive: true, logo: '' },
    { id: 3, name: 'Puma', description: 'Forever Faster', isActive: true, logo: '' },
    { id: 4, name: 'Levi\'s', description: 'Classic Denim', isActive: true, logo: '' }
];

export const useBrandStore = create((set) => ({
    brands: [],
    isLoading: false,

    initialize: () => {
        const savedBrands = localStorage.getItem('admin-brands');
        if (savedBrands) {
            set({ brands: JSON.parse(savedBrands) });
        } else {
            set({ brands: initialBrands });
            localStorage.setItem('admin-brands', JSON.stringify(initialBrands));
        }
    },

    deleteBrand: (id) => {
        set((state) => {
            const updated = state.brands.filter((b) => b.id !== id);
            localStorage.setItem('admin-brands', JSON.stringify(updated));
            return { brands: updated };
        });
    },

    createBrand: (brandData) => {
        set((state) => {
            const newBrand = {
                ...brandData,
                id: state.brands.length > 0 ? Math.max(...state.brands.map(b => b.id)) + 1 : 1,
                isActive: brandData.isActive !== undefined ? brandData.isActive : true
            };
            const updated = [...state.brands, newBrand];
            localStorage.setItem('admin-brands', JSON.stringify(updated));
            return { brands: updated };
        });
    },

    updateBrand: (id, brandData) => {
        set((state) => {
            const updated = state.brands.map((b) =>
                b.id === id ? { ...b, ...brandData } : b
            );
            localStorage.setItem('admin-brands', JSON.stringify(updated));
            return { brands: updated };
        });
    },

    bulkDeleteBrands: (ids) => {
        set((state) => {
            const updated = state.brands.filter((b) => !ids.includes(b.id));
            localStorage.setItem('admin-brands', JSON.stringify(updated));
            return { brands: updated };
        });
    },

    toggleBrandStatus: (id) => {
        set((state) => {
            const updated = state.brands.map((b) =>
                b.id === id ? { ...b, isActive: !b.isActive } : b
            );
            localStorage.setItem('admin-brands', JSON.stringify(updated));
            return { brands: updated };
        });
    }
}));
