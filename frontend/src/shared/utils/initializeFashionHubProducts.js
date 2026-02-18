import { products as initialProducts } from "../../data/products";

export const initializeFashionHubProducts = () => {
    const vendorId = 1;
    const fashionHubProducts = [
        {
            id: 101,
            vendorId: vendorId,
            categoryId: 1, // Top Wear
            brandId: 1,
            name: "Premium Cotton White T-Shirt",
            price: 999,
            originalPrice: 1299,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
            stock: "in_stock",
            stockQuantity: 45,
            description: "Premium quality cotton t-shirt for daily comfort.",
            status: "active",
            createdAt: new Date().toISOString()
        },
        {
            id: 102,
            vendorId: vendorId,
            categoryId: 2, // Bottom Wear
            brandId: 2,
            name: "Classic Blue Slim Fit Jeans",
            price: 2499,
            originalPrice: 3499,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
            stock: "in_stock",
            stockQuantity: 30,
            description: "Durable and stylish slim fit denim jeans.",
            status: "active",
            createdAt: new Date().toISOString()
        },
        {
            id: 103,
            vendorId: vendorId,
            categoryId: 1,
            brandId: 3,
            name: "Oversized Black Hoodie",
            price: 1899,
            originalPrice: 2499,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
            stock: "low_stock",
            stockQuantity: 5,
            description: "Warm and cozy oversized hoodie for winter.",
            status: "active",
            createdAt: new Date().toISOString()
        }
    ];

    // Get existing products from localStorage or use initial data
    const savedProducts = localStorage.getItem("admin-products");
    let allProducts = savedProducts ? JSON.parse(savedProducts) : [...initialProducts];

    // Add Fashion Hub products if they don't exist
    fashionHubProducts.forEach(newProd => {
        if (!allProducts.some(p => p.id === newProd.id)) {
            allProducts.push(newProd);
        }
    });

    localStorage.setItem("admin-products", JSON.stringify(allProducts));
    console.log("Fashion Hub Products Initialized");
};
