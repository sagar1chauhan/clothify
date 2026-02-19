import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiXCircle,
  FiRotateCw,
  FiShoppingBag,
  FiFileText,
  FiTrash2,
  FiMoreVertical,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/DataTable";
import ExportButton from "../../components/ExportButton";
import Badge from "../../../../shared/components/Badge";
import ConfirmModal from "../../components/ConfirmModal";
import AnimatedSelect from "../../components/AnimatedSelect";
import { formatPrice } from "../../../../shared/utils/helpers";
import { formatCurrency, formatDateTime } from "../../utils/adminHelpers";
import { useOrderStore } from "../../../../shared/store/orderStore";
import toast from "react-hot-toast";

// OrderItemsDropdown component — uses Portal to avoid overflow clipping
const OrderItemsDropdown = ({ items, orderTotal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, openUpward: false, ready: false });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Normalize items
  const normalizedItems = useMemo(() => {
    if (Array.isArray(items)) return items;
    if (typeof items === "number" && items > 0) {
      const avgPrice = orderTotal / items;
      return Array.from({ length: items }, (_, i) => ({
        id: i + 1, name: `Item ${i + 1}`, quantity: 1, price: avgPrice,
      }));
    }
    return [];
  }, [items, orderTotal]);

  // Calculate position
  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      // CRITICAL FIX: Only calculate and show if the button is actually visible in the DOM
      if (buttonRef.current.offsetParent === null) return;

      const updatePosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const dropdownHeight = 400;
        const dropdownWidth = Math.min(windowWidth - 32, 550);

        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        let leftPos = buttonRect.left;
        if (leftPos + dropdownWidth > windowWidth - 16) leftPos = windowWidth - dropdownWidth - 16;
        if (leftPos < 16) leftPos = 16;

        setDropdownPos({
          top: openUpward ? buttonRect.top - 8 : buttonRect.bottom + 8,
          left: leftPos,
          width: dropdownWidth,
          openUpward,
          ready: true
        });
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    } else if (!isOpen) {
      setDropdownPos(prev => ({ ...prev, ready: false }));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  if (normalizedItems.length === 0) return <span className="text-gray-500 font-medium text-sm">No items</span>;

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`flex items-center gap-1.5 font-bold text-sm transition-all px-2 py-1 rounded-md ${isOpen ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50'
          }`}>
        <span>{normalizedItems.length} {normalizedItems.length === 1 ? "item" : "items"}</span>
        {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>

      {isOpen && dropdownPos.ready && ReactDOM.createPortal(
        <AnimatePresence mode="wait">
          <motion.div
            key="items-dropdown"
            ref={dropdownRef}
            initial={{ opacity: 0, y: dropdownPos.openUpward ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[10000] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{
              width: `${dropdownPos.width}px`,
              top: dropdownPos.openUpward ? undefined : `${dropdownPos.top}px`,
              bottom: dropdownPos.openUpward ? `${window.innerHeight - dropdownPos.top}px` : undefined,
              left: `${dropdownPos.left}px`,
              transformOrigin: dropdownPos.openUpward ? "bottom left" : "top left",
            }}>
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm uppercase">Order Items ({normalizedItems.length})</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <FiX size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[350px] scrollbar-admin">
              <table className="w-full">
                <thead className="bg-gray-50/80 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Details</th>
                    <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                    <th className="px-4 py-3 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {normalizedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{item.name || `Item ${idx + 1}`}</span>
                        <span className="text-[10px] font-bold text-gray-400 font-mono">{item.id || item.itemId || idx}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-center font-bold">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-black">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Subtotal</span>
              <span className="text-lg font-black text-gray-900">{formatPrice(orderTotal)}</span>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

// OrderActionsDropdown component — uses Portal to avoid overflow clipping
const OrderActionsDropdown = ({
  order, onOrderDetails, onGenerateInvoice, onOrderTracking, onDeleteOrder, isOpen, onToggle, onClose,
}) => {
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, openUpward: false, ready: false });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      if (buttonRef.current.offsetParent === null) return;

      const updatePosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = 190;
        const dropdownWidth = 190;

        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        setDropdownPos({
          top: openUpward ? buttonRect.top - 8 : buttonRect.bottom + 8,
          left: Math.max(8, buttonRect.right - dropdownWidth),
          openUpward,
          ready: true
        });
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    } else if (!isOpen) {
      setDropdownPos(prev => ({ ...prev, ready: false }));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { label: "Order Details", icon: FiEye, color: "text-blue-600", hoverBg: "hover:bg-blue-50", onClick: () => { if (order?.id) onOrderDetails(order.id); onClose(); } },
    { label: "Generate Invoice", icon: FiFileText, color: "text-green-600", hoverBg: "hover:bg-green-50", onClick: () => { if (order) onGenerateInvoice(order); onClose(); } },
    { label: "Order Tracking", icon: FiTruck, color: "text-indigo-600", hoverBg: "hover:bg-indigo-50", onClick: () => { if (order?.id) onOrderTracking(order.id); onClose(); } },
    { label: "Delete Order", icon: FiTrash2, color: "text-red-600", hoverBg: "hover:bg-red-50", onClick: () => { if (order?.id) onDeleteOrder(order.id); onClose(); } },
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50'}`}
        title="View Details">
        <FiMoreVertical />
      </button>

      {isOpen && dropdownPos.ready && ReactDOM.createPortal(
        <AnimatePresence mode="wait">
          <motion.div
            key="actions-dropdown"
            ref={dropdownRef}
            initial={{ opacity: 0, y: dropdownPos.openUpward ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-[10000] bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[190px] overflow-hidden"
            style={{
              top: dropdownPos.openUpward ? undefined : `${dropdownPos.top}px`,
              bottom: dropdownPos.openUpward ? `${window.innerHeight - dropdownPos.top}px` : undefined,
              left: `${dropdownPos.left}px`,
              transformOrigin: dropdownPos.openUpward ? "bottom right" : "top right",
            }}>
            <div className="py-1.5">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); item.onClick(); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${item.color} ${item.hoverBg}`}>
                    <Icon className="text-base shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const AllOrders = () => {
  const navigate = useNavigate();
  const { orders, deleteOrder } = useOrderStore(); // Use global store
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    orderId: null,
  });

  const orderStats = useMemo(() => {
    const stats = {
      awaiting: 0,
      received: 0,
      processed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      total: orders.length,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase() || "";
      if (status === "pending" || status === "awaiting") stats.awaiting++;
      else if (status === "received") stats.received++;
      else if (status === "processing" || status === "processed") stats.processed++;
      else if (status === "shipped") stats.shipped++;
      else if (status === "delivered") stats.delivered++;
      else if (status === "cancelled" || status === "canceled") stats.cancelled++;
      else if (status === "returned") stats.returned++;
    });

    return stats;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        if (dateRange.startDate && dateRange.endDate) {
          const startDate = new Date(dateRange.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          return orderDate >= startDate && orderDate <= endDate;
        } else if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          startDate.setHours(0, 0, 0, 0);
          return orderDate >= startDate;
        } else if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          return orderDate <= endDate;
        }
        return true;
      });
    }
    return filtered;
  }, [orders, searchQuery, selectedStatus, dateRange]);

  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    const methodMap = {
      card: "Credit Card",
      cod: "Cash on Delivery",
      wallet: "Wallet",
      creditCard: "Credit Card",
      cash: "Cash on Delivery",
    };
    return (
      methodMap[method.toLowerCase()] ||
      method.charAt(0).toUpperCase() + method.slice(1)
    );
  };

  const calculateFinalTotal = (order) => {
    if (order.finalTotal !== undefined) return order.finalTotal;
    const total = order.total || 0;
    const tax = order.tax || 0;
    const discount = order.discount || 0;
    return total + tax - discount;
  };

  const handleOrderDetails = (orderId) => navigate(`/admin/orders/detail/${orderId}`);
  const handleGenerateInvoice = (order) => navigate(`/admin/orders/invoice/${order.id}`);
  const handleOrderTracking = (orderId) => navigate(`/admin/orders/order-tracking?orderId=${orderId}`);
  const handleDeleteOrder = (orderId) => setDeleteModal({ isOpen: true, orderId });

  const confirmDeleteOrder = () => {
    deleteOrder(deleteModal.orderId);
    setDeleteModal({ isOpen: false, orderId: null });
    toast.success("Order deleted successfully");
  };

  const handleDropdownToggle = (orderId) => setOpenDropdownId(openDropdownId === orderId ? null : orderId);
  const handleDropdownClose = () => setOpenDropdownId(null);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      sortable: true,
      render: (value) => (
        <div>
          <p className="font-medium text-gray-800">{value?.name || 'Guest'}</p>
          <p className="text-xs text-gray-500">{value?.email || 'No email'}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (value, row) => (
        <OrderItemsDropdown items={value} orderTotal={row.total || 0} />
      ),
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-800">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "finalTotal",
      label: "Final Total",
      sortable: true,
      render: (value, row) => {
        const finalTotal = calculateFinalTotal(row);
        return (
          <span className="font-bold text-gray-800">
            {formatCurrency(finalTotal)}
          </span>
        );
      },
    },
    {
      key: "paymentMethod",
      label: "Payment",
      sortable: true,
      render: (value) => (
        <span className="text-gray-700 capitalize">
          {formatPaymentMethod(value)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Order Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <OrderActionsDropdown
          order={row}
          onOrderDetails={handleOrderDetails}
          onGenerateInvoice={handleGenerateInvoice}
          onOrderTracking={handleOrderTracking}
          onDeleteOrder={handleDeleteOrder}
          isOpen={openDropdownId === row.id}
          onToggle={() => handleDropdownToggle(row.id)}
          onClose={handleDropdownClose}
        />
      ),
    },
  ];

  const statusCards = [
    { title: "Awaiting", value: orderStats.awaiting, icon: FiClock, bgColor: "bg-gradient-to-br from-yellow-500 to-amber-600", cardBg: "bg-gradient-to-br from-yellow-50 to-amber-50" },
    { title: "Received", value: orderStats.received, icon: FiCheckCircle, bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600", cardBg: "bg-gradient-to-br from-blue-50 to-cyan-50" },
    { title: "Processed", value: orderStats.processed, icon: FiPackage, bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600", cardBg: "bg-gradient-to-br from-indigo-50 to-purple-50" },
    { title: "Shipped", value: orderStats.shipped, icon: FiTruck, bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600", cardBg: "bg-gradient-to-br from-blue-50 to-indigo-50" },
    { title: "Delivered", value: orderStats.delivered, icon: FiCheckCircle, bgColor: "bg-gradient-to-br from-green-500 to-emerald-600", cardBg: "bg-gradient-to-br from-green-50 to-emerald-50" },
    { title: "Cancelled", value: orderStats.cancelled, icon: FiXCircle, bgColor: "bg-gradient-to-br from-red-500 to-rose-600", cardBg: "bg-gradient-to-br from-red-50 to-rose-50" },
    { title: "Returned", value: orderStats.returned, icon: FiRotateCw, bgColor: "bg-gradient-to-br from-orange-500 to-amber-600", cardBg: "bg-gradient-to-br from-orange-50 to-amber-50" },
    { title: "Total Orders", value: orderStats.total, icon: FiShoppingBag, bgColor: "bg-gradient-to-br from-gray-600 to-gray-800", cardBg: "bg-gradient-to-br from-gray-50 to-gray-100" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">All Orders</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage all customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`${card.cardBg} rounded-xl p-3 sm:p-4 shadow-md border-2 border-transparent hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 ${card.bgColor} opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16`}></div>
              <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
                <div className={`${card.bgColor} bg-white/20 p-2 sm:p-2.5 rounded-lg shadow-md`}><Icon className="text-white text-base sm:text-lg" /></div>
              </div>
              <div className="relative z-10">
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-gray-800 text-lg sm:text-xl font-bold">{card.value.toLocaleString()}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 w-full sm:min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by ID, name, or email..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base" />
          </div>
          <AnimatedSelect value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} options={[{ value: "all", label: "All Status" }, { value: "pending", label: "Pending" }, { value: "processing", label: "Processing" }, { value: "shipped", label: "Shipped" }, { value: "delivered", label: "Delivered" }, { value: "cancelled", label: "Cancelled" }]} className="w-full sm:w-auto min-w-[140px]" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <div className="relative flex-1 sm:flex-initial">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} max={dateRange.endDate || undefined} className="w-full sm:w-auto pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base min-w-[140px]" />
              </div>
              <span className="text-gray-500 hidden sm:inline">to</span>
              <div className="relative flex-1 sm:flex-initial">
                <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} min={dateRange.startDate || undefined} className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base min-w-[140px]" />
              </div>
              {(dateRange.startDate || dateRange.endDate) && <button onClick={() => setDateRange({ startDate: "", endDate: "" })} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><FiX className="text-lg" /></button>}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <ExportButton data={filteredOrders} headers={[{ label: "Order ID", accessor: (row) => row.id }, { label: "Customer", accessor: (row) => row.customer?.name }, { label: "Email", accessor: (row) => row.customer?.email }, { label: "Items", accessor: (row) => Array.isArray(row.items) ? row.items.map((item) => `${item.name} (Qty: ${item.quantity})`).join(", ") : `${row.items} items` }, { label: "Total", accessor: (row) => formatCurrency(row.total || 0) }, { label: "Final Total", accessor: (row) => formatCurrency(calculateFinalTotal(row)) }, { label: "Payment", accessor: (row) => formatPaymentMethod(row.paymentMethod) }, { label: "Order Date", accessor: (row) => formatDateTime(row.date) }, { label: "Status", accessor: (row) => row.status }]} filename="all-orders" />
          </div>
        </div>
      </div>

      <DataTable data={filteredOrders} columns={columns} pagination={true} itemsPerPage={10} />
      <ConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, orderId: null })} onConfirm={confirmDeleteOrder} title="Delete Order?" message="Are you sure you want to delete this order? This action cannot be undone." confirmText="Delete" cancelText="Cancel" type="danger" />
    </motion.div>
  );
};

export default AllOrders;
