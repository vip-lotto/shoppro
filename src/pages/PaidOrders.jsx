import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function PaidOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!shop) return;

    const { data: orderData } =
      await supabase
        .from("orders")
        .select("*")
        .eq("shop_id", shop.id)
        .eq("owner_paid", true)
        .eq("status", "pending");

    if (!orderData) return;

    const result = await Promise.all(

      orderData.map(async (order) => {

        const { data: product } =
          await supabase
            .from("products")
            .select("name")
            .eq("id", order.product_id)
            .single();

        return {
          ...order,
          product_name:
            product?.name || "-"
        };

      })

    );

    setOrders(result);
  }

  async function shipOrder(orderId) {

    const { error } = await supabase
      .from("orders")
      .update({
        status: "shipping"
      })
      .eq("id", orderId);

    if (error) {

      setPopup({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถอัปเดตสถานะได้"
      });

      setTimeout(() => {
        setPopup(null);
      }, 2500);

      return;
    }

    setPopup({
      type: "shipping",
      title: "🚚 รับคำสั่งจัดส่งแล้ว",
      message: "กำลังจัดส่งสินค้าให้ลูกค้า"
    });

    setTimeout(() => {
      setPopup(null);
      loadOrders();
    }, 2500);
  }

  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#6366f1,#8b5cf6)"
      }}
    >

      {popup && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >

          <div
            style={{
              background: "#fff",
              width: "85%",
              maxWidth: 350,
              padding: 30,
              borderRadius: 25,
              textAlign: "center",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.2)"
            }}
          >

            <div
              style={{
                fontSize: 60,
                marginBottom: 15
              }}
            >
              {popup.type === "error"
                ? "❌"
                : "🚚"}
            </div>

            <h2
              style={{
                color:
                  popup.type === "error"
                    ? "#ef4444"
                    : "#2563eb",
                marginBottom: 10
              }}
            >
              {popup.title}
            </h2>

            <p
              style={{
                color: "#555",
                fontSize: 16
              }}
            >
              {popup.message}
            </p>

          </div>

        </div>

      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          background: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: 12,
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: 20
        }}
      >
        ← ย้อนกลับ
      </button>

      <h2
        style={{
          color: "#fff",
          marginBottom: 20
        }}
      >
        ชำระแล้ว
      </h2>

      {orders.length === 0 && (

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 15
          }}
        >
          ไม่มีรายการชำระแล้ว
        </div>

      )}

      {orders.map(order => (

        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
          }}
        >

          <p
            style={{
              color: "#16a34a",
              fontWeight: "bold"
            }}
          >
            รหัสออเดอร์ :
            SHP-
            {String(order.id)
              .slice(0, 6)
              .toUpperCase()}
          </p>

          <h3>
            ลูกค้า :
            {order.customer_name}
          </h3>

          <p>
            เบอร์ :
            {order.phone}
          </p>

          <p>
            วันที่ :
            {new Date(
              order.created_at
            ).toLocaleString(
              "th-TH",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }
            )}
          </p>

          <hr />

          <h4>
            รายการสินค้า
          </h4>

          <div
            style={{
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 10
            }}
          >
            • {order.product_name}
          </div>

          <p
            style={{
              marginTop: 15,
              fontWeight: "bold",
              fontSize: 20
            }}
          >
            รวมยอด :
            ฿
            {Number(
              order.total_price
            ).toLocaleString()}
          </p>

          <div
            style={{
              background: "#dcfce7",
              color: "#16a34a",
              padding: 12,
              borderRadius: 12,
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 12
            }}
          >
            ✓ รายการออร์เดอร์ที่ชำระแล้ว
          </div>

          <button
            onClick={() =>
              shipOrder(order.id)
            }
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg,#3b82f6,#2563eb)",
              color: "#fff",
              border: "none",
              padding: 14,
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            🚚 ส่งสินค้า
          </button>

        </div>

      ))}

    </div>
  );
}