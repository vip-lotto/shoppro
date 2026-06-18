import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import BottomNav from "../components/BottomNav";

export default function Orders() {
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

    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!shop) return;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", {
        ascending: false,
      });

    setOrders(data || []);
  };

  const updateStatus = async (
  id,
  status
) => {

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) return;

  await supabase
    .from("orders")
    .update({
      status,
      payment_status:
        status === "completed"
          ? "paid"
          : order.payment_status,
    })
    .eq("id", id);

  if (status === "completed") {

    const { data: shop } = await supabase
      .from("shops")
      .select("user_id")
      .eq("id", order.shop_id)
      .single();

    if (shop) {

      const { data: wallet } =
        await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", shop.user_id)
          .single();

      const sale =
        Number(order.total_price || 0);

      const profit = sale * 0.1;

      await supabase
        .from("wallets")
        .update({
          balance:
            Number(
              wallet?.balance || 0
            ) +
            sale +
            profit,
        })
        .eq(
          "user_id",
          shop.user_id
        );
    }
  }

  loadOrders();
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
      background: "#ca1e49",
      color: "#fff",
      padding: "10px 15px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    ← ย้อนกลับ
  </button>

  <h2
    style={{
      margin: 0,
    }}
  >
    📦 คำสั่งซื้อ
  </h2>
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
          <h3>
            {item.customer_name}
          </h3>

          <p>
            📞 {item.phone}
          </p>

          <p>
            📍 {item.village}
            {" "}
            {item.district}
            {" "}
            {item.province}
          </p>

          <p>
            จำนวน : {item.qty}
          </p>

          <p>
            สถานะ :
            <b>
              {" "}
              {item.status}
            </b>
          </p>

          {item.status ===
            "pending" && (
            <button
              onClick={() =>
                updateStatus(
                  item.id,
                  "processing"
                )
              }
            >
              รับออเดอร์
            </button>
          )}

          {item.status ===
            "processing" && (
            <button
              onClick={() =>
                updateStatus(
                  item.id,
                  "shipping"
                )
              }
            >
              กำลังจัดส่ง
            </button>
          )}

          {item.status ===
            "shipping" && (
            <button
              onClick={() =>
                updateStatus(
                  item.id,
                  "completed"
                )
              }
            >
              ส่งสำเร็จ
            </button>
          )}
        </div>
      ))}

      <BottomNav />
    </div>
  );
}