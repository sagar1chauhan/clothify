import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, Check, Plus, CreditCard, ChevronRight, ShieldCheck, Truck, Banknote, Smartphone } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [newAddress, setNewAddress] = useState({
        name: '', mobile: '', pincode: '', address: '', locality: '', city: '', state: '', type: 'Home'
    });

    useEffect(() => {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
            const parsed = JSON.parse(savedAddresses);
            setAddresses(parsed);
            if (parsed.length > 0) setSelectedAddress(parsed[0].id);
        }

        // Redirect if cart is empty
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleSaveAddress = (e) => {
        e.preventDefault();
        const addressWithId = { ...newAddress, id: Date.now() };
        const updatedAddresses = [...addresses, addressWithId];
        setAddresses(updatedAddresses);
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        setSelectedAddress(addressWithId.id);
        setShowAddressForm(false);
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const orderData = {
                id: `ORD-${Date.now()}`,
                date: new Date().toLocaleDateString(),
                items: [...cart],
                total: finalTotal,
                address: addresses.find(a => a.id === selectedAddress),
                status: 'Processing'
            };

            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            localStorage.setItem('userOrders', JSON.stringify([orderData, ...existingOrders]));

            clearCart();
            setIsProcessing(false);
            navigate('/orders');
        }, 2000);
    };

    const steps = [
        { number: 1, label: 'Address' },
        { number: 2, label: 'Payment' }
    ];

    const totalPrice = getCartTotal();
    const shipping = totalPrice > 500 ? 0 : 40;
    const finalTotal = totalPrice + shipping;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-black uppercase tracking-tight">Checkout</h1>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure</span>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Steps */}
                <div className="flex items-center justify-center mb-10">
                    {steps.map((s, i) => (
                        <div key={s.number} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step >= s.number ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-300'
                                }`}>
                                {step > s.number ? <Check size={14} /> : s.number}
                            </div>
                            <span className={`ml-2 text-[11px] font-black uppercase tracking-widest ${step >= s.number ? 'text-black' : 'text-gray-300'
                                }`}>{s.label}</span>
                            {i < steps.length - 1 && (
                                <div className={`w-12 h-0.5 mx-4 transition-all ${step > s.number ? 'bg-black' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <div className="bg-white p-6 rounded-[24px] shadow-sm animate-fadeInUp">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-black uppercase tracking-tight">Select Delivery Address</h2>
                                    <button
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="text-[11px] font-black uppercase tracking-widest text-[#ffcc00] hover:text-black transition-colors"
                                    >
                                        + Add New
                                    </button>
                                </div>

                                {showAddressForm ? (
                                    <form onSubmit={handleSaveAddress} className="space-y-4 mb-6 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required placeholder="Name" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 text-sm font-bold" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
                                            <input required placeholder="Mobile" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 text-sm font-bold" value={newAddress.mobile} onChange={e => setNewAddress({ ...newAddress, mobile: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required placeholder="Pincode" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 text-sm font-bold" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                                            <input required placeholder="City" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 text-sm font-bold" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                        </div>
                                        <textarea required placeholder="Full Address" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 text-sm font-bold resize-none h-24" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-3 text-xs font-black uppercase rounded-xl hover:bg-gray-100">Cancel</button>
                                            <button type="submit" className="flex-1 py-3 bg-black text-white text-xs font-black uppercase rounded-xl hover:bg-gray-800">Save & Use</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.length === 0 ? (
                                            <div className="text-center py-10">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <MapPin className="text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 mb-4">No addresses saved yet</p>
                                                <button onClick={() => setShowAddressForm(true)} className="px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl">Add Address</button>
                                            </div>
                                        ) : (
                                            addresses.map(addr => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddress(addr.id)}
                                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedAddress === addr.id
                                                        ? 'border-black bg-black/5'
                                                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900">{addr.name}</span>
                                                            <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border border-gray-100 uppercase tracking-tighter">{addr.type}</span>
                                                        </div>
                                                        {selectedAddress === addr.id && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[80%]">
                                                        {addr.address}, {addr.city} - {addr.pincode}
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-900 mt-2">Mobile: {addr.mobile}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="bg-white p-6 rounded-[24px] shadow-sm animate-fadeInUp">
                                <h2 className="text-lg font-black uppercase tracking-tight mb-6">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                            <Smartphone size={20} className="text-black" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900">UPI / Netbanking</div>
                                            <div className="text-[10px] font-bold text-green-600">Extra 5% OFF</div>
                                        </div>
                                        {paymentMethod === 'upi' && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                                    </label>

                                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                            <CreditCard size={20} className="text-black" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900">Credit / Debit Card</div>
                                        </div>
                                        {paymentMethod === 'card' && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                                    </label>

                                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                            <Banknote size={20} className="text-black" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900">Cash on Delivery</div>
                                        </div>
                                        {paymentMethod === 'cod' && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-[24px] shadow-sm sticky top-24">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <img src={item.image} alt="" className="w-12 h-16 object-cover rounded-lg bg-gray-50" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold">{item.brand} • Size {item.selectedSize}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs font-black">₹{item.discountedPrice}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                            </div>

                            {step === 1 ? (
                                <button
                                    onClick={() => selectedAddress ? setStep(2) : alert('Please select an address')}
                                    disabled={!selectedAddress}
                                    className="w-full mt-6 py-4 bg-black text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Proceed to Payment
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full mt-6 py-4 bg-[#ffcc00] text-black rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#e6b800] disabled:opacity-75 transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isProcessing ? 'Processing...' : `Pay ₹${finalTotal}`}
                                    {!isProcessing && <ChevronRight size={16} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
