import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import MyShop from "./pages/MyShop";
import AddProduct from "./pages/AddProduct";

import Products from "./pages/Products";
import OpenShop from "./pages/OpenShop";

import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Withdraw from "./pages/Withdraw";
import PendingOrders from "./pages/PendingOrders";
import PaidOrders from "./pages/PaidOrders";
import ShippingOrders from "./pages/ShippingOrders";
import CompletedOrders from "./pages/CompletedOrders";
import Transactions from "./pages/Transactions";
import BankAccount from "./pages/BankAccount";
import Address from "./pages/Address";
import WithdrawHistory from "./pages/WithdrawHistory";
import DepositHistory from "./pages/DepositHistory";
import SettingsPage from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import ProfileImage from "./pages/ProfileImage";
import PaymentPassword from "./pages/PaymentPassword";
import Deposit from "./pages/Deposit";
import Support from "./pages/Support";
import ProfileInfo from "./pages/ProfileInfo";
import KYC from "./pages/KYC";







import AdminShops from "./pages/admin/AdminShops";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminReports from "./pages/admin/AdminReports";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminKYC from "./pages/admin/AdminKYC";
import AdminDeposits
from "./pages/admin/AdminDeposits";
import AdminLogin from "./pages/admin/AdminLogin";





function App() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const admin = JSON.parse(
  localStorage.getItem("admin")
);

  return (
    <Routes>

      {/* เปิดเว็บครั้งแรก */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to="/home" />
            : <Navigate to="/login" />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      {/* Home */}
      <Route
        path="/home"
        element={
          user
            ? <Home />
            : <Navigate to="/login" />
        }
      />

       <Route
  path="/cart"
  element={
    user
      ? <Cart />
      : <Navigate to="/login" />
  }
/>

      {/* Profile */}
      <Route
        path="/profile"
        element={
          user
            ? <Profile />
            : <Navigate to="/login" />
        }
      />

      {/* หน้าไม่พบ */}
      <Route
        path="*"
        element={<Navigate to="/" />}
      />

      


      <Route
  path="/add-product"
  element={<AddProduct />}
/>


<Route
  path="/products"
  element={<Products />}
/>


<Route
  path="/open-shop"
  element={<OpenShop />}
/>

<Route
  path="/orders"
  element={<Orders />}
/>

<Route
  path="/checkout"
  element={<Checkout />}
/>

<Route
  path="/my-shop"
  element={<MyShop />}
/>

<Route
  path="/my-orders"
  element={<MyOrders />}
/>

<Route
  path="/withdraw"
  element={<Withdraw />}
/>

<Route
  path="/pending-orders"
  element={<PendingOrders />}
/>

<Route
  path="/paid-orders"
  element={<PaidOrders />}
/>

<Route
  path="/shipping-orders"
  element={<ShippingOrders />}
/>

<Route
  path="/completed-orders"
  element={<CompletedOrders />}
/>

<Route
  path="/transactions"
  element={<Transactions />}
/>

<Route
  path="/bank-account"
  element={<BankAccount />}
/>

<Route
  path="/address"
  element={<Address />}
/>

<Route
  path="/withdraw-history"
  element={<WithdrawHistory />}
/>

<Route
  path="/deposit-history"
  element={<DepositHistory />}
/>


<Route
  path="/settings"
  element={<SettingsPage />}
/>

<Route
  path="/change-password"
  element={<ChangePassword />}
/>

<Route
  path="/profile-image"
  element={<ProfileImage />}
/>

<Route
  path="/payment-password"
  element={<PaymentPassword />}
/>

<Route
  path="/deposit"
  element={<Deposit />}
/>

<Route
  path="/support"
  element={<Support />}
/>

<Route
  path="/profile-info"
  element={<ProfileInfo />}
/>

<Route
  path="/kyc"
  element={<KYC />}
/>












<Route
  path="/admin"
  element={
    admin
      ? <AdminDashboard />
      : <Navigate to="/admin-login" />
  }
/>



<Route
  path="/admin/users"
  element={
    admin
      ? <AdminUsers />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin/shops"
  element={
    admin
      ? <AdminShops />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin/orders"
  element={
    admin
      ? <AdminOrders />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin/withdrawals"
  element={
    admin
      ? <AdminWithdrawals />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin/products"
  element={
    admin
      ? <AdminProducts />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin/reports"
  element={
    admin
      ? <AdminReports />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin/deposits"
  element={
    admin
      ? <AdminDeposits />
      : <Navigate to="/admin-login" />
  }
/>

<Route
  path="/admin-kyc"
  element={
    admin
      ? <AdminKYC />
      : <Navigate to="/admin-login" />
  }
/>






    </Routes>
  );
}

export default App;