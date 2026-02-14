import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        paid: 'bg-green-100 text-green-800',
        unpaid: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800',
        low_stock: 'bg-orange-100 text-orange-800',
        out_of_stock: 'bg-red-100 text-red-800',
        in_stock: 'bg-green-100 text-green-800',
    };

    const variantClass = variants[variant.toLowerCase()] || variants.default;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
