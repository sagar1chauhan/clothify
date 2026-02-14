import React, { useState } from 'react';
import AccountLayout from '../../components/Profile/AccountLayout';
import { MapPin, Search, X, Home, Briefcase, MapPin as MapPinIcon } from 'lucide-react';

const AddressesPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('userAddresses');
        return saved ? JSON.parse(saved) : [];
    });

    const [newAddress, setNewAddress] = useState({
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        locality: '',
        city: '',
        state: '',
        type: 'Home'
    });

    const handleSave = (e) => {
        e.preventDefault();
        const updated = [...addresses, { ...newAddress, id: Date.now() }];
        setAddresses(updated);
        localStorage.setItem('userAddresses', JSON.stringify(updated));
        setShowForm(false);
        setNewAddress({ name: '', mobile: '', pincode: '', address: '', locality: '', city: '', state: '', type: 'Home' });
    };

    return (
        <AccountLayout>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">Saved Addresses</h2>
                </div>

                {showForm ? (
                    <div className="animate-fadeInUp">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Add New Address</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4 max-w-[500px]">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black"
                                    value={newAddress.name}
                                    onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="Mobile Number"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black"
                                    value={newAddress.mobile}
                                    onChange={e => setNewAddress({ ...newAddress, mobile: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    placeholder="Pincode"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black"
                                    value={newAddress.pincode}
                                    onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="Locality / Town"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black"
                                    value={newAddress.locality}
                                    onChange={e => setNewAddress({ ...newAddress, locality: e.target.value })}
                                />
                            </div>
                            <textarea
                                required
                                placeholder="Address (House No, Building, Street, Area)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black h-24 resize-none"
                                value={newAddress.address}
                                onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    placeholder="City / District"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black"
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="State"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-black"
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Address Type</h4>
                                <div className="flex gap-4">
                                    {['Home', 'Work'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewAddress({ ...newAddress, type })}
                                            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${newAddress.type === type ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-black text-white rounded-xl font-extrabold uppercase mt-6 shadow-lg hover:bg-gray-800 transition-all">
                                Save Address
                            </button>
                        </form>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                        <div className="relative mb-6">
                            <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200">
                                <Search size={64} className="text-gray-200 rotate-12" />
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <MapPin size={80} className="text-gray-300 opacity-50" />
                            </div>
                        </div>
                        <p className="text-gray-900 font-semibold mb-8">You don't have any saved addresses</p>
                        <button onClick={() => setShowForm(true)} className="w-full py-4 bg-black text-white rounded-xl font-extrabold text-[15px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                            Add Address
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map(addr => (
                            <div key={addr.id} className="p-6 border border-gray-100 rounded-2xl flex items-start gap-4 hover:border-black/10 transition-all group">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                                    {addr.type === 'Home' ? <Home size={20} /> : <Briefcase size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">{addr.name}</span>
                                        <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">{addr.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{addr.address}, {addr.locality}</p>
                                    <p className="text-sm text-gray-600 mb-3">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="text-sm font-bold text-gray-900">Mobile: {addr.mobile}</p>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setShowForm(true)} className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-gray-300 hover:text-gray-500 transition-all">
                            + Add New Address
                        </button>
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default AddressesPage;
