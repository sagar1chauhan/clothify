import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BottomNav from './components/Navigation/BottomNav';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailsPage from './pages/Product/ProductDetailsPage';
import CartPage from './pages/Cart/CartPage';
import AccountPage from './pages/Profile/AccountPage';
import LegalPage from './pages/Profile/LegalPage';
import ProfilePage from './pages/Profile/ProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import OffersPage from './pages/Offers/OffersPage';
import AddressesPage from './pages/Addresses/AddressesPage';
import ReferPage from './pages/Refer/ReferPage';
import EventsPage from './pages/Events/EventsPage';
import ProductsPage from './pages/Products/ProductsPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import LoginPage from './pages/Auth/LoginPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';

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

  // Hide global nav on Login, Checkout, OR Account Detail pages on Mobile
  const hideNav = location.pathname === '/login' ||
    location.pathname === '/checkout' ||
    (isAccountDetail && isMobile);

  return (
    <div className="min-h-screen flex flex-col font-main bg-[#fafafa]">
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
        </Routes>
      </main>
      {!hideNav && <Footer />}
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default App;
