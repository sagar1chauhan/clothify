export const vendors = [
    {
        id: 1,
        name: "Fashion Hub",
        storeName: "Fashion Hub Official",
        email: "vendor@fashionhub.com",
        phone: "+91 9876543210",
        status: "active",
        rating: 4.8,
        reviewCount: 156,
        totalProducts: 45,
        totalSales: 850,
        totalEarnings: 125000,
        isVerified: true,
        joinDate: "2023-01-15",
        commissionRate: 10,
        address: "123, Fashion Street, Mumbai, Maharashtra",
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=100&q=80"
    },
    {
        id: 2,
        name: "Elite Apparels",
        storeName: "Elite Apparels",
        email: "info@elite.com",
        phone: "+91 9876543211",
        status: "active",
        rating: 4.5,
        reviewCount: 92,
        totalProducts: 120,
        totalSales: 420,
        totalEarnings: 85000,
        isVerified: true,
        joinDate: "2023-03-20",
        commissionRate: 12,
        address: "456, Apparel Avenue, Delhi",
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=100&q=80"
    },
    {
        id: 3,
        name: "Trend Setters",
        storeName: "Trend Setters",
        email: "contact@trendsetters.com",
        phone: "+91 9876543212",
        status: "pending",
        rating: 0,
        reviewCount: 0,
        totalProducts: 0,
        totalSales: 0,
        totalEarnings: 0,
        isVerified: false,
        joinDate: "2024-02-10",
        commissionRate: 15,
        address: "789, Trend Tower, Bangalore",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80"
    }
];

export const getVendorById = (id) => {
    return vendors.find((v) => v.id === parseInt(id));
};

export const getApprovedVendors = () => {
    return vendors.filter((v) => v.status === "active");
};
