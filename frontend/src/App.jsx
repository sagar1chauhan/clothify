import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './modules/user/components/Header/Header';
import Footer from './modules/user/components/Footer/Footer';
import BottomNav from './modules/user/components/Navigation/BottomNav';
import HomePage from './modules/user/pages/Home/HomePage';
import ShopPage from './modules/user/pages/Shop/ShopPage';
import ProductDetailsPage from './modules/user/pages/Product/ProductDetailsPage';
import CartPage from './modules/user/pages/Cart/CartPage';
import AccountPage from './modules/user/pages/Profile/AccountPage';
import LegalPage from './modules/user/pages/Profile/LegalPage';
import ProfilePage from './modules/user/pages/Profile/ProfilePage';
import OrdersPage from './modules/user/pages/Orders/OrdersPage';
import OffersPage from './modules/user/pages/Offers/OffersPage';
import AddressesPage from './modules/user/pages/Addresses/AddressesPage';
import ReferPage from './modules/user/pages/Refer/ReferPage';
import EventsPage from './modules/user/pages/Events/EventsPage';
import ProductsPage from './modules/user/pages/Products/ProductsPage';
import WishlistPage from './modules/user/pages/Wishlist/WishlistPage';
import LoginPage from './modules/user/pages/Auth/LoginPage';
import CheckoutPage from './modules/user/pages/Checkout/CheckoutPage';
import AdminRoutes from './modules/admin/AdminRoutes';

function App() {
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const accountRoutes = ['/profile', '/orders', '/offers', '/addresses', '/refer', '/events'];
  const isAccountDetail = accountRoutes.includes(location.pathname) || location.pathname.startsWith('/legal/');
  const isAdmin = location.pathname.startsWith('/admin');

  // Hide global nav on Login, Checkout, Account Detail (Mobile), OR ADMIN pages
  const hideNav = location.pathname === '/login' ||
    location.pathname === '/checkout' ||
    isAdmin ||
    (isAccountDetail && isMobile);

  return (
    <div className={`min-h-screen flex flex-col font-main ${isAdmin ? 'bg-gray-50' : 'bg-[#fafafa]'}`}>
      {!hideNav && <Header />}
      <main
        key={location.pathname}
        className={`flex-1 ${(!hideNav || (isAccountDetail && !isMobile)) ? 'pb-[60px] md:pb-0' : ''} animate-fadeInUp`}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/legal/:pageId" element={<LegalPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/refer" element={<ReferPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Admin Module Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </main>
      {!hideNav && <Footer />}
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default App;
