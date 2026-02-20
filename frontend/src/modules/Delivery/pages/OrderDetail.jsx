import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiClock,
  FiPackage,
  FiNavigation,
  FiCheckCircle,
  FiUser,
  FiTrendingUp,
} from 'react-icons/fi';
import PageTransition from '../../../shared/components/PageTransition';
import { formatPrice } from '../../../shared/utils/helpers';
import toast from 'react-hot-toast';
import { useOrderStore } from '../../../shared/store/orderStore';
import { useDeliveryAuthStore } from '../store/deliveryStore';
import GoogleMapsTracking from '../components/Tracking/GoogleMapsTracking';


const DeliveryOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, assignDeliveryBoy, orders: allOrders } = useOrderStore();
  const { deliveryBoy } = useDeliveryAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundOrder = getOrderById(id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setLoading(false);
    }
  }, [id, allOrders, getOrderById]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptOrder = () => {
    if (!deliveryBoy) return;
    assignDeliveryBoy(id, deliveryBoy);
    toast.success('Order accepted! Map location is now available.');
  };

  const handleCompleteOrder = () => {
    updateOrderStatus(id, 'delivered');
    toast.success('Order delivered!');
  };

  const openInGoogleMaps = () => {
    const { latitude, longitude } = order;

    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    if (isAndroid) {
      // Android: Use intent URL (opens Google Maps app if installed, otherwise web)
      const intentUrl = `intent://maps.google.com/maps?daddr=${latitude},${longitude}&directionsmode=driving#Intent;scheme=https;package=com.google.android.apps.maps;end`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      // iOS: Try Google Maps app URL scheme first
      const appUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
      // Universal link as fallback (opens app if installed, otherwise web)
      const universalUrl = `https://maps.google.com/maps?daddr=${latitude},${longitude}&directionsmode=driving`;

      // Try app URL
      const link = document.createElement('a');
      link.href = appUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Fallback to universal link after brief delay
      setTimeout(() => {
        window.location.href = universalUrl;
      }, 400);
    } else {
      // Desktop: Use web version
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(webUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition>
        <div className="px-4 py-6 text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/delivery/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiArrowLeft className="text-xl text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{order.id}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
              {order.status?.replace('_', ' ')?.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiUser />
            Customer Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold">{order.customer?.name || 'Guest'}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiPhone />
              <a href={`tel:${order.customer?.phone}`} className="hover:text-primary-600">
                {order.customer?.phone || 'No phone'}
              </a>
            </div>
            <p className="text-sm text-gray-600">{order.customer?.email || 'No email'}</p>
          </div>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiMapPin />
            Delivery Address
          </h2>
          <p className="text-gray-700 mb-3">
            {typeof order.address === 'string'
              ? order.address
              : `${order.address?.address || ''}, ${order.address?.city || ''} ${order.address?.pincode || ''}`}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiNavigation />
              <span>{order.distance || '2-5 km'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock />
              <span>{order.estimatedTime || '15-30 min'}</span>
            </div>
          </div>
          {order.instructions && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Instructions: </span>
                {order.instructions}
              </p>
            </div>
          )}
        </motion.div>

        {/* Map - Show when order is accepted */}
        {console.log('Order Status:', order.status)}
        {(order.status === 'shipped' || order.status === 'delivered') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FiMapPin className="text-primary-600" />
              Delivery Tracking (Debug: Component Rendered)
            </h2>
            <GoogleMapsTracking
              customerLocation={{
                lat: parseFloat(order.latitude || order.address?.latitude || 40.7128),
                lng: parseFloat(order.longitude || order.address?.longitude || -74.006)
              }}
              storeLocation={{
                lat: parseFloat(order.pickupLatitude || 40.7306),
                lng: parseFloat(order.pickupLongitude || -73.9352)
              }}
              deliveryLocation={null} // Set to current GPS location when available
              isTracking={order.status === 'shipped'}
              showRoute={true}
              routeOrigin={{
                lat: parseFloat(order.pickupLatitude || 40.7306),
                lng: parseFloat(order.pickupLongitude || -73.9352)
              }}
              routeDestination={{
                lat: parseFloat(order.latitude || order.address?.latitude || 40.7128),
                lng: parseFloat(order.longitude || order.address?.longitude || -74.006)
              }}
              destinationName={order.customer?.name}
            />
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiPackage />
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-800">{formatPrice(item.discountedPrice || item.price)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiTrendingUp />
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatPrice(order.total || order.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>{formatPrice(order.deliveryFee || 0)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-primary-600 text-lg">{formatPrice(order.total || order.amount)}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 pt-4"
        >
          {order.status === 'ready_for_pickup' && (
            <button
              onClick={handleAcceptOrder}
              className="w-full gradient-green text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              <FiCheckCircle />
              Accept Order
            </button>
          )}
          {order.status === 'shipped' && (
            <button
              onClick={handleCompleteOrder}
              className="w-full gradient-green text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              <FiCheckCircle />
              Mark as Delivered
            </button>
          )}
          <button
            onClick={() => window.open(`tel:${order.customer?.phone}`, '_self')}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-200"
          >
            <FiPhone />
            Call Customer
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default DeliveryOrderDetail;



