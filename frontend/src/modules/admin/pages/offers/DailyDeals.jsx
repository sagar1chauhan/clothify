import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/DataTable";
import ConfirmModal from "../../components/ConfirmModal";
import AnimatedSelect from "../../components/AnimatedSelect";
import toast from "react-hot-toast";
import { useDealsStore } from "../../../../shared/store/dealsStore";
import Button from "../../components/Button";

const DailyDeals = () => {
    const location = useLocation();
    const isAppRoute = location.pathname.startsWith("/app");
    const { deals, initialize, addDeal, updateDeal, deleteDeal } = useDealsStore();

    const [editingDeal, setEditingDeal] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    useEffect(() => {
        initialize();
    }, []);

    const handleSave = (dealData) => {
        if (editingDeal && editingDeal.id) {
            updateDeal(editingDeal.id, dealData);
            toast.success("Deal updated");
        } else {
            addDeal(dealData);
            toast.success("Deal added");
        }
        setEditingDeal(null);
    };

    const handleDelete = () => {
        deleteDeal(deleteModal.id);
        setDeleteModal({ isOpen: false, id: null });
        toast.success("Deal deleted");
    };

    const columns = [
        {
            key: "image",
            label: "Visual",
            sortable: false,
            render: (value) => (
                <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 relative group cursor-pointer shadow-sm">
                    {value ? (
                        <img src={value} alt="Deal" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiImage size={20} />
                        </div>
                    )}
                </div>
            )
        },
        {
            key: "name",
            label: "Brand/Name",
            sortable: true,
            render: (value, row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 uppercase tracking-tight">{value}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{row.promo}</span>
                </div>
            )
        },
        {
            key: "promo",
            label: "Offer Text",
            sortable: false,
        },
        {
            key: "bg",
            label: "Style",
            sortable: false,
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded border ${value}`} />
                    <span className="text-xs text-gray-500 font-mono">{value}</span>
                </div>
            )
        },
        {
            key: "order",
            label: "Order",
            sortable: true,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <span
                    className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${value === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}>
                    {value}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditingDeal(row)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit />
                    </button>
                    <button
                        onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">
                        Deal of the Day
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Manage daily brand offers and discounts
                    </p>
                </div>
                <Button
                    onClick={() =>
                        setEditingDeal({
                            name: "",
                            promo: "",
                            image: "",
                            bg: "bg-[#f8f8f8]",
                            order: deals.length + 1,
                            status: "active",
                        })
                    }
                    variant="primary"
                    icon={FiPlus}
                    className="gradient-green border-none">
                    Add New Deal
                </Button>
            </div>

            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100">
                <DataTable
                    data={deals}
                    columns={columns}
                    pagination={true}
                    itemsPerPage={10}
                />
            </div>

            <AnimatePresence>
                {editingDeal !== null && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingDeal(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[32px] shadow-2xl p-8 max-w-lg w-full pointer-events-auto overflow-y-auto max-h-[90vh]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                                        {editingDeal.id ? "Edit Deal" : "New Daily Deal"}
                                    </h3>
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        handleSave({
                                            name: formData.get("name"),
                                            promo: formData.get("promo"),
                                            image: formData.get("image"),
                                            bg: editingDeal.bg,
                                            order: parseInt(formData.get("order")),
                                            status: editingDeal.status,
                                        });
                                    }}
                                    className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand/Deal Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={editingDeal.name}
                                            placeholder="e.g. SNITCH or Jewellery"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Offer Tagline</label>
                                        <input
                                            type="text"
                                            name="promo"
                                            defaultValue={editingDeal.promo}
                                            placeholder="e.g. STARTS ₹799 or UPTO 80% OFF"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                                        <input
                                            type="url"
                                            name="image"
                                            defaultValue={editingDeal.image}
                                            placeholder="https://example.com/image.jpg"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Background Style</label>
                                            <AnimatedSelect
                                                name="bg"
                                                value={editingDeal.bg}
                                                onChange={(e) => setEditingDeal({ ...editingDeal, bg: e.target.value })}
                                                options={[
                                                    { value: "bg-[#f8f8f8]", label: "Neutral Grey" },
                                                    { value: "bg-[#fff0f3]", label: "Modern Pink" },
                                                    { value: "bg-[#fff9eb]", label: "Luxury Cream" },
                                                    { value: "bg-[#f0f9ff]", label: "Electric Blue" },
                                                    { value: "bg-[#fdf2ff]", label: "Elegant Purple" },
                                                    { value: "bg-[#ecfdf5]", label: "Fresh Green" },
                                                ]}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Position Order</label>
                                            <input
                                                type="number"
                                                name="order"
                                                defaultValue={editingDeal.order}
                                                required
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visibility Status</label>
                                        <AnimatedSelect
                                            name="status"
                                            value={editingDeal.status}
                                            onChange={(e) => setEditingDeal({ ...editingDeal, status: e.target.value })}
                                            options={[
                                                { value: "active", label: "PUBLIC (Visible)" },
                                                { value: "inactive", label: "PRIVATE (Hidden)" },
                                            ]}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-50">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setEditingDeal(null)}
                                            className="flex-1 py-4">
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="flex-1 py-4">
                                            {editingDeal.id ? "Save Changes" : "Create Deal"}
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
                title="Remove Deal?"
                message="This will permanently delete this deal from the homepage grid."
                confirmText="Yes, Delete"
                cancelText="Keep it"
                type="danger"
            />
        </motion.div>
    );
};

export default DailyDeals;
