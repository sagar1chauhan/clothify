import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './modules/user/components/Header/Header';
import Footer from './modules/user/components/Footer/Footer';
import BottomNav from './modules/user/components/Navigation/BottomNav';
import AppRoutes from './routes/AppRoutes';
import LocationModal from './modules/user/components/Header/LocationModal';
import { useLocation as useUserLocation } from './modules/user/context/LocationContext';

function App() {
  const location = useLocation();
  const { activeAddress } = useUserLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const accountRoutes = ['/profile', '/orders', '/offers', '/addresses', '/refer', '/events'];
  const isAccountDetail = accountRoutes.includes(location.pathname) || location.pathname.startsWith('/legal/');
  const isAdmin = location.pathname.startsWith('/admin');
  const isVendor = location.pathname.startsWith('/vendor');
  const isDelivery = location.pathname.startsWith('/delivery');
  const isModulePath = isAdmin || isVendor || isDelivery;

  // Hide global nav on Login, Checkout, Account Detail (Mobile), OR MODULE pages
  const isProductDetail = location.pathname.startsWith('/product/');
  const hideNav = location.pathname === '/login' ||
    location.pathname === '/checkout' ||
    isModulePath ||
    (isAccountDetail && isMobile) ||
    location.pathname === '/products' ||
    location.pathname === '/cart' ||
    location.pathname === '/payment' ||
    location.pathname.startsWith('/order-success') ||
    location.pathname.startsWith('/track-order');

  const hideHeader = hideNav || isProductDetail || location.pathname === '/wishlist';
  const hideFooter = hideNav || isProductDetail || location.pathname === '/wishlist';

  // Check if we need to force location selection
  // Exempt authentication pages and module pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password'; // Basic auth pages
  const showMandatoryLocation = !activeAddress && !isModulePath && !isAuthPage;

  return (
    <div className={`min-h-screen flex flex-col font-main ${isModulePath ? 'bg-gray-50' : 'bg-[#fafafa]'}`}>
      {!hideHeader && <Header />}

      {/* Mandatory Location Modal */}
      <LocationModal
        isOpen={showMandatoryLocation}
        onClose={() => { }}
        isMandatory={true}
      />

      <main
        key={isModulePath ? 'module-root' : location.pathname}
        className={`flex-1 ${(!hideNav || (isAccountDetail && !isMobile)) ? 'pb-[60px] md:pb-0' : ''}`}
      >
        <AppRoutes />
      </main>
      {!hideFooter && <Footer />}
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default App;
