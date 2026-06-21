import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ShippingOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [popup, setPopup] = useState(false);

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

  async function sendToAdmin(order) {

  const { error } =
    await supabase
      .from("orders")
      .update({
        status: "waiting_admin"
      })
      .eq("id", order.id);

  if (error) {
  alert(error.message);
  return;
}

setPopup(true);

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

<button
  onClick={() => sendToAdmin(order)}
  style={{
    width: "100%",
    marginTop: 15,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: 14,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  📦 ส่งให้แอดมินตรวจสอบ
</button>

        </div>

      ))}

      {popup && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "420px",
        background: "#fff",
        borderRadius: "25px",
        padding: "30px",
        textAlign: "center",
        boxShadow:
          "0 15px 40px rgba(0,0,0,.25)"
      }}
    >
      <div
        style={{
          fontSize: "70px",
          marginBottom: "10px"
        }}
      >
        📦
      </div>

      <h2
        style={{
          color: "#22c55e",
          marginBottom: "10px"
        }}
      >
        ส่งสำเร็จ
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "25px",
          lineHeight: "28px"
        }}
      >
        ส่งให้แอดมินตรวจสอบแล้ว
        <br />
        กรุณารอแอดมินอนุมัติ
      </p>

      <button
        onClick={() => setPopup(false)}
        style={{
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "15px",
          background: "#22c55e",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        ตกลง
      </button>
    </div>
  </div>
)}

    </div>
  );
}