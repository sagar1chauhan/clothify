import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccountLayout from '../../components/Profile/AccountLayout';
import { ArrowLeft, Package, Clock, MapPin, Phone, CreditCard, ChevronRight, Printer } from 'lucide-react';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        // Handle potentially different ID formats (string vs number)
        const foundOrder = orders.find(o => String(o.id) === String(orderId));
        setOrder(foundOrder);
    }, [orderId]);

    const handleViewInvoice = () => {
        if (!order) return;

        const invoiceWindow = window.open('', '_blank');
        const invoiceContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${order.id}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; max-width: 800px; mx-auto; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; }
                    .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
                    .section-title { font-size: 14px; font-weight: bold; uppercase; margin-bottom: 10px; color: #666; letter-spacing: 1px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    .table th { text-align: left; border-bottom: 2px solid #eee; padding: 10px; font-size: 12px; uppercase; }
                    .table td { border-bottom: 1px solid #eee; padding: 10px; font-size: 14px; }
                    .total-section { text-align: right; }
                    .total-row { font-size: 18px; font-weight: bold; margin-top: 10px; }
                    .footer { margin-top: 60px; text-align: center; color: #999; font-size: 12px; }
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="company-name">Clothify</div>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">Your Fashion Store</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="invoice-title">INVOICE</div>
                        <div style="color: #666; margin-top: 5px;">#${order.id}</div>
                        <div style="color: #666;">Date: ${order.date}</div>
                    </div>
                </div>

                <div class="info-grid">
                    <div>
                        <div class="section-title">BILLED TO</div>
                        ${order.address ? `
                            <div style="font-weight: bold;">${order.address.name}</div>
                            <div>${order.address.address}</div>
                            <div>${order.address.locality}</div>
                            <div>${order.address.city}, ${order.address.state} - ${order.address.pincode}</div>
                            <div style="margin-top: 5px;">Phone: ${order.address.mobile}</div>
                        ` : 'Address not available'}
                    </div>
                    <div>
                        <div class="section-title">PAYMENT METHOD</div>
                        <div style="font-weight: bold; text-transform: uppercase;">${order.paymentMethod || 'Pay on Delivery'}</div>
                        <div style="margin-top: 20px;">
                            <div class="section-title">ORDER STATUS</div>
                            <div style="font-weight: bold; text-transform: uppercase;">${order.status}</div>
                        </div>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th style="text-align: right;">Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>
                                    <div style="font-weight: bold;">${item.name}</div>
                                    <div style="color: #666; font-size: 12px;">${item.brand}</div>
                                </td>
                                <td>${item.selectedSize}</td>
                                <td>${item.quantity}</td>
                                <td style="text-align: right;">₹${item.discountedPrice}</td>
                                <td style="text-align: right;">₹${item.discountedPrice * item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-section">
                    <div style="display: inline-block; text-align: right; min-width: 200px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: #666;">Subtotal:</span>
                            <span>₹${order.total}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: #666;">Shipping:</span>
                            <span style="color: green;">FREE</span>
                        </div>
                        <div class="total-row" style="display: flex; justify-content: space-between; border-top: 2px solid #eee; padding-top: 10px;">
                            <span>Total:</span>
                            <span>₹${order.total}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for shopping with Clothify!</p>
                    <p>For any queries, please contact support@clothify.com</p>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        invoiceWindow.document.write(invoiceContent);
        invoiceWindow.document.close();
    };

    if (!order) {
        return (
            <AccountLayout hideHeader={true}>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <p className="text-gray-500 font-bold">Order not found</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="mt-4 px-6 py-2 bg-black text-white rounded-xl text-sm font-bold uppercase"
                    >
                        Back to Orders
                    </button>
                </div>
            </AccountLayout>
        );
    }

    return (
        <AccountLayout hideHeader={true}>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-xl font-black uppercase tracking-tight">Order Details</h2>
                        <p className="text-xs text-gray-500 font-bold">#{order.id}</p>
                    </div>
                    <button
                        onClick={handleViewInvoice}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-xl transition-colors mr-2"
                    >
                        <Printer size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Invoice</span>
                    </button>
                    <span className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-wider">
                        {order.status}
                    </span>
                </div>

                <div className="space-y-6">
                    {/* Items Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Package size={16} /> Items in Order
                        </h3>
                        <div className="space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                                            {item.brand}
                                        </p>
                                        <div className="flex gap-4 mt-2">
                                            <div className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase">
                                                Size: {item.selectedSize}
                                            </div>
                                            <div className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-black mt-2">₹{item.discountedPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery & Payment Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin size={16} /> Delivery Address
                            </h3>
                            {order.address ? (
                                <div className="space-y-2">
                                    <p className="font-bold text-gray-900">{order.address.name}</p>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        {order.address.address}, {order.address.locality} <br />
                                        {order.address.city}, {order.address.state} - {order.address.pincode}
                                    </p>
                                    <p className="text-xs font-bold text-gray-900 flex items-center gap-2 mt-2">
                                        <Phone size={12} /> {order.address.mobile}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Address details not available</p>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CreditCard size={16} /> Payment Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{order.total}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm font-black text-black pt-3 border-t border-gray-50">
                                    <span>Total Amount</span>
                                    <span>₹{order.total}</span>
                                </div>
                                <div className="mt-4 bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Payment Method</span>
                                    <span className="text-xs font-black text-gray-900 uppercase">
                                        {order.paymentMethod || 'Pay on Delivery'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline (Simple) */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={16} /> Order Status
                        </h3>
                        <div className="flex items-center">
                            <div className="relative z-10 w-8 h-8 flex items-center justify-center bg-green-500 rounded-full text-white shadow-lg shadow-green-200">
                                <Package size={14} />
                            </div>
                            <div className="flex-1 h-1 bg-gray-100 mx-2 rounded-full relative">
                                <div className="absolute top-0 left-0 h-full bg-green-500 w-1/4 rounded-full"></div>
                            </div>
                            <div className="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400">
                                <Package size={14} />
                            </div>
                            <div className="flex-1 h-1 bg-gray-100 mx-2 rounded-full"></div>
                            <div className="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400">
                                <Package size={14} />
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                            <span className="text-green-600">Ordered</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 mt-6 text-center">
                            Expected Delivery by <span className="text-black">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default OrderDetailsPage;
