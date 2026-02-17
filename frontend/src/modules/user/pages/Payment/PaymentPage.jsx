import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    ChevronRight,
    ChevronDown,
    Banknote,
    Smartphone,
    CreditCard,
    Clock,
    Wallet,
    Percent,
    Landmark,
    Gift,
    ShieldCheck,
    Plus
} from 'lucide-react';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    // Get address from navigation state or fallback to local storage if available
    const selectedAddress = location.state?.address;

    const [paymentMethod, setPaymentMethod] = useState('');
    const [expandedOption, setExpandedOption] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if direct access without cart or address (optional validation)
    React.useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const totalPrice = getCartTotal();
    const totalMRP = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const totalDiscount = totalMRP - totalPrice;
    const platformFee = 20; // Example fee
    const shipping = totalPrice > 500 ? 0 : 40;
    const finalTotal = totalPrice + shipping + platformFee;

    const handlePlaceOrder = () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            const orderData = {
                id: `ORD-${Date.now()}`,
                date: new Date().toLocaleDateString(),
                items: [...cart],
                total: finalTotal,
                address: selectedAddress,
                status: 'Processing',
                paymentMethod
            };

            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            localStorage.setItem('userOrders', JSON.stringify([orderData, ...existingOrders]));

            clearCart();
            setIsProcessing(false);
            navigate('/orders');
        }, 2000);
    };

    const toggleOption = (option) => {
        if (expandedOption === option) {
            setExpandedOption('');
        } else {
            setExpandedOption(option);
        }
    };

    const PaymentOption = ({ id, icon: Icon, title, subtitle, offers, children }) => (
        <div className="border-b border-gray-100 last:border-0">
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOption(id)}
            >
                <div className="flex items-center gap-4">
                    <Icon size={20} className="text-gray-600" />
                    <div>
                        <div className="text-[13px] font-bold text-gray-900">{title}</div>
                        {subtitle && <div className="text-[10px] text-gray-500 font-medium">{subtitle}</div>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {offers && <span className="text-[10px] font-black text-emerald-600 uppercase">{offers}</span>}
                    {expandedOption === id ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </div>
            </div>
            {expandedOption === id && (
                <div className="px-4 pb-4 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-black uppercase tracking-tight">Payment</h1>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">100% Secure</span>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-100 px-4 py-4 mb-4">
                <div className="flex items-center justify-center max-w-sm mx-auto">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mb-1"></div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Bag</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-emerald-500 mx-2 mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mb-1"></div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Address</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-black mx-2 mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-white border-2 border-black rounded-full mb-1"></div>
                        <span className="text-[10px] font-black text-black uppercase tracking-widest">Payment</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl">

                {/* Bank Offers */}
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group">
                    <div>
                        <h3 className="text-[13px] font-black uppercase tracking-tight text-gray-900 mb-1">Coupons & Bank Offers</h3>
                        <p className="text-[10px] font-bold text-gray-400">Save more with coupons and bank offers</p>
                    </div>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase group-hover:gap-3 transition-all">
                        All Offers <ChevronRight size={14} />
                    </div>
                </div>

                {/* Recommended Payment Options */}
                <div className="mb-4">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-2">Recommended Payment Options</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <label className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod_rec"
                                    checked={paymentMethod === 'cod_rec'}
                                    onChange={() => setPaymentMethod('cod_rec')}
                                    className="accent-black w-4 h-4"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-gray-900">Cash on Delivery (Cash/UPI)</span>
                                </div>
                            </div>
                            <Banknote size={20} className="text-gray-400" />
                        </label>

                        <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="amazon_pay"
                                    checked={paymentMethod === 'amazon_pay'}
                                    onChange={() => setPaymentMethod('amazon_pay')}
                                    className="accent-black w-4 h-4"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-gray-900">Amazon Pay UPI</span>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black uppercase tracking-wider text-gray-600">PAY</div>
                        </label>
                    </div>
                </div>

                {/* Online Payment Options */}
                <div className="mb-4">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-2">Online Payment Options</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <PaymentOption id="upi" icon={Smartphone} title="UPI (Pay via any App)" offers="6 Offers">
                            <div className="space-y-3 pl-9">
                                {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                                    <label key={app} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={`upi_${app}`}
                                            checked={paymentMethod === `upi_${app}`}
                                            onChange={() => setPaymentMethod(`upi_${app}`)}
                                            className="accent-black w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{app}</span>
                                    </label>
                                ))}
                                <div className="pt-2">
                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-black outline-none transition-colors"
                                    />
                                    <button className="mt-2 w-full py-2 bg-gray-900 text-white text-xs font-bold uppercase rounded-lg">Verify & Pay</button>
                                </div>
                            </div>
                        </PaymentOption>

                        <PaymentOption id="card" icon={CreditCard} title="Credit/Debit Card" offers="4 Offers">
                            <div className="pl-9 pt-2">
                                <button className="text-xs font-black uppercase text-[#ffcc00] hover:text-black transition-colors flex items-center gap-1">
                                    <Plus size={14} /> Add New Card
                                </button>
                            </div>
                        </PaymentOption>

                        <PaymentOption id="paylater" icon={Clock} title="Pay Later">
                            <div className="pl-9">
                                <p className="text-xs text-gray-500">Check your eligibility for Pay Later options.</p>
                            </div>
                        </PaymentOption>

                        <PaymentOption id="wallet" icon={Wallet} title="Wallets" offers="1 Offer">
                            <div className="pl-9 space-y-3">
                                {['Paytm Wallet', 'Amazon Pay Balance', 'PhonePe Wallet'].map(wallet => (
                                    <label key={wallet} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={`wallet_${wallet}`}
                                            checked={paymentMethod === `wallet_${wallet}`}
                                            onChange={() => setPaymentMethod(`wallet_${wallet}`)}
                                            className="accent-black w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{wallet}</span>
                                    </label>
                                ))}
                            </div>
                        </PaymentOption>

                        <PaymentOption id="emi" icon={Percent} title="EMI" offers="6 Offers">
                            <div className="pl-9">
                                <p className="text-xs text-gray-500">No Cost EMI available on selected cards.</p>
                            </div>
                        </PaymentOption>

                        <PaymentOption id="netbanking" icon={Landmark} title="Net Banking">
                            <div className="pl-9">
                                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none">
                                    <option>Select Bank</option>
                                    <option>HDFC Bank</option>
                                    <option>SBI</option>
                                    <option>ICICI Bank</option>
                                    <option>Axis Bank</option>
                                </select>
                            </div>
                        </PaymentOption>
                    </div>
                </div>

                {/* Pay on Delivery Option */}
                <div className="mb-6">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-2">Pay on Delivery Option</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod_main"
                                    checked={paymentMethod === 'cod_main'}
                                    onChange={() => setPaymentMethod('cod_main')}
                                    className="accent-black w-4 h-4"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-gray-900">Cash on Delivery (Cash/UPI)</span>
                                </div>
                            </div>
                            <Banknote size={20} className="text-gray-400" />
                        </label>
                    </div>
                </div>

                {/* Gift Card */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Gift size={20} className="text-gray-900" />
                        <span className="text-[13px] font-bold text-gray-900">Have a Gift Card?</span>
                    </div>
                    <button className="text-[11px] font-black text-red-500 uppercase hover:text-red-600 transition-colors">
                        Apply
                    </button>
                </div>

                {/* Price Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-24">
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 mb-4 pb-4 border-b border-gray-100">
                        Price Details ({cart.length} Items)
                    </h3>
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500 font-medium">Total MRP</span>
                            <span className="text-gray-900 font-bold">₹{totalMRP}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500 font-medium">Discount on MRP</span>
                            <span className="text-emerald-600 font-bold">-₹{totalDiscount}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500 font-medium">Platform Fee</span>
                            <span className="text-gray-900 font-bold">₹{platformFee}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500 font-medium">Shipping Fee</span>
                            <span className="text-emerald-600 font-bold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                        <span className="text-[14px] font-black text-gray-900 uppercase tracking-tight">Total Amount</span>
                        <span className="text-[16px] font-black text-gray-900">₹{finalTotal}</span>
                    </div>
                </div>

                {/* Footer Section - Fixed Bottom */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-50">
                    <div className="flex items-center justify-between container mx-auto max-w-2xl">
                        <div className="flex flex-col">
                            <span className="text-[16px] font-black text-gray-900">₹{finalTotal}</span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide cursor-pointer">View Details</span>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="bg-[#d32f2f] text-white px-8 py-3 rounded-lg text-[12px] font-black uppercase tracking-widest hover:bg-[#b71c1c] active:scale-95 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isProcessing ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>

                {/* Terms */}
                <div className="text-center pb-24 px-4">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                        By placing the order, you agree to Myntra's <span className="text-red-500 font-bold cursor-pointer">Terms of Use</span> and <span className="text-red-500 font-bold cursor-pointer">Privacy Policy</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PaymentPage;
