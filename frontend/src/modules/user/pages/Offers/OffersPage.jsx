import React, { useState } from 'react';
import AccountLayout from '../../components/Profile/AccountLayout';
import { Tag, ChevronDown, ChevronUp, Percent } from 'lucide-react';

const OffersPage = () => {
    const [showTerms, setShowTerms] = useState(false);

    return (
        <AccountLayout>
            <div className="space-y-6">
                <h2 className="text-xl font-bold mb-8">My Offers</h2>

                {/* Coupon Card - Matching Image 1 */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                                    <Percent size={24} strokeWidth={3} />
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-1">
                                    <span className="font-extrabold text-lg tracking-wider text-gray-900">FIRST50</span>
                                </div>
                            </div>
                            <button className="bg-[#a03040] text-white px-8 py-2.5 rounded-xl font-bold text-[15px] hover:opacity-90 transition-all uppercase tracking-wide">
                                Apply
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-[17px] font-black text-gray-900 uppercase tracking-tight">
                                ₹250 OFF ON MINIMUM CART VALUE: ₹500
                            </h3>
                            <p className="text-gray-500 text-[14px] font-medium">
                                Get FLAT ₹250 on your first 2 orders above ₹500.
                            </p>
                            <p className="text-[#a03040] text-[15px] font-bold pt-2">
                                Add ₹500 more to apply
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-50">
                        <button
                            onClick={() => setShowTerms(!showTerms)}
                            className="w-full py-4 flex items-center justify-center gap-2 text-gray-600 text-[14px] font-semibold hover:bg-gray-50 transition-all"
                        >
                            Terms & Conditions {showTerms ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showTerms && (
                            <div className="px-6 pb-6 animate-fadeInUp">
                                <ul className="space-y-2 text-[13px] text-gray-500 list-disc pl-4">
                                    <li>Offer valid on first 2 orders only.</li>
                                    <li>Minimum cart value should be ₹500 or more (after all other discounts).</li>
                                    <li>Offer cannot be clubbed with other coupon codes.</li>
                                    <li>Clothify reserves the right to withdraw the offer without prior notice.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default OffersPage;
