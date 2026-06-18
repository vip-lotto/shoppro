import BottomNav from "../components/BottomNav";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";


import {
  Wallet,
  ArrowDownCircle,
  Receipt,
  Store,
  Headphones,
  Lock,
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  Settings,
} from "lucide-react";

const logout = () => {
  localStorage.clear();

  window.location.replace("/login");
};
export default function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  

  const navigate = useNavigate();

  const [walletBalance, setWalletBalance] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [avatar, setAvatar] = useState("");


const [pendingOrders, setPendingOrders] = useState(0);
const [paidOrders, setPaidOrders] = useState(0);
const [shippingOrders, setShippingOrders] = useState(0);
const [completedOrders, setCompletedOrders] = useState(0);
const [totalSales, setTotalSales] = useState(0);
const [totalProfit, setTotalProfit] = useState(0);
const [pendingAmount, setPendingAmount] = useState(0);


useEffect(() => {
  loadData();

  const interval = setInterval(() => {
    loadData();
  }, 1000);
  
  return () => clearInterval(interval);
}, []);

async function loadData() {
  if (!user) return;

  const { data: profile } = await supabase
  .from("profiles")
  .select("avatar_url")
  .eq("id", user.id)
  .single();

if (profile?.avatar_url) {
  setAvatar(profile.avatar_url);
}



  const {
  data: wallet,
  error: walletError,
} = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", user.id)
  .single();



  if (wallet) {
    setWalletBalance(wallet.balance || 0);
  }
  
  // ดึงร้านของผู้ใช้
const { data: shops, error: shopError } = await supabase
  .from("shops")
  .select("id")
  .eq("user_id", user.id);

const shop = shops?.[0];

if (shop) {
  const { count } = await supabase
    .from("shop_products")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("shop_id", shop.id);

  setProductCount(count || 0);

  // ดึงออเดอร์ของร้าน
const { data: shopOrders } = await supabase
  .from("orders")
  .select("*")
  .eq("shop_id", shop.id);

if (shopOrders) {

  const sales = shopOrders
    .filter(o => o.payment_status === "paid")
    .reduce(
      (sum, o) => sum + Number(o.total_price || 0),
      0
    );

  setTotalSales(sales);

  const profit = sales * 0.1;

setTotalProfit(profit);

if (wallet) {
  setWalletBalance(
    wallet.balance || 0
  );
}

  const pending = shopOrders
    .filter(o => o.owner_paid === false)
    .reduce(
      (sum, o) => sum + Number(o.total_price || 0),
      0
    );

  setPendingAmount(pending);

  setPendingOrders(
  shopOrders.filter(
    o => o.owner_paid === false
  ).length
);

setPaidOrders(
  shopOrders.filter(
    o =>
      o.owner_paid === true &&
      o.status === "pending"
  ).length
);

setShippingOrders(
  shopOrders.filter(
    o => o.status === "shipping"
  ).length
);

setCompletedOrders(
  shopOrders.filter(
    o => o.status === "completed"
  ).length
);

}
}

  
}

  return (
    <>
      <div className="profile-page">

        {/* Header Card */}
        <div className="profile-card">

          <div className="profile-header">
            <img
              src={
                avatar ||
                "https://via.placeholder.com/100"
              }
              alt="profile"
              className="profile-img"
            />

            <div className="profile-info">
              <h2>ID : {user?.member_id}</h2>

              <p>ชื่อ : {user?.username || user?.full_name}</p>

              <p>รหัสเชิญ : {user?.customer_code}</p>

              <span className="member-badge">
                สมาชิก VVIP
              </span>

              <div className="rating">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>

          {/* กล่องสถิติ */}
          <div className="stats-grid">

            <div className="stat-box">
              <span>ยอดเงินในกระเป๋า</span>
              <h3>
                ฿
                {walletBalance.toLocaleString()}
              </h3>
            </div>

            <div className="stat-box">
              <span>ยอดขายรวม</span>
              <h3>฿{totalSales.toLocaleString()}</h3>
            </div>

            <div className="stat-box">
              <span>กำไร</span>
              <h3>฿{totalProfit.toLocaleString()}</h3>
            </div>

            <div className="stat-box">
              <span>จำนวนสินค้า</span>
              <h3>{productCount}</h3>
            </div>

          </div>

          {/* ยอดค้างชำระ */}
          <div className="pending-box">
            <div className="pending-box">
            <span>ยอดค้างชำระ</span>
            <h2>฿{pendingAmount.toLocaleString()}</h2>
            </div>
          </div>

          {/* ปุ่ม */}
          <div className="profile-buttons">

  <button
    className="edit-btn"
    onClick={() =>
      navigate("/profile-image")
    }
  >
    แก้ไขโปรไฟล์
  </button>

  <button onClick={logout}>
    ออกจากระบบ
  </button>

</div>

        </div>

        {/* สถานะออเดอร์ */}
        <div className="order-status">

          <div
  onClick={() =>
    navigate("/pending-orders")
  }
>
  <CreditCard
    size={35}
    color="#ff4d6d"
  />

  <p>ค้างชำระ</p>

  <span>{pendingOrders}</span>
</div>

          <div
  onClick={() =>
    navigate("/paid-orders")
  }
>

  <Package
    size={35}
    color="#f4b400"
  />

  <p>ชำระแล้ว</p>

  <span>{paidOrders}</span>

</div>

          <div
  onClick={() =>
    navigate("/shipping-orders")
  }
>
  <Truck
    size={35}
    color="#4285f4"
  />

  <p>กำลังจัดส่ง</p>

  <span>{shippingOrders}</span>
</div>

          <div
  onClick={() =>
    navigate("/completed-orders")
  }
>
  <CheckCircle
    size={35}
    color="#16a34a"
  />

  <p>เสร็จสิ้น</p>

  <span>{completedOrders}</span>
</div>

        </div>

        {/* เมนู */}
<div className="menu-card">

  <div
    className="menu-item"
    onClick={() => navigate("/deposit")}
  >
    <Wallet
      size={32}
      color="#f59e0b"
    />
    <span>ฝากเงิน</span>
  </div>

          <div
  className="menu-item"
  onClick={() =>
    navigate("/withdraw")
  }
>
  <ArrowDownCircle
    size={32}
    color="#f59e0b"
  />
  <span>ถอนเงิน</span>
</div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/transactions")
            }
          >
            <Receipt size={32} color="#fb7185" />
            <span>ธุรกรรม</span>
          </div>

          <div
  className="menu-item"
  onClick={() => navigate("/my-orders")}
>
  <Package
    size={32}
    color="#ef4444"
  />
  <span>คำสั่งซื้อ</span>

</div>

          <div
  className="menu-item"
  onClick={() =>
    navigate("/payment-password")
  }
>
  <Lock size={32} color="#14b8a6" />
  <span>รหัสชำระเงิน</span>
</div>

          <div
  className="menu-item"
  onClick={() =>
    navigate("/my-shop")
  }
>
  <Store
    size={32}
    color="#3b82f6"
  />
  <span>ร้านของฉัน</span>
</div>

          <div
  className="menu-item"
  onClick={() => navigate("/support")}
>
  <Headphones
    size={32}
    color="#22c55e"
  />
  <span>ฝ่ายบริการ</span>
</div>

          <div
  className="menu-item"
  onClick={() =>
    navigate("/settings")
  }
>
  <Settings
    size={32}
    color="#6b7280"
  />
  <span>ตั้งค่า</span>
</div>

          

        </div>

        <div className="exchange-section">

  <p className="exchange-text">
    users from 103 countries worldwide use USDT/ETH/BTC for payment. This method provides borderless, economical, and fast transactions without international fees.
  </p>

  <div className="exchange-grid">

    <div className="exchange-item">
      <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" />
      <span>Binance</span>
    </div>

    <div className="exchange-item">
      <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/294.png" alt="OKX" />
      <span>OKX</span>
    </div>

    <div className="exchange-item">
      <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/521.png" alt="Bybit" />
      <span>Bybit</span>
    </div>

    <div className="exchange-item">
      <img src="https://bitazza.com/favicon.ico" alt="Bitazza" />
      <span>Bitazza</span>
    </div>

    

    <div className="exchange-item">
      <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/2087.png" />
      <span>KUB Wallet</span>
    </div>

    <div className="exchange-item">
      <img src="https://cryptologos.cc/logos/kucoin-token-kcs-logo.png?v=040" alt="KuCoin" />
      <span>KuCoin</span>
    </div>

    <div className="exchange-item">
      <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png" />
      <span>Bitfinex</span>
    </div>

    <div className="exchange-item">
      <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040" alt="Coinbase" />
      <span>Coinbase</span>
    </div>

    <div className="exchange-item">
      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" />
      <span>MetaMask</span>
    </div>

    <div className="exchange-item">
      <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" alt="Trust Wallet" />
      <span>Trust Wallet</span>
    </div>

  </div>

</div>

      </div>
      

      <BottomNav />
    </>
  );
}