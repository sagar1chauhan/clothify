import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccountLayout from '../../components/Profile/AccountLayout';
import { ArrowLeft, Package, Clock, MapPin, Phone, CreditCard, ChevronRight, Printer } from 'lucide-react';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Check admin-orders first for latest status updates
        const adminOrders = JSON.parse(localStorage.getItem('admin-orders') || '[]');
        let foundOrder = adminOrders.find(o => String(o.id) === String(orderId));

        // Fallback to local user orders if not found in admin list (edge case)
        if (!foundOrder) {
            const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            foundOrder = userOrders.find(o => String(o.id) === String(orderId));
        }

        setOrder(foundOrder);
    }, [orderId]);

    const handleViewInvoice = () => {
        if (!order) return;

        const invoiceWindow = window.open('', '_blank');

        if (!invoiceWindow) {
            alert("Please allow popups to view the invoice.");
            return;
        }

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
            <div className="max-w-4xl mx-auto px-4 md:px-0 pb-10">
                {/* Responsive Header */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 pt-2">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors order-1"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 order-2 min-w-[150px]">
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Order Details</h2>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold">#{order.id}</p>
                    </div>
                    <div className="flex items-center gap-2 order-3 w-full sm:w-auto sm:order-2 justify-between sm:justify-end">
                        <button
                            onClick={handleViewInvoice}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-xl transition-colors"
                        >
                            <Printer size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden xs:inline">Invoice</span>
                        </button>
                        <span className="text-[9px] md:text-[10px] font-black bg-black text-white px-3 py-1.5 rounded-full uppercase tracking-wider">
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {/* Items Section */}
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm font-bold">
                        <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400">
                            <Package size={16} /> Items in Order
                        </h3>
                        <div className="space-y-4 md:space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 md:gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                                    <div className="w-16 h-20 md:w-20 md:h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5 md:py-1">
                                        <h4 className="text-[13px] md:text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                        <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-0.5 md:mt-1">
                                            {item.brand}
                                        </p>
                                        <div className="flex flex-wrap gap-2 md:gap-4 mt-1.5 md:mt-2">
                                            <div className="bg-gray-50 px-2 py-0.5 md:py-1 rounded text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">
                                                Size: {item.selectedSize}
                                            </div>
                                            <div className="bg-gray-50 px-2 py-0.5 md:py-1 rounded text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                        <p className="text-[13px] md:text-sm font-black text-black mt-1.5 md:mt-2">₹{item.discountedPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery & Payment Info Grid */}
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 font-bold">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm">
                            <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400">
                                <MapPin size={16} /> Delivery Address
                            </h3>
                            {order.address ? (
                                <div className="space-y-1.5 md:space-y-2">
                                    <p className="text-sm font-bold text-gray-900">{order.address.name}</p>
                                    <p className="text-[11px] md:text-xs text-gray-500 font-medium leading-relaxed">
                                        {order.address.address}, {order.address.locality} <br />
                                        {order.address.city}, {order.address.state} - {order.address.pincode}
                                    </p>
                                    <p className="text-[11px] md:text-xs font-bold text-gray-900 flex items-center gap-2 mt-2">
                                        <Phone size={12} className="text-gray-400" /> {order.address.mobile}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Address details not available</p>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm">
                            <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400">
                                <CreditCard size={16} /> Payment Summary
                            </h3>
                            <div className="space-y-2.5 md:space-y-3">
                                <div className="flex justify-between text-[11px] md:text-xs font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{order.total}</span>
                                </div>
                                <div className="flex justify-between text-[11px] md:text-xs font-bold text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-[13px] md:text-sm font-black text-black pt-2 md:pt-3 border-t border-gray-50">
                                    <span>Total Amount</span>
                                    <span>₹{order.total}</span>
                                </div>
                                <div className="mt-3 md:mt-4 bg-gray-50 p-2.5 md:p-3 rounded-xl flex items-center justify-between">
                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400">Payment Method</span>
                                    <span className="text-[11px] md:text-xs font-black text-gray-900 uppercase">
                                        {order.paymentMethod || 'Pay on Delivery'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm font-bold">
                        <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400">
                            <Clock size={16} /> Order Status
                        </h3>
                        <div className="px-2">
                            <div className="flex items-center">
                                <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-green-500 rounded-full text-white shadow-lg shadow-green-200">
                                    <Package size={14} />
                                </div>
                                <div className="flex-1 h-1 bg-gray-100 mx-1 md:mx-2 rounded-full relative">
                                    <div className="absolute top-0 left-0 h-full bg-green-500 w-1/4 rounded-full"></div>
                                </div>
                                <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400">
                                    <Package size={14} />
                                </div>
                                <div className="flex-1 h-1 bg-gray-100 mx-1 md:mx-2 rounded-full"></div>
                                <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400">
                                    <Package size={14} />
                                </div>
                            </div>
                            <div className="flex justify-between text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 overflow-hidden">
                                <span className="text-green-600 truncate">Ordered</span>
                                <span className="truncate">Shipped</span>
                                <span className="truncate">Delivered</span>
                            </div>
                        </div>
                        <p className="text-[11px] md:text-xs font-bold text-gray-500 mt-6 text-center">
                            Expected Delivery by <span className="text-black">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default OrderDetailsPage;
