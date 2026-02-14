import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMapPin, FiPhone } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../../components/DataTable';
import Badge from '../../../../shared/components/Badge';
import ConfirmModal from '../../components/ConfirmModal';
import AnimatedSelect from '../../components/AnimatedSelect';
import toast from 'react-hot-toast';

import Button from '../../components/Button';

const DeliveryBoys = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const [deliveryBoys, setDeliveryBoys] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St, New York, NY 10001',
      vehicleType: 'Bike',
      vehicleNumber: 'BIKE-123',
      status: 'active',
      totalDeliveries: 150,
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+1234567891',
      email: 'jane@example.com',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      vehicleType: 'Car',
      vehicleNumber: 'CAR-456',
      status: 'active',
      totalDeliveries: 200,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      phone: '+1234567892',
      email: 'bob@example.com',
      address: '789 Pine Rd, Chicago, IL 60601',
      vehicleType: 'Bike',
      vehicleNumber: 'BIKE-789',
      status: 'inactive',
      totalDeliveries: 75,
      rating: 4.2,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBoy, setEditingBoy] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const filteredBoys = deliveryBoys.filter((boy) => {
    const matchesSearch =
      !searchQuery ||
      boy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boy.phone.includes(searchQuery) ||
      boy.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (boy.address && boy.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || boy.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSave = (boyData) => {
    if (editingBoy && editingBoy.id) {
      setDeliveryBoys(deliveryBoys.map((b) => (b.id === editingBoy.id ? { ...boyData, id: editingBoy.id } : b)));
      toast.success('Delivery boy updated');
    } else {
      const newId = deliveryBoys.length > 0 ? Math.max(...deliveryBoys.map(b => b.id)) + 1 : 1;
      setDeliveryBoys([...deliveryBoys, { ...boyData, id: newId }]);
      toast.success('Delivery boy added');
    }
    setEditingBoy(null);
  };

  const handleDelete = () => {
    setDeliveryBoys(deliveryBoys.filter((b) => b.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
    toast.success('Delivery boy deleted');
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Mobile No',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <FiPhone className="text-gray-500 text-sm" />
          <span className="text-gray-800">{value}</span>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (value) => (
        <div className="flex items-start gap-2 max-w-xs">
          <FiMapPin className="text-gray-500 text-sm mt-0.5 flex-shrink-0" />
          <span className="text-gray-800 text-sm break-words">{value || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'vehicleType',
      label: 'Vehicle',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.vehicleNumber}</p>
        </div>
      ),
    },
    {
      key: 'totalDeliveries',
      label: 'Deliveries',
      sortable: true,
      render: (value) => <span className="text-gray-800">{value}</span>,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-800">{value} ⭐</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value === 'active' ? 'success' : 'error'}>{value}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingBoy(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Delivery Boys</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage delivery personnel</p>
        </div>
        <Button
          onClick={() => setEditingBoy({ name: '', phone: '', email: '', address: '', vehicleType: 'Bike', vehicleNumber: '', status: 'active', totalDeliveries: 0, rating: 0 })}
          variant="primary"
          icon={FiPlus}
          className="gradient-green border-none"
        >
          Add Delivery Boy
        </Button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, or address..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <AnimatedSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            className="min-w-[140px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredBoys}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      <AnimatePresence>
        {editingBoy !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setEditingBoy(null)}
              className="fixed inset-0 bg-black/50 z-[10000]"
            />

            {/* Modal Content - Mobile: Slide up from bottom, Desktop: Center with scale */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[10000] flex ${isAppRoute ? 'items-start pt-[10px]' : 'items-end'} sm:items-center justify-center p-4 pointer-events-none`}
            >
              <motion.div
                variants={{
                  hidden: {
                    y: isAppRoute ? '-100%' : '100%',
                    scale: 0.95,
                    opacity: 0
                  },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      damping: 22,
                      stiffness: 350,
                      mass: 0.7
                    }
                  },
                  exit: {
                    y: isAppRoute ? '-100%' : '100%',
                    scale: 0.95,
                    opacity: 0,
                    transition: {
                      type: 'spring',
                      damping: 30,
                      stiffness: 400
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className={`bg-white ${isAppRoute ? 'rounded-b-3xl' : 'rounded-t-3xl'} sm:rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto`}
                style={{ willChange: 'transform' }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {editingBoy.id ? 'Edit Delivery Boy' : 'Add Delivery Boy'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const updatedData = {
                      ...editingBoy,
                      name: formData.get('name'),
                      phone: formData.get('phone'),
                      email: formData.get('email'),
                      address: formData.get('address'),
                      vehicleType: formData.get('vehicleType'),
                      vehicleNumber: formData.get('vehicleNumber'),
                      status: formData.get('status'),
                    };
                    handleSave(updatedData);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingBoy.name || ''}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={editingBoy.phone || ''}
                      placeholder="+1234567890"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingBoy.email || ''}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      defaultValue={editingBoy.address || ''}
                      placeholder="123 Main St, City, State"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Vehicle Type</label>
                    <AnimatedSelect
                      name="vehicleType"
                      value={editingBoy.vehicleType || 'Bike'}
                      onChange={(e) => setEditingBoy({ ...editingBoy, vehicleType: e.target.value })}
                      options={[
                        { value: 'Bike', label: 'Bike' },
                        { value: 'Car', label: 'Car' },
                        { value: 'Scooter', label: 'Scooter' },
                      ]}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Vehicle Plate Number</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      defaultValue={editingBoy.vehicleNumber || ''}
                      placeholder="BIKE-123"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Account Status</label>
                    <AnimatedSelect
                      name="status"
                      value={editingBoy.status || 'active'}
                      onChange={(e) => setEditingBoy({ ...editingBoy, status: e.target.value })}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditingBoy(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                    >
                      {editingBoy?.id ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Delivery Boy?"
        message="Are you sure you want to delete this delivery boy? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default DeliveryBoys;

