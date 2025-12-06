import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import Cart from '@/pages/Cart';
import Payment from '@/pages/Payment';
import Orders from '@/pages/Orders';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Checkout from '@/pages/Checkout';
import OrderDetails from '@/pages/OrderDetails';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Layout from '@/components/layout/Layout';

// Layout wrapper component
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - Without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main Routes - With Layout */}
        <Route element={<LayoutWrapper />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Catch-all: Redirect unknown routes to home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

