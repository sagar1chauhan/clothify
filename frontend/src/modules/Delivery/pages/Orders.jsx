import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiNavigation } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../../shared/components/PageTransition';
import { formatPrice } from '../../../shared/utils/helpers';
import { useOrderStore } from '../../../shared/store/orderStore';
import { useDeliveryAuthStore } from '../store/deliveryStore';
import toast from 'react-hot-toast';

const DeliveryOrders = () => {
  const navigate = useNavigate();
  const { orders: allOrders, getAvailableDeliveryOrders, getDeliveryBoyOrders, assignDeliveryBoy, updateOrderStatus } = useOrderStore();
  const { deliveryBoy } = useDeliveryAuthStore();
  const [filter, setFilter] = useState('all'); // all, available, in-transit, completed
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!deliveryBoy) return;

    let displayOrders = [];
    if (filter === 'all' || filter === 'available') {
      displayOrders = [...displayOrders, ...getAvailableDeliveryOrders()];
    }

    // Also include orders assigned to this delivery boy
    const myOrders = getDeliveryBoyOrders(deliveryBoy.id);
    displayOrders = [...displayOrders, ...myOrders];

    // Filter by status if not 'all'
    if (filter === 'pending' || filter === 'available') {
      displayOrders = displayOrders.filter(o => o.status === 'ready_for_pickup');
    } else if (filter === 'in-transit') {
      displayOrders = displayOrders.filter(o => o.status === 'shipped');
    } else if (filter === 'completed') {
      displayOrders = displayOrders.filter(o => o.status === 'delivered');
    }

    // Remove duplicates
    const uniqueOrders = Array.from(new Set(displayOrders.map(o => o.id)))
      .map(id => displayOrders.find(o => o.id === id));

    setOrders(uniqueOrders);
  }, [filter, allOrders, deliveryBoy, getAvailableDeliveryOrders, getDeliveryBoyOrders]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready_for_pickup':
        return <FiClock className="text-yellow-600" />;
      case 'shipped':
        return <FiNavigation className="text-blue-600" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-600" />;
      case 'cancelled':
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiPackage className="text-gray-600" />;
    }
  };

  const handleAcceptOrder = (orderId) => {
    if (!deliveryBoy) return;
    assignDeliveryBoy(orderId, deliveryBoy);
    toast.success('Order accepted! You can now start delivery.');
  };

  const handleCompleteOrder = (orderId) => {
    updateOrderStatus(orderId, 'delivered');
    toast.success('Order marked as delivered!');
  };

  return (
    <PageTransition>
      <div className="px-4 py-6 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <span className="text-sm text-gray-600">{orders.length} orders</span>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {['all', 'available', 'in-transit', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === tab
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FiPackage className="text-gray-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </motion.div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/delivery/orders/${order.id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(order.status)}
                      <p className="font-bold text-gray-800">{order.id}</p>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{order.customer?.phone || 'No phone'}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status?.replace('_', ' ').replace('-', ' ')}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 mb-3 p-3 bg-gray-50 rounded-xl">
                  <FiMapPin className="text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {typeof order.address === 'string'
                      ? order.address
                      : `${order.address?.address || ''}, ${order.address?.city || ''} ${order.address?.pincode || ''}`}
                  </p>
                </div>

                {/* Order Details */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiPackage />
                      <span>{Array.isArray(order.items) ? order.items.length : (typeof order.items === 'number' ? order.items : 0)} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>{order.estimatedTime || '15-30 min'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiNavigation />
                      <span>{order.distance || '2-5 km'}</span>
                    </div>
                  </div>
                  <p className="font-bold text-primary-600">{formatPrice(order.total || order.amount)}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === 'ready_for_pickup' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOrder(order.id);
                      }}
                      className="flex-1 gradient-green text-white py-2.5 rounded-xl font-semibold text-sm"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteOrder(order.id);
                      }}
                      className="flex-1 gradient-green text-white py-2.5 rounded-xl font-semibold text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/delivery/orders/${order.id}`);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default DeliveryOrders;

