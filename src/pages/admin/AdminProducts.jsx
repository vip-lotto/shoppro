import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function AdminProducts() {
const navigate = useNavigate();

const [products, setProducts] = useState([]);

useEffect(() => {
loadProducts();
}, []);

const loadProducts = async () => {
const { data, error } = await supabase
.from("products")
.select("*")
.order("created_at", {
ascending: false,
});


if (!error) {
  setProducts(data || []);
}


};

const deleteProduct = async (id) => {
const ok = window.confirm(
"ต้องการลบสินค้านี้หรือไม่ ?"
);


if (!ok) return;

await supabase
  .from("products")
  .delete()
  .eq("id", id);

loadProducts();


};

return (
<div
style={{
padding: "25px",
minHeight: "100vh",
background:
"linear-gradient(135deg,#f5f7fb,#eef2ff)",
}}
>
{/* Header */}
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "25px",
flexWrap: "wrap",
gap: "10px",
}}
> <div>
<h1
style={{
margin: 0,
fontSize: "32px",
fontWeight: "800",
}}
>
📦 จัดการสินค้า </h1>


      <p
        style={{
          color: "#6b7280",
          marginTop: "5px",
        }}
      >
        จัดการรายการสินค้า สต็อก และรายละเอียดต่างๆ
      </p>
    </div>

    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      <button
        onClick={() =>
          navigate("/admin")
        }
        style={{
          border:
            "1px solid #d1d5db",
          background: "#fff",
          color: "#374151",
          padding: "12px 20px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        ← กลับหน้าหลัก
      </button>

      <button
        onClick={() =>
          navigate("/add-product")
        }
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ➕ เพิ่มสินค้า
      </button>
    </div>
  </div>

  {products.length === 0 && (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      ยังไม่มีสินค้า
    </div>
  )}

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fill,minmax(300px,1fr))",
      gap: "20px",
    }}
  >
    {products.map((item) => (
      <div
        key={item.id}
        style={{
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 10px 25px rgba(0,0,0,.08)",
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt=""
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            padding: "15px",
          }}
        >
          <h3>
            {item.name}
          </h3>

          <p>
            📂 หมวดหมู่ :
            {item.category}
          </p>

          <p>
            💰 ต้นทุน :
            ฿
            {Number(
              item.cost_price || 0
            ).toLocaleString()}
          </p>

          <p>
            🏷️ ราคาขาย :
            ฿
            {Number(
              item.sell_price || 0
            ).toLocaleString()}
          </p>

          <p>
            📈 กำไร :
            ฿
            {(
              Number(
                item.sell_price || 0
              ) -
              Number(
                item.cost_price || 0
              )
            ).toLocaleString()}
          </p>

          <p>
            📦 สต็อก :
            {item.stock}
          </p>

          <button
            onClick={() =>
              deleteProduct(item.id)
            }
            style={{
              width: "100%",
              marginTop: "12px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🗑️ ลบสินค้า
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


);
}
