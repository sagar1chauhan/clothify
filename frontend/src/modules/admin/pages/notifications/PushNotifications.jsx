import { useState } from 'react';
import { FiSend, FiBell, FiTarget } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AnimatedSelect from '../../components/AnimatedSelect';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

const PushNotifications = () => {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all',
    schedule: 'now',
    scheduledDate: '',
  });

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Push notification sent successfully');
    setFormData({ title: '', message: '', target: 'all', schedule: 'now', scheduledDate: '' });
    setIsSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Push Notifications</h1>
          <p className="text-sm sm:text-base text-gray-600">Send push notifications to all or specific users</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">
              <FiBell className="inline mr-1" /> Notification Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. New Summer Collection is here!"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Message Content</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter the notification message details..."
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">
                <FiTarget className="inline mr-1" /> Target Audience
              </label>
              <AnimatedSelect
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                options={[
                  { value: 'all', label: 'All Users' },
                  { value: 'customers', label: 'Customers Only' },
                  { value: 'vip', label: 'VIP Customers' },
                  { value: 'delivery-boy', label: 'Delivery boy' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Schedule</label>
              <AnimatedSelect
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                options={[
                  { value: 'now', label: 'Send Now' },
                  { value: 'scheduled', label: 'Schedule Later' },
                ]}
              />
            </div>
          </div>

          {formData.schedule === 'scheduled' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required={formData.schedule === 'scheduled'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              />
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              icon={FiSend}
              isLoading={isSending}
              className="w-full sm:w-auto px-10 py-4 h-auto text-lg gradient-green border-none shadow-lg hover:shadow-glow-green"
            >
              {isSending ? 'Sending Notification...' : 'Send Notification'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PushNotifications;
