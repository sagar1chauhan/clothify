import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { products } from '../../data';

const ProductGrid = () => {
    return (
        <section className="py-4 md:py-6 bg-white">
            <div className="container px-4 md:px-8">
                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="font-display text-[15px] md:text-xl font-black uppercase tracking-tight text-white px-3 py-1.5 bg-black rounded-sm leading-none">New Drops</h2>
                    <button className="text-black font-black text-[10px] uppercase tracking-widest border-b-2 border-black pb-0.5">View All</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {products.map((product) => (
                        <ProductCard key={`dup-${product.id}`} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
