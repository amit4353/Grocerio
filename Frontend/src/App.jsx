import { Toaster } from "react-hot-toast"
import './index.css'
import Home from "./users/pages/Home"
import Register from './users/pages/Register'
import Login from "./users/pages/Login"
import Cart from './users/pages/Cart'
import PageNotFound from "./users/pages/PageNotFound"
import ProductDetails from "./users/pages/ProductDetails"
import { useState } from "react"
import { getCart } from "./services/cartServices"
import { useEffect } from "react"
import LandingIntro from "./components/LandingPage"
import { Route, Routes } from "react-router-dom"
import Orders from "./users/pages/Orders"
import AdminRoute from "./components/AdminRoute"
import Dashboard from "./admin/pages/Dashboard"
import UserLayout from "./users/layout/UserLayout"
import AdminLayout from "./admin/layout/AdminLayout"
import Products from "./admin/pages/Products"
import AddProducts from "./admin/pages/AddProducts"
import AllOrders from "./admin/pages/AllOrders"
import UserProfile from "./users/pages/UserProfile"
import EditProfile from "./users/pages/EditProfile"
import ChangePassword from "./users/pages/ChangePassword"
import EditProducts from "./admin/pages/EditProducts"
import UserOrders from "./admin/pages/UserOrders"
import RecentOrders from "./admin/pages/RecentOrders"
import CancelledOrders from "./admin/pages/CancelledOrders"
import Users from "./admin/pages/Users"

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    loadCart();
    window.scrollTo(0, 0);
  },[]);

  const loadCart = async() => {
    const data = await getCart();
    setCartItems(data);
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          marginBottom: "50px",   // niche shift
          marginRight: "50px"     // right se thoda gap
        }
      }}/>
      {showIntro ? (
        <LandingIntro onComplete={() => setShowIntro(false)} />
      ) : (
        <>
          <Routes>

            {/* Users route only */}
            <Route element={<UserLayout cartCount={cartItems.length || 0} />} >

              <Route path="/" element={<Home loadCart={loadCart} />} />
              <Route path="/cart" element={<Cart loadCart={loadCart} />} />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/profile" element={<UserProfile/>} />
              <Route path="/users/update" element={<EditProfile /> } />
              <Route path="/users/update/password" element={<ChangePassword /> }/>
              <Route path="/users/register" element={<Register />} />
              <Route path="/products/:id" element={<ProductDetails loadCart={loadCart} />} />
              <Route path="/orders" element={<Orders />}/>
            </Route>

            {/* Admin routes only  */}
            <Route element={<AdminRoute> <AdminLayout /> </AdminRoute>} >
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/profile" element={<UserProfile/>} />
              <Route path="/admin/update/password" element={<ChangePassword /> }/>
              <Route path="/admin/users" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProducts />} />
              <Route path="/products/update/:id" element={<EditProducts />} />
              <Route path="/admin/orders/users/order" element={<AllOrders />} />
              <Route path="/admin/orders/recent-orders" element={<RecentOrders />} />
              <Route path="/admin/orders/cancelled-orders" element={<CancelledOrders />} />
              <Route path="/admin/orders/:id" element={<UserOrders /> } />
            </Route>


            {/* Page not found route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;