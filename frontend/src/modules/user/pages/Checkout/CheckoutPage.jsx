import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, Check, Plus, ShieldCheck } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal } = useCart();
    const { user } = useAuth();

    // 1: Bag (Cart), 2: Address (Current), 3: Payment (Next Page)
    // We can keep a visual step indicator or simplify it.
    // Let's keep the visual indicator but 'Payment' step will be on the next page.
    // Or we can just show Bag -> Address -> Payment with Address active.

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);

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

    const handleProceedToPayment = () => {
        if (!selectedAddress) {
            alert('Please select an address');
            return;
        }

        const addressData = addresses.find(a => a.id === selectedAddress);
        navigate('/payment', { state: { selectedAddress: addressData } });
    };

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

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-100 px-4 py-4 mb-4">
                <div className="flex items-center justify-center max-w-sm mx-auto">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mb-1"></div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Bag</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-emerald-500 mx-2 mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-black rounded-full mb-1 border-2 border-black"></div>
                        <span className="text-[10px] font-black text-black uppercase tracking-widest">Address</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-2 mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-white border-2 border-gray-200 rounded-full mb-1"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Payment</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {/* Address Section */}
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

                            <button
                                onClick={handleProceedToPayment}
                                disabled={!selectedAddress}
                                className="w-full mt-6 py-4 bg-black text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
