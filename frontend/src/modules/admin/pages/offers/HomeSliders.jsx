import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/DataTable";
import ConfirmModal from "../../components/ConfirmModal";
import AnimatedSelect from "../../components/AnimatedSelect";
import toast from "react-hot-toast";
import { useBannerStore } from "../../../../shared/store/bannerStore";
import Button from "../../components/Button";

const HomeSliders = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith("/app");
  const { banners, initialize, addBanner, updateBanner, deleteBanner } = useBannerStore();

  const [editingSlider, setEditingSlider] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    initialize();
  }, []);

  const handleSave = (sliderData) => {
    if (editingSlider && editingSlider.id) {
      updateBanner(editingSlider.id, sliderData);
      toast.success("Slider updated");
    } else {
      addBanner(sliderData);
      toast.success("Slider added");
    }
    setEditingSlider(null);
  };

  const handleDelete = () => {
    deleteBanner(deleteModal.id);
    setDeleteModal({ isOpen: false, id: null });
    toast.success("Slider deleted");
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt={row.title}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "https://placehold.co/64x64?text=Image";
            }}
          />
          <span className="font-medium text-gray-800">{row.title}</span>
        </div>
      ),
    },
    {
      key: "link",
      label: "Link",
      sortable: false,
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
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
          className={`px-2 py-1 rounded text-xs font-medium ${value === "active"
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
            onClick={() => setEditingSlider(row)}
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
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Home Sliders
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage homepage banner sliders
          </p>
        </div>
        <Button
          onClick={() =>
            setEditingSlider({
              title: "",
              image: "",
              link: "",
              order: 1,
              status: "active",
              subtitle: "",
              cta: "Shop Now"
            })
          }
          variant="primary"
          icon={FiPlus}
          className="gradient-green border-none">
          Add Slider
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={banners}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      <AnimatePresence>
        {editingSlider !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setEditingSlider(null)}
              className="fixed inset-0 bg-black/50 z-[10000]"
            />

            {/* Modal Content - Mobile: Slide up from bottom, Desktop: Center with scale */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[10000] flex ${isAppRoute ? "items-start pt-[10px]" : "items-end"
                } sm:items-center justify-center p-4 pointer-events-none`}>
              <motion.div
                variants={{
                  hidden: {
                    y: isAppRoute ? "-100%" : "100%",
                    scale: 0.95,
                    opacity: 0,
                  },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      damping: 22,
                      stiffness: 350,
                      mass: 0.7,
                    },
                  },
                  exit: {
                    y: isAppRoute ? "-100%" : "100%",
                    scale: 0.95,
                    opacity: 0,
                    transition: {
                      type: "spring",
                      damping: 30,
                      stiffness: 400,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className={`bg-white ${isAppRoute ? "rounded-b-3xl" : "rounded-t-3xl"
                  } sm:rounded-xl shadow-xl p-6 max-w-md w-full pointer-events-auto overflow-y-auto max-h-[90vh] shadow-2xl`}
                style={{ willChange: "transform" }}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {editingSlider.id ? "Edit Slider" : "Add Slider"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleSave({
                      title: formData.get("title"),
                      image: formData.get("image"),
                      link: formData.get("link"),
                      order: parseInt(formData.get("order")),
                      status: formData.get("status"),
                      subtitle: formData.get("subtitle"),
                      cta: formData.get("cta")
                    });
                  }}
                  className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Slider Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingSlider.title || ""}
                      placeholder="e.g. Summer Collection"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      defaultValue={editingSlider.subtitle || ""}
                      placeholder="e.g. Get 70% off"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Button Text (CTA)</label>
                    <input
                      type="text"
                      name="cta"
                      defaultValue={editingSlider.cta || "Shop Now"}
                      placeholder="Shop Now"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      defaultValue={editingSlider.image || ""}
                      placeholder="https://..."
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Redirect Link</label>
                    <input
                      type="text"
                      name="link"
                      defaultValue={editingSlider.link || ""}
                      placeholder="e.g. /category/summer"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Display Order</label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingSlider.order || 1}
                        placeholder="Order"
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Status</label>
                      <AnimatedSelect
                        name="status"
                        value={editingSlider.status || "active"}
                        onChange={(e) =>
                          setEditingSlider({
                            ...editingSlider,
                            status: e.target.value,
                          })
                        }
                        options={[
                          { value: "active", label: "Active" },
                          { value: "inactive", label: "Inactive" },
                        ]}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditingSlider(null)}
                      className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1">
                      {editingSlider?.id ? "Update" : "Add"}
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
        title="Delete Slider?"
        message="Are you sure you want to delete this slider? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default HomeSliders;
