
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import {
  ArrowLeft,
  Package,
  Trash2
} from "lucide-react";

export default function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "waiting_admin")
      .order("created_at", {
        ascending: false
      });

    setOrders(data || []);
  }

  async function updateStatus(order, status) {

  if (status === "completed") {

    const { data: shop } =
      await supabase
        .from("shops")
        .select("user_id")
        .eq("id", order.shop_id)
        .single();

    if (!shop) {
      alert("ไม่พบร้านค้า");
      return;
    }

    const { data: wallet } =
      await supabase
        .from("wallets")
        .select("id,balance")
        .eq("user_id", shop.user_id)
        .single();

    if (!wallet) {
      alert("ไม่พบกระเป๋าเงิน");
      return;
    }

    const newBalance =
      Number(wallet.balance || 0) +
      Number(order.cost_price || 0) +
      Number(order.profit || 0);

    await supabase
      .from("wallets")
      .update({
        balance: newBalance
      })
      .eq("id", wallet.id);

    await supabase
      .from("orders")
      .update({
        status: "completed",
        owner_paid: true,
        completed_at: new Date().toISOString()
      })
      .eq("id", order.id);

    alert("จ่ายเงินให้ร้านค้าแล้ว");

  } else {

    await supabase
      .from("orders")
      .update({
        status
      })
      .eq("id", order.id);

  }

  loadOrders();
}

  async function deleteOrder(id) {

    if (
      !window.confirm(
        "ต้องการลบออเดอร์นี้หรือไม่ ?"
      )
    ) return;

    await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    loadOrders();
  }

  function getStatusColor(status) {

    if (status === "pending")
      return "#ef4444";

    if (status === "paid")
      return "#f59e0b";

    if (status === "shipping")
      return "#3b82f6";

    if (status === "completed")
      return "#22c55e";

    return "#6b7280";
  }

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
        style={{
          border: "none",
          background: "#4f46e5",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 20
        }}
      >
        <ArrowLeft
          size={18}
          style={{
            marginRight: 5
          }}
        />
        ย้อนกลับ
      </button>

      <h1>
        📦 จัดการออเดอร์
      </h1>

      {orders.length === 0 && (

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 20,
            marginTop: 20
          }}
        >
          ไม่มีออเดอร์
        </div>

      )}

      {orders.map(order => (

        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            marginTop: 20,
            boxShadow:
              "0 5px 20px rgba(0,0,0,.08)"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center"
            }}
          >

            <h3>
              <Package
                size={20}
                style={{
                  marginRight: 8
                }}
              />
              SHP-
              {String(order.id)
                .slice(0, 6)
                .toUpperCase()}
            </h3>

            <span
              style={{
                background:
                  getStatusColor(
                    order.status
                  ),
                color: "#fff",
                padding:
                  "6px 12px",
                borderRadius: 10,
                fontWeight: "bold"
              }}
            >
              {order.status}
            </span>

          </div>

          <p>
            ลูกค้า :
            {order.customer_name}
          </p>

          <p>
            เบอร์ :
            {order.phone}
          </p>

          <p>
            จังหวัด :
            {order.province}
          </p>

          <p>
            ยอดรวม :
            ฿
            {Number(
              order.total_price || 0
            ).toLocaleString()}
          </p>

          <p>
            วันที่ :
            {new Date(
              order.created_at
            ).toLocaleString("th-TH")}
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 15
            }}
          >

            <button
              onClick={() =>
                updateStatus(
                  order,
                  "paid"
                )
              }
              style={{
                background:
                  "#f59e0b",
                color: "#fff",
                border: "none",
                padding:
                  "10px 15px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              ชำระแล้ว
            </button>

            <button
              onClick={() =>
                updateStatus(
                  order,
                  "shipping"
                )
              }
              style={{
                background:
                  "#3b82f6",
                color: "#fff",
                border: "none",
                padding:
                  "10px 15px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              กำลังจัดส่ง
            </button>

            <button
              onClick={() =>
                updateStatus(
                  order,
                  "completed"
                )
              }
              style={{
                background:
                  "#22c55e",
                color: "#fff",
                border: "none",
                padding:
                  "10px 15px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              เสร็จสิ้น
            </button>

            <button
              onClick={() =>
                deleteOrder(
                  order.id
                )
              }
              style={{
                background:
                  "#ef4444",
                color: "#fff",
                border: "none",
                padding:
                  "10px 15px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              <Trash2 size={16} />
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}
