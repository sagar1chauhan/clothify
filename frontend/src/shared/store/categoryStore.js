import { create } from 'zustand';

// Initial categories mock data
const initialCategories = [
    { id: 1, name: 'Men', description: 'Men\'s Clothing', isActive: true, order: 1, image: '' },
    { id: 2, name: 'Women', description: 'Women\'s Clothing', isActive: true, order: 2, image: '' },
    { id: 3, name: 'Kids', description: 'Kid\'s Clothing', isActive: true, order: 3, image: '' },
    { id: 4, name: 'T-Shirts', description: 'Casual T-Shirts', isActive: true, order: 4, parentId: 1, image: '' },
    { id: 5, name: 'Jeans', description: 'Denim Jeans', isActive: true, order: 5, parentId: 1, image: '' }
];

export const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,

    initialize: () => {
        const savedCategories = localStorage.getItem('admin-categories');
        if (savedCategories) {
            set({ categories: JSON.parse(savedCategories) });
        } else {
            set({ categories: initialCategories });
            localStorage.setItem('admin-categories', JSON.stringify(initialCategories));
        }
    },

    deleteCategory: (id) => {
        set((state) => {
            const updated = state.categories.filter((c) => c.id !== id && c.parentId !== id);
            localStorage.setItem('admin-categories', JSON.stringify(updated));
            return { categories: updated };
        });
    },

    createCategory: (categoryData) => {
        set((state) => {
            const newCategory = {
                ...categoryData,
                id: state.categories.length > 0 ? Math.max(...state.categories.map(c => c.id)) + 1 : 1,
                isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
                order: state.categories.length + 1
            };
            const updated = [...state.categories, newCategory];
            localStorage.setItem('admin-categories', JSON.stringify(updated));
            return { categories: updated };
        });
    },

    updateCategory: (id, categoryData) => {
        set((state) => {
            const updated = state.categories.map((c) =>
                c.id === id ? { ...c, ...categoryData } : c
            );
            localStorage.setItem('admin-categories', JSON.stringify(updated));
            return { categories: updated };
        });
    },

    toggleCategoryStatus: (id) => {
        set((state) => {
            const updated = state.categories.map((c) =>
                c.id === id ? { ...c, isActive: !c.isActive } : c
            );
            localStorage.setItem('admin-categories', JSON.stringify(updated));
            return { categories: updated };
        });
    },

    bulkDeleteCategories: (ids) => {
        set((state) => {
            const updated = state.categories.filter((c) => !ids.includes(c.id));
            localStorage.setItem('admin-categories', JSON.stringify(updated));
            return { categories: updated };
        });
    },

    getCategories: () => get().categories,

    getRootCategories: () => {
        const { categories } = get();
        return categories.filter((c) => !c.parentId);
    },

    getCategoriesByParent: (parentId) => {
        const { categories } = get();
        return categories.filter((c) => c.parentId === parentId);
    },

    getCategoryById: (id) => {
        const { categories } = get();
        return categories.find((c) => c.id === parseInt(id));
    }
}));
