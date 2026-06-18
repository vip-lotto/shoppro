import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_code", user.customer_code)
      .order("created_at", {
        ascending: false,
      });

    setOrders(data || []);
  };

  const getStatus = (status) => {
    if (status === "pending") {
      return "⏳ รอรับออเดอร์";
    }

    if (status === "processing") {
      return "📦 กำลังเตรียมสินค้า";
    }

    if (status === "shipping") {
      return "🚚 กำลังจัดส่ง";
    }

    if (status === "completed") {
      return "✅ ส่งสำเร็จ";
    }

    return status;
  };

  return (
    <div
      style={{
        padding: "15px",
        paddingBottom: "90px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "#ff3366",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          ← กลับ
        </button>

        <h2>📦 คำสั่งซื้อของฉัน</h2>
      </div>

      {orders.length === 0 && (
        <p>ยังไม่มีคำสั่งซื้อ</p>
      )}

      {orders.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>{item.customer_name}</h3>

          <p>
            📞 {item.phone}
          </p>

          <p>
            📍 {item.village}{" "}
            {item.district}{" "}
            {item.province}
          </p>

          <p>
            จำนวน : {item.qty}
          </p>

          <h4
            style={{
              color: "#ff3366",
            }}
          >
            {getStatus(item.status)}
          </h4>
        </div>
      ))}

      <BottomNav />
    </div>
  );
}