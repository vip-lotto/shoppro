import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ShippingOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

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
        .eq("status", "shipping");

    if (!orderData) return;

    const result = await Promise.all(

      orderData.map(async order => {

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

  async function completeOrder(id) {

    await supabase
      .from("orders")
      .update({
        status: "completed"
      })
      .eq("id", id);

    loadOrders();
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
        กำลังจัดส่ง
      </h2>

      {orders.length === 0 && (

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 15
          }}
        >
          ไม่มีรายการกำลังจัดส่ง
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
              color: "#2563eb",
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
    marginTop: 15,
    background: "#dbeafe",
    color: "#2563eb",
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    fontWeight: "bold"
  }}
>
  🚚 สินค้ากำลังอยู่ระหว่างการจัดส่ง
</div>

        </div>

      ))}

    </div>
  );
}