import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function CompletedOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!shop) return;

    const { data: orderData, error } =
      await supabase
        .from("orders")
        .select("*")
        .eq("shop_id", shop.id)
        .eq("status", "completed")
        .order("completed_at", {
          ascending: false
        });

    if (error) {
      console.log(error);
      return;
    }

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
        เสร็จสิ้น
      </h2>

      {orders.length === 0 && (

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 15
          }}
        >
          ไม่มีรายการที่จัดส่งสำเร็จ
        </div>

      )}

      {orders.map(order => (

        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.1)"
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
            วันที่สั่ง :
            {" "}
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

          {order.completed_at && (
            <p>
              วันที่จัดส่งสำเร็จ :
              {" "}
              {new Date(
                order.completed_at
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
          )}

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
              background: "#dcfce7",
              color: "#16a34a",
              padding: 12,
              borderRadius: 12,
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            ✅ จัดส่งสำเร็จแล้ว
          </div>

        </div>

      ))}

    </div>
  );
}