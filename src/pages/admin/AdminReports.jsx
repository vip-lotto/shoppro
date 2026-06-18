
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

export default function AdminReports() {

  const navigate = useNavigate();

  const [users, setUsers] = useState(0);
  const [shops, setShops] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [sales, setSales] = useState(0);
  const [withdraws, setWithdraws] =
    useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const { count: userCount } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true
        });

    const { count: shopCount } =
      await supabase
        .from("shops")
        .select("*", {
          count: "exact",
          head: true
        });

    const { count: productCount } =
      await supabase
        .from("products")
        .select("*", {
          count: "exact",
          head: true
        });

    const { data: orderData } =
      await supabase
        .from("orders")
        .select("*");

    const { count: withdrawCount } =
      await supabase
        .from("withdrawals")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq("status", "pending");

    setUsers(userCount || 0);
    setShops(shopCount || 0);
    setProducts(productCount || 0);
    setOrders(orderData?.length || 0);
    setWithdraws(withdrawCount || 0);

    const total =
      orderData?.reduce(
        (sum, item) =>
          sum +
          Number(
            item.total_price || 0
          ),
        0
      ) || 0;

    setSales(total);
  }

  const card = {
    background: "#fff",
    borderRadius: 20,
    padding: 20,
    boxShadow:
      "0 5px 20px rgba(0,0,0,.08)"
  };

  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
        background: "#f5f7fb"
      }}
    >

      <button
        onClick={() =>
          navigate("/admin")
        }
      >
        ← กลับ
      </button>

      <h1>
        📊 รายงานระบบ
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20
        }}
      >

        <div style={card}>
          👤 สมาชิกทั้งหมด
          <h1>{users}</h1>
        </div>

        <div style={card}>
          🏪 ร้านค้าทั้งหมด
          <h1>{shops}</h1>
        </div>

        <div style={card}>
          📦 สินค้าทั้งหมด
          <h1>{products}</h1>
        </div>

        <div style={card}>
          🛒 ออเดอร์ทั้งหมด
          <h1>{orders}</h1>
        </div>

        <div style={card}>
          💰 ยอดขายรวม
          <h1>
            ฿{sales.toLocaleString()}
          </h1>
        </div>

        <div style={card}>
          💸 ถอนเงินรออนุมัติ
          <h1>{withdraws}</h1>
        </div>

      </div>

    </div>
  );
}
