import { create } from 'zustand';
import { useOrderStore } from './orderStore';
import { useVendorStore } from './vendorStore';

export const useCommissionStore = create((set, get) => ({
    settlements: [],
    isLoading: false,
    error: null,

    // Helper to get commissions for a vendor from all orders
    getVendorCommissions: (vendorId) => {
        const orders = useOrderStore.getState().orders;
        const vendors = useVendorStore.getState().vendors;
        const vendor = vendors.find(v => v.id === vendorId);

        if (!vendor) return [];

        const commissions = [];
        orders.forEach(order => {
            const vendorItems = order.vendorItems?.find(vi => vi.vendorId === vendorId);
            if (vendorItems) {
                const subtotal = vendorItems.subtotal;
                const commissionAmount = subtotal * (vendor.commissionRate || 0.1);
                const vendorEarnings = subtotal - commissionAmount;

                commissions.push({
                    id: `COMM-${order.id}-${vendorId}`,
                    orderId: order.id,
                    createdAt: order.date,
                    subtotal: subtotal,
                    commission: commissionAmount,
                    vendorEarnings: vendorEarnings,
                    status: order.status === 'delivered' ? 'paid' : 'pending'
                });
            }
        });

        return commissions;
    },

    // Helper to get summary of earnings for a vendor
    getVendorEarningsSummary: (vendorId) => {
        const commissions = get().getVendorCommissions(vendorId);

        const summary = {
            totalEarnings: 0,
            pendingEarnings: 0,
            totalCommission: 0,
        };

        commissions.forEach(comm => {
            if (comm.status === 'paid') {
                summary.totalEarnings += comm.vendorEarnings;
            } else {
                summary.pendingEarnings += comm.vendorEarnings;
            }
            summary.totalCommission += comm.commission;
        });

        return summary;
    },

    // Helper to get settlements (mocked for now)
    getVendorSettlements: (vendorId) => {
        // Return mock settlements
        return [
            { id: 'SET-001', vendorId, amount: 5000, date: '2024-01-31', status: 'completed' },
            { id: 'SET-002', vendorId, amount: 3500, date: '2024-02-15', status: 'pending' },
        ];
    },

    addSettlement: (settlement) => {
        set(state => ({
            settlements: [...state.settlements, { ...settlement, id: `SET-${Date.now()}` }]
        }));
    }
}));
