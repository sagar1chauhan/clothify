import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            settings: {
                general: {
                    storeName: 'Clothify',
                    storeLogo: '',
                    favicon: '',
                    contactEmail: 'contact@clothify.com',
                    contactPhone: '+1 234 567 890',
                    address: '123 Fashion Ave, NY',
                    businessHours: 'Mon-Fri 9AM-6PM',
                    timezone: 'UTC',
                    currency: 'INR',
                    language: 'en',
                    socialMedia: {
                        facebook: '',
                        instagram: '',
                        twitter: '',
                        linkedin: '',
                    },
                    storeDescription: '',
                    defaultCommissionRate: 10,
                    minimumVendorRating: 3.0,
                    vendorApprovalRequired: true,
                    autoApproveVerified: false,
                    vendorProductManagement: true,
                    vendorOrderManagement: true,
                    vendorAnalytics: true,
                },
                theme: {
                    primaryColor: '#10B981',
                    secondaryColor: '#3B82F6',
                    accentColor: '#FFE11B',
                    fontFamily: 'Inter',
                },
                payment: {
                    codEnabled: true,
                    cardEnabled: true,
                    walletEnabled: true,
                    upiEnabled: true,
                    paymentFees: {
                        cod: 0,
                        card: 2.5,
                        wallet: 1.5,
                        upi: 0.5,
                    },
                    paymentGateway: 'stripe',
                    stripePublicKey: '',
                    stripeSecretKey: '',
                },
                shipping: {
                    freeShippingThreshold: 100,
                    defaultShippingRate: 5,
                    shippingMethods: ['standard', 'express'],
                },
                orders: {
                    minimumOrderAmount: 0,
                    allowOrderCancellation: true,
                    cancellationTimeLimit: 24, // hours
                    allowOrderReturns: true,
                    returnTimeLimit: 7, // days
                },
                customers: {
                    allowGuestCheckout: true,
                    requireEmailVerification: true,
                    enableCustomerRegistration: true,
                },
                products: {
                    displayOutOfStock: true,
                    lowStockThreshold: 5,
                    allowBackorders: false,
                },
                inventory: {
                    manageStock: true,
                    autoUpdateStock: true,
                },
                content: {
                    privacyPolicy: '',
                    termsConditions: '',
                    refundPolicy: '',
                    aboutUs: '',
                },
                features: {
                    wishlistEnabled: true,
                    reviewsEnabled: true,
                    flashSaleEnabled: true,
                    dailyDealsEnabled: true,
                    liveChatEnabled: false,
                    couponCodesEnabled: true,
                },
                homepage: {
                    heroBannerEnabled: true,
                    sections: {
                        featuredCategories: { enabled: true },
                        newArrivals: { enabled: true },
                        bestSellers: { enabled: true },
                        flashSale: { enabled: true },
                        brands: { enabled: true },
                    },
                },
                reviews: {
                    moderationMode: 'manual',
                    purchaseRequired: true,
                    displaySettings: {
                        showAll: true,
                        verifiedOnly: false,
                        withPhotosOnly: false,
                    },
                },
                email: {
                    smtpHost: '',
                    smtpPort: 587,
                    smtpUser: '',
                    smtpPassword: '',
                    fromEmail: '',
                    fromName: '',
                },
                notifications: {
                    email: {
                        orderConfirmation: true,
                        shippingUpdate: true,
                        deliveryUpdate: true,
                    },
                    smsEnabled: false,
                    pushEnabled: false,
                    admin: {
                        newOrders: true,
                        lowStock: true,
                    },
                },
                seo: {
                    metaTitle: 'Clothify - Premium Clothing Store',
                    metaDescription: 'Your one-stop shop for premium fashion.',
                    metaKeywords: 'fashion, clothing, online store',
                    ogImage: '',
                    canonicalUrl: '',
                },
            },

            // Initialize settings
            initialize: () => {
                // You can add logic here to fetch settings from an API if needed
                // For now, it just ensures the state exists (Zustand persist handles the rest)
            },

            // Update settings for a specific category
            updateSettings: (category, data) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        [category]: {
                            ...state.settings[category],
                            ...data,
                        },
                    },
                }));
            },

            // Reset settings to defaults
            resetSettings: () => {
                set({ settings: /* initial state */ {} }); // Should probably define initial state separately if needed
            },
        }),
        {
            name: 'clothify-settings-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
