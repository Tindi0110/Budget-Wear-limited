import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { CustomerLayout } from './components/CustomerLayout';
import { Homepage } from './pages/customer/Homepage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProductListing } from './pages/customer/ProductListing';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminStaff } from './pages/admin/Staff';

// Temporary placeholders for structure
const NotFound = () => <div className="p-8 text-2xl font-bold text-red-600">404 Not Found</div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Homepage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="products" element={<ProductListing />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="staff" element={<AdminStaff />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
