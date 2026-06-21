import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();

    const handleStorage = () => {
      loadCart();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const loadCart = async () => {
    setLoading(true);

    const user = JSON.parse(
  localStorage.getItem("user")
);

const { data, error } =
  await supabase
    .from("cart_view")
    .select("*");

console.log(data);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  };

  const removeItem = async (id) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (!error) {
      loadCart();
    }
  };

  const updateQty = async (
    id,
    qty
  ) => {
    if (qty < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ qty })
      .eq("id", id);

    if (!error) {
      loadCart();
    }
  };

  const totalPrice = items.reduce(
    (sum, item) =>
      sum +
      (item.sell_price || 0) * item.qty,
    0
  );

  return (
    <div
      style={{
        padding: "15px",
        paddingBottom: "100px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h2>ตะกร้าสินค้า</h2>

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          กำลังโหลด...
        </div>
      )}

      {!loading &&
        items.length === 0 && (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "60px",
              }}
            >
              🛒
            </div>

            <h3>
              ยังไม่มีสินค้าในตะกร้า
            </h3>

            <button
              onClick={() =>
                navigate("/home")
              }
              style={{
                marginTop: "15px",
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background:
                  "#ff3366",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🛍️ เลือกดูสินค้า
            </button>
          </div>
        )}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "15px",
            marginBottom: "15px",
            display: "flex",
            gap: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <img
            src={item.image}
            alt=""
            style={{
              width: "110px",
              height: "110px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />

          <div style={{ flex: 1 }}>
            <h4>{item.name}</h4>

            <p
              style={{
                color: "#666",
              }}
            >
              🏪 {item.shop_name}
            </p>

            <p
              style={{
                color: "#f59e0b",
              }}
            >
              ⭐ {item.shop_star}
            </p>

            

            <p
              style={{
                color: "#ff3366",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              ฿
              {Number(
                item.sell_price || 0
              ).toLocaleString()}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() =>
                  updateQty(
                    item.id,
                    item.qty - 1
                  )
                }
                style={{
                  width: "35px",
                  height: "35px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#ddd",
                  fontSize: "20px",
                }}
              >
                -
              </button>

              <b>{item.qty}</b>

              <button
                onClick={() =>
                  updateQty(
                    item.id,
                    item.qty + 1
                  )
                }
                style={{
                  width: "35px",
                  height: "35px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "#ff3366",
                  color: "#fff",
                  fontSize: "20px",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={() =>
                removeItem(item.id)
              }
              style={{
                background:
                  "#ef4444",
                color: "#fff",
                border: "none",
                padding:
                  "8px 15px",
                borderRadius:
                  "8px",
                marginTop:
                  "10px",
                cursor:
                  "pointer",
              }}
            >
              ลบสินค้า
            </button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "15px",
            marginTop: "20px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>
            รวมทั้งหมด :
            ฿
            {totalPrice.toLocaleString()}
          </h3>

          <button
            onClick={() =>
              navigate("/checkout")
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              background:
                "#ff3366",
              color: "#fff",
              borderRadius:
                "10px",
              marginTop:
                "10px",
              fontWeight:
                "bold",
            }}
          >
            สั่งซื้อสินค้า
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}