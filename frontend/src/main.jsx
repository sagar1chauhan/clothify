import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './modules/user/context/CartContext.jsx'
import { AuthProvider } from './modules/user/context/AuthContext.jsx'
import { CategoryProvider } from './modules/user/context/CategoryContext.jsx'
import { WishlistProvider } from './modules/user/context/WishlistContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <CategoryProvider>
              <App />
            </CategoryProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
