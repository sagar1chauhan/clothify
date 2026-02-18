import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const VendorVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [codes, setCodes] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const email = location.state?.email || 'your email';

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 4 && /^\d+$/.test(pastedData)) {
      const newCodes = pastedData.split('');
      setCodes(newCodes);
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = codes.join('');

    if (verificationCode.length !== 4) {
      toast.error('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Email verified successfully!');
      navigate('/vendor/login');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    toast.success('New verification code sent to your email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 gradient-green rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-green animate-pulse">
            <FiMail className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 4-digit security code to <br />
            <span className="font-bold text-gray-900 break-all">{email}</span>
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Code Inputs */}
          <div className="flex justify-center gap-4">
            {codes.map((code, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-18 sm:w-16 sm:h-20 text-center text-3xl font-black bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary-500 text-gray-800 shadow-sm transition-all focus:scale-105"
              />
            ))}
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-bold transition-colors bg-primary-50 rounded-full border border-primary-100"
            >
              Didn't receive the code? <span className="underline">Resend</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || codes.some(code => !code)}
            className="w-full py-4 gradient-green text-white rounded-2xl font-bold hover:shadow-glow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary-500/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <>
                <FiCheck className="text-xl" />
                Verify Identity
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center pt-2">
            <Link
              to="/vendor/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-bold transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorVerification;

