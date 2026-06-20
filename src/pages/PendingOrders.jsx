import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function PendingOrders() {

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

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shop.id)
      .eq("owner_paid", false);

    if (!orderData) return;

    const ordersWithProducts =
      await Promise.all(

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

    setOrders(ordersWithProducts);
  }

  async function payOrder(order) {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const balance =
      Number(wallet?.balance || 0);

    const total =
  Number(order.cost_price || 0);

    if (balance < total) {

      setPopup({
        type: "error",
        title: "ยอดเงินไม่พอ",
        message:
          `ต้องใช้ ${total.toLocaleString()} บาท`
      });

      setTimeout(() => {
        setPopup(null);
      }, 2500);

      return;
    }

    const newBalance =
      balance - total;

    await supabase
      .from("wallets")
      .update({
        balance: newBalance
      })
      .eq("id", wallet.id);

    await supabase
      .from("orders")
      .update({
        owner_paid: true
      })
      .eq("id", order.id);

    setPopup({
      type: "success",
      title: "ชำระสำเร็จ",
      message:
        `หักเงิน ${total.toLocaleString()} บาทแล้ว`
    });

    setTimeout(() => {
      setPopup(null);
    }, 2500);

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
              padding: 30,
              borderRadius: 20,
              minWidth: 320,
              textAlign: "center"
            }}
          >

            <h2
              style={{
                color:
                  popup.type === "success"
                    ? "#22c55e"
                    : "#ef4444"
              }}
            >
              {popup.title}
            </h2>

            <p>{popup.message}</p>

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
        ค้างชำระ
      </h2>

      {orders.length === 0 && (

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 15
          }}
        >
          ไม่มีรายการค้างชำระ
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
    color: "#f50561",
    fontWeight: "bold",
    marginBottom: 10
  }}
>
  รหัสออเดอร์ :
SHP-{String(order.id).slice(0,6).toUpperCase()}
</p>

          <h3>
            
            ลูกค้า : {order.customer_name}
          </h3>

          <p>
            เบอร์ : {order.phone}
          </p>

            <p>
  วันที่ :
  {new Date(order.created_at)
    .toLocaleString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
</p>

          <hr
            style={{
              margin: "15px 0"
            }}
          />

          <h4>
            รายการสินค้า
          </h4>

          <div
            style={{
              background: "#f8fafc",
              padding: 12,
              borderRadius: 10,
              marginBottom: 15
            }}
          >
            • {order.product_name}
          </div>

          <p
            style={{
              fontWeight: "bold",
              fontSize: 18
            }}
          >
            รวมยอด :
            ฿{Number(
              order.total_price
            ).toLocaleString()}
          </p>

          <button
            onClick={() =>
              payOrder(order)
            }
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: 10
            }}
          >
            ชำระให้ระบบ
          </button>

        </div>

      ))}

    </div>
  );
}