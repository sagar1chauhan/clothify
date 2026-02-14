import { create } from 'zustand';
import { mockCustomers } from '../../data/adminMockData';

export const useCustomerStore = create((set) => ({
    customers: [],
    isLoading: false,
    error: null,

    initialize: () => {
        const savedCustomers = localStorage.getItem('admin-customers');
        if (savedCustomers) {
            set({ customers: JSON.parse(savedCustomers) });
        } else {
            set({ customers: mockCustomers });
            localStorage.setItem('admin-customers', JSON.stringify(mockCustomers));
        }
    },

    updateCustomer: (id, data) => {
        set((state) => {
            const updatedCustomers = state.customers.map((c) =>
                c.id === id ? { ...c, ...data } : c
            );
            localStorage.setItem('admin-customers', JSON.stringify(updatedCustomers));
            return { customers: updatedCustomers };
        });
    },

    deleteCustomer: (id) => {
        set((state) => {
            const updatedCustomers = state.customers.filter((c) => c.id !== id);
            localStorage.setItem('admin-customers', JSON.stringify(updatedCustomers));
            return { customers: updatedCustomers };
        });
    }
}));
