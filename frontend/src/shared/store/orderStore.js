import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialOrders = [
    {
        id: 'ORD-001',
        customer: { name: 'John Doe', email: 'john@example.com' },
        date: "2026-02-10T10:00:00Z",
        total: 12500,
        status: 'delivered',
        paymentMethod: 'card',
        vendorItems: [
            { vendorId: 1, subtotal: 5000, vendorEarnings: 4500, items: [{ name: 'Red T-Shirt', quantity: 1, price: 5000 }] },
            { vendorId: 2, subtotal: 7500, vendorEarnings: 6750, items: [{ name: 'Blue Jeans', quantity: 1, price: 7500 }] }
        ]
    },
    {
        id: 'ORD-002',
        customer: { name: 'Jane Smith', email: 'jane@example.com' },
        date: "2026-02-12T14:30:00Z",
        total: 8200,
        status: 'processing',
        paymentMethod: 'cod',
        vendorItems: [
            { vendorId: 1, subtotal: 8200, vendorEarnings: 7380, items: [{ name: 'Green Hoodie', quantity: 1, price: 8200 }] }
        ]
    },
    {
        id: 'ORD-003',
        customer: { name: 'Robert Brown', email: 'robert@example.com' },
        date: "2026-02-14T09:15:00Z",
        total: 15400,
        status: 'pending',
        paymentMethod: 'card',
        vendorItems: [
            { vendorId: 2, subtotal: 15400, vendorEarnings: 13860, items: [{ name: 'Leather Jacket', quantity: 1, price: 15400 }] }
        ]
    },
    {
        id: 'ORD-004',
        customer: { name: 'Sarah Wilson', email: 'sarah@example.com' },
        date: "2026-02-15T11:45:00Z",
        total: 4500,
        status: 'delivered',
        paymentMethod: 'wallet',
        vendorItems: [
            { vendorId: 1, subtotal: 4500, vendorEarnings: 4050, items: [{ name: 'Cotton Socks', quantity: 3, price: 1500 }] }
        ]
    }
];

export const useOrderStore = create(
    persist(
        (set) => ({
            orders: initialOrders,
            isLoading: false,
            error: null,

            updateOrderStatus: (id, status) => {
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === id ? { ...o, status } : o
                    )
                }));
            },

            assignDeliveryBoy: (orderId, deliveryBoy) => {
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === orderId
                            ? { ...o, status: 'shipped', assignedDeliveryBoy: deliveryBoy }
                            : o
                    )
                }));
            },

            addOrder: (order) => {
                set((state) => ({
                    orders: [order, ...state.orders]
                }));
            },

            deleteOrder: (id) => {
                set((state) => ({
                    orders: state.orders.filter((o) => o.id !== id)
                }));
            },

            getVendorOrders: (vendorId) => {
                const state = useOrderStore.getState();
                return state.orders.filter(order =>
                    order.vendorItems?.some(vi => vi.vendorId === parseInt(vendorId))
                );
            },

            getAvailableDeliveryOrders: () => {
                const state = useOrderStore.getState();
                // Delivery boys see orders that are ready for pickup
                return state.orders.filter(order => order.status === 'ready_for_pickup');
            },

            getDeliveryBoyOrders: (deliveryBoyId) => {
                const state = useOrderStore.getState();
                return state.orders.filter(order => order.assignedDeliveryBoy?.id === deliveryBoyId);
            },

            getOrderById: (id) => {
                const state = useOrderStore.getState();
                return state.orders.find(o => o.id === id);
            }
        }),
        {
            name: 'order-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
