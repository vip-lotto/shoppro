import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Wallet,
  CreditCard,
  Truck,
  CheckCircle
} from "lucide-react";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [usersCount, setUsersCount] = useState(0);
  const [shopsCount, setShopsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const [pendingOrders, setPendingOrders] = useState(0);
  const [shippingOrders, setShippingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);

  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  function logout() {

  const ok = window.confirm(
    "ต้องการออกจากระบบหรือไม่ ?"
  );

  if (!ok) return;

  localStorage.removeItem("admin");

  window.location.href =
    "/admin-login";
}

  async function loadData() {

    const { count: users } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true
        });

    const { count: shops } =
      await supabase
        .from("shops")
        .select("*", {
          count: "exact",
          head: true
        });

    const { count: products } =
      await supabase
        .from("products")
        .select("*", {
          count: "exact",
          head: true
        });

    const { data: orders } =
      await supabase
        .from("orders")
        .select("*");

    setUsersCount(users || 0);
    setShopsCount(shops || 0);
    setProductsCount(products || 0);

    if (orders) {

      setOrdersCount(orders.length);

      setPendingOrders(
        orders.filter(
          o => o.owner_paid === false
        ).length
      );

      setShippingOrders(
        orders.filter(
          o => o.status === "shipping"
        ).length
      );

      setCompletedOrders(
        orders.filter(
          o => o.status === "completed"
        ).length
      );

      const sales =
        orders.reduce(
          (sum, o) =>
            sum +
            Number(o.total_price || 0),
          0
        );

      setTotalSales(sales);
    }
  }

  const statCard = {
  background: "#fff",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 8px 25px rgba(0,0,0,.06)",
  display: "flex",
  alignItems: "center",
  gap: 15,
  transition: ".2s",
};

const statNumber = {
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
};

const statLabel = {
  color: "#64748b",
  fontSize: 14,
  marginBottom: 5,
};

  return (
    <div
      style={{
        padding: 25,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f5f7fb,#eef2ff)"
      }}
    >

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  }}
>

  <div>

    <div
      style={{
        color: "#64748b",
        fontSize: 15,
      }}
    >
      👋 ยินดีต้อนรับ
    </div>

    <h1
      style={{
        marginTop: 5,
        marginBottom: 0,
      }}
    >
      SHOPPRO ADMIN
    </h1>

    <div
      style={{
        color: "#94a3b8",
      }}
    >
      ระบบจัดการร้านค้าและสมาชิก
    </div>

  </div>

  <button
    onClick={logout}
    style={{
      border: "none",
      background:
        "linear-gradient(135deg,#ef4444,#dc2626)",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
     ออกจากระบบ
  </button>

</div>

      

      {/* สถิติ */}

      {/* Dashboard Cards */}

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: 15,
    marginBottom: 30,
  }}
>

  <div style={statCard}>
    <Users
      size={42}
      color="#6366f1"
    />
    <div>
      <div style={statLabel}>
        สมาชิก
      </div>
      <h2 style={statNumber}>
        {usersCount}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <Store
      size={42}
      color="#06b6d4"
    />
    <div>
      <div style={statLabel}>
        ร้านค้า
      </div>
      <h2 style={statNumber}>
        {shopsCount}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <Package
      size={42}
      color="#f59e0b"
    />
    <div>
      <div style={statLabel}>
        สินค้า
      </div>
      <h2 style={statNumber}>
        {productsCount}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <ShoppingCart
      size={42}
      color="#22c55e"
    />
    <div>
      <div style={statLabel}>
        ออเดอร์
      </div>
      <h2 style={statNumber}>
        {ordersCount}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <CreditCard
      size={42}
      color="#ef4444"
    />
    <div>
      <div style={statLabel}>
        ค้างชำระ
      </div>
      <h2 style={statNumber}>
        {pendingOrders}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <Truck
      size={42}
      color="#3b82f6"
    />
    <div>
      <div style={statLabel}>
        กำลังจัดส่ง
      </div>
      <h2 style={statNumber}>
        {shippingOrders}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <CheckCircle
      size={42}
      color="#22c55e"
    />
    <div>
      <div style={statLabel}>
        เสร็จสิ้น
      </div>
      <h2 style={statNumber}>
        {completedOrders}
      </h2>
    </div>
  </div>

  <div style={statCard}>
    <Wallet
      size={42}
      color="#f59e0b"
    />
    <div>
      <div style={statLabel}>
        ยอดขายรวม
      </div>
      <h2 style={statNumber}>
        ฿{totalSales.toLocaleString()}
      </h2>
    </div>
  </div>

</div>

      {/* เมนู */}

      <h2
        style={{
          marginTop: 35,
          marginBottom: 15
        }}
      >
        เมนูจัดการระบบ
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20
        }}
      >

        <div
          onClick={() =>
            navigate("/admin/users")
          }
          style={{
            background:
              "linear-gradient(135deg,#8b5cf6,#6366f1)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>👤</h2>
          <h3>ข้อมูลสมาชิก</h3>
          <p>สมาชิกทั้งหมดในระบบ</p>
        </div>

        <div
          onClick={() =>
            navigate("/admin/shops")
          }
          style={{
            background:
              "linear-gradient(135deg,#06b6d4,#3b82f6)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>🏪</h2>
          <h3>จัดการร้านค้า</h3>
          <p>ร้านค้าที่เปิดขาย</p>
        </div>

        <div
          onClick={() =>
            navigate("/admin/products")
          }
          style={{
            background:
              "linear-gradient(135deg,#f59e0b,#f97316)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>📦</h2>
          <h3>จัดการสินค้า</h3>
          <p>สินค้าทั้งหมด</p>
        </div>

        <div
          onClick={() =>
            navigate("/admin/orders")
          }
          style={{
            background:
              "linear-gradient(135deg,#10b981,#22c55e)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>🛒</h2>
          <h3>จัดการออเดอร์</h3>
          <p>ตรวจสอบคำสั่งซื้อ</p>
        </div>

        <div
          onClick={() =>
            navigate("/admin/withdrawals")
          }
          style={{
            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>💸</h2>
          <h3>ถอนเงิน</h3>
          <p>อนุมัติคำขอถอนเงิน</p>
        </div>


        <div
          onClick={() =>
            navigate("/admin/deposits")
          }
          style={{
            background:
              "linear-gradient(135deg,#14b8a6,#0f766e)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>💰</h2>
          <h3>ฝากเงิน</h3>
          <p>ตรวจสอบสลิปฝากเงิน</p>
        </div>

        <div
          onClick={() =>
            navigate("/admin/reports")
          }
          style={{
            background:
              "linear-gradient(135deg,#ec4899,#d946ef)",
            color: "#fff",
            padding: 20,
            borderRadius: 20,
            cursor: "pointer"
          }}
        >
          <h2>📊</h2>
          <h3>รายงานระบบ</h3>
          <p>สรุปยอดขายทั้งหมด</p>

          
        </div>

        <div
  onClick={() =>
    navigate("/admin-kyc")
  }
  style={{
    background:
      "linear-gradient(135deg,#8b5cf6,#7c3aed)",
    color: "#fff",
    padding: 20,
    borderRadius: 20,
    cursor: "pointer"
  }}
>
  <h2>🪪</h2>
  <h3>ตรวจสอบ KYC</h3>
  <p>อนุมัติเอกสารยืนยันตัวตน</p>
</div>


      </div>

    </div>
  );
}