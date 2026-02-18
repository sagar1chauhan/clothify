// Mock data for Admin Dashboard

export const generateRevenueData = (days) => {
    const data = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 50000) + 10000,
            orders: Math.floor(Math.random() * 50) + 10,
            customers: Math.floor(Math.random() * 20) + 5,
        });
    }
    return data;
};

export const mockOrders = [
    {
        id: 'ORD-001',
        customer: { name: 'John Doe', email: 'john@example.com' },
        date: new Date().toISOString(),
        total: 12500,
        status: 'delivered',
        items: 3,
    },
    {
        id: 'ORD-002',
        customer: { name: 'Jane Smith', email: 'jane@example.com' },
        date: new Date(Date.now() - 86400000).toISOString(),
        total: 8200,
        status: 'processing',
        items: 2,
    },
    {
        id: 'ORD-003',
        customer: { name: 'Robert Brown', email: 'robert@example.com' },
        date: new Date(Date.now() - 172800000).toISOString(),
        total: 15400,
        status: 'pending',
        items: 5,
    },
];

export const topProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', sales: 154, revenue: 154000, image: 'https://placehold.co/100x100' },
    { id: 2, name: 'Slim Fit Denim Jeans', sales: 120, revenue: 240000, image: 'https://placehold.co/100x100' },
    { id: 3, name: 'Classic Leather Jacket', sales: 85, revenue: 425000, image: 'https://placehold.co/100x100' },
];

export const getAnalyticsSummary = () => ({
    totalRevenue: 1250000,
    revenueChange: 12.5,
    totalOrders: 450,
    ordersChange: -5.2,
    totalCustomers: 1200,
    customersChange: 8.4,
    avgOrderValue: 2777,
    aovChange: 2.1,
});

export const mockReturnRequests = [
    {
        id: 'RET-001',
        orderId: 'ORD-001',
        customer: { name: 'John Doe', email: 'john@example.com' },
        requestDate: new Date(Date.now() - 43200000).toISOString(),
        items: [{ id: 1, name: 'Cotton T-Shirt', quantity: 1, price: 1299 }],
        reason: 'Wrong size delivered',
        refundAmount: 1299,
        status: 'pending',
        refundStatus: 'pending'
    },
    {
        id: 'RET-002',
        orderId: 'ORD-005',
        customer: { name: 'Sarah Wilson', email: 'sarah@example.com' },
        requestDate: new Date(Date.now() - 86400000).toISOString(),
        items: [{ id: 2, name: 'Denim Jeans', quantity: 1, price: 2499 }],
        reason: 'Defective item',
        refundAmount: 2499,
        status: 'approved',
        refundStatus: 'pending'
    }
];

export const mockCustomers = [
    { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', orders: 5, totalSpent: 25000, status: 'active', joinedAt: '2023-10-01' },
    { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', orders: 2, totalSpent: 8200, status: 'active', joinedAt: '2023-11-15' },
    { id: 'CUST-003', name: 'Robert Brown', email: 'robert@example.com', phone: '+91 9876543212', orders: 12, totalSpent: 154000, status: 'active', joinedAt: '2023-01-20' }
];

export const mockVendors = [
    { id: 'VEN-001', name: 'Fashion Hub', email: 'contact@fashionhub.com', phone: '+91 0000000001', products: 45, rating: 4.5, status: 'active' },
    { id: 'VEN-002', name: 'Elite Apparels', email: 'info@elite.com', phone: '+91 0000000002', products: 120, rating: 4.8, status: 'active' }
];

export const mockReviews = [
    { id: 1, product: 'Cotton T-Shirt', customer: 'John Doe', rating: 5, comment: 'Excellent quality!', date: '2024-02-10', status: 'published' },
    { id: 2, product: 'Denim Jeans', customer: 'Jane Smith', rating: 4, comment: 'Good fit, slightly long.', date: '2024-02-11', status: 'published' }
];
