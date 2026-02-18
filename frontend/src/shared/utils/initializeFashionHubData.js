export const initializeFashionHubData = () => {
    const vendorId = 1;
    const dummyProducts = [
        {
            id: 101,
            vendorId: vendorId,
            name: "Classic White T-Shirt",
            price: 999,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format",
            stock: "in_stock",
            category: "Top Wear"
        },
        {
            id: 102,
            vendorId: vendorId,
            name: "Blue Denim Jeans",
            price: 2499,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format",
            stock: "in_stock",
            category: "Bottom Wear"
        }
    ];

    const dummyOrders = [
        {
            id: "ORD-VH-001",
            vendorId: vendorId,
            customerName: "John Doe",
            amount: 3498,
            status: "delivered",
            date: new Date().toISOString()
        },
        {
            id: "ORD-VH-002",
            vendorId: vendorId,
            customerName: "Jane Smith",
            amount: 999,
            status: "pending",
            date: new Date().toISOString()
        }
    ];

    // Save to localStorage or update existing stores if they were using localStorage
    // For now, these are just dummy initializers
    console.log("Fashion Hub Data Initialized");
};
