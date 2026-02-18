import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialVendors = [
    {
        id: 1,
        name: "John Smith",
        storeName: "Fashion Hub",
        email: "john@fashionhub.com",
        phone: "+91 9876543210",
        status: "approved",
        commissionRate: 0.1,
        joinDate: "2023-10-15T10:30:00Z",
        storeLogo: "https://via.placeholder.com/100x100?text=FH",
        address: {
            street: "123 Main St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001"
        }
    },
    {
        id: 2,
        name: "Sarah Williams",
        storeName: "Elite Apparels",
        email: "sarah@elite.com",
        phone: "+91 9876543211",
        status: "approved",
        commissionRate: 0.12,
        joinDate: "2023-11-20T14:20:00Z",
        storeLogo: "https://via.placeholder.com/100x100?text=EA",
        address: {
            street: "456 Oak Lane",
            city: "Bangalore",
            state: "Karnataka",
            zipCode: "560001"
        }
    },
    {
        id: 3,
        name: "David Chen",
        storeName: "Urban Style",
        email: "david@urbanstyle.com",
        phone: "+91 9876543212",
        status: "pending",
        commissionRate: 0.1,
        joinDate: "2024-01-05T09:15:00Z",
        storeLogo: "https://via.placeholder.com/100x100?text=US",
        address: {
            street: "789 Pine Rd",
            city: "Delhi",
            state: "Delhi",
            zipCode: "110001"
        }
    },
    {
        id: 4,
        name: "Emily Rodriguez",
        storeName: "Luxe Boutique",
        email: "emily@luxe.com",
        phone: "+91 9876543213",
        status: "suspended",
        commissionRate: 0.15,
        joinDate: "2023-08-12T11:45:00Z",
        storeLogo: "https://via.placeholder.com/100x100?text=LB",
        address: {
            street: "101 Maple Dr",
            city: "Chennai",
            state: "Tamil Nadu",
            zipCode: "600001"
        }
    }
];

export const useVendorStore = create(
    persist(
        (set) => ({
            vendors: initialVendors,
            isLoading: false,
            error: null,

            initialize: () => {
                // Persist handles loading from localStorage, so we just need this for compatibility
                return Promise.resolve();
            },

            updateVendorStatus: (id, status) => {
                set((state) => ({
                    vendors: state.vendors.map((v) =>
                        v.id === id ? { ...v, status } : v
                    )
                }));
            },

            updateCommissionRate: (id, commissionRate) => {
                set((state) => ({
                    vendors: state.vendors.map((v) =>
                        v.id === id ? { ...v, commissionRate } : v
                    )
                }));
            },

            addVendor: (vendor) => {
                set((state) => ({
                    vendors: [...state.vendors, { ...vendor, id: state.vendors.length + 1 }]
                }));
            },

            updateVendor: (id, data) => {
                set((state) => ({
                    vendors: state.vendors.map((v) =>
                        v.id === id ? { ...v, ...data } : v
                    )
                }));
            }
        }),
        {
            name: 'vendor-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
