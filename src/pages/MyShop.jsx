import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import BottomNav from "../components/BottomNav";

export default function MyShop() {
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [search, setSearch] = useState("");

  

  useEffect(() => {
  loadShopProducts();
}, []);

const loadShopProducts = async () => {
  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data: shopData, error } =
  await supabase
    .from("shops")
    .select("*")
    .eq("user_id", user.id)
    .single();

console.log("USER =", user);
console.log("SHOP =", shopData);
console.log("STATUS =", shopData?.status);

    if (!shopData) {
      setShop(null);
      return;
    }

    setShop(shopData);

    const { data } =
      await supabase
        .from("shop_products")
        .select(`
          id,
          products (
            id,
            name,
            image,
            category,
            sell_price,
            stock
          )
        `)
        .eq("shop_id", shopData.id);

    setProducts(data || []);

  } catch (err) {
    console.log(err);
  }
};

  const removeProduct = async (id) => {
    const ok = window.confirm(
      "ต้องการลบสินค้าออกจากร้าน ?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("shop_products")
      .delete()
      .eq("id", id);

    if (!error) {
      loadShopProducts();
    }
  };

  const limitMap = {
    1: 30,
    2: 100,
    3: 500,
    4: 5000,
    5: 999999,
  };

  const maxProducts =
    limitMap[shop?.shop_star || 1];

  const remainProducts =
    maxProducts - products.length;

  const filteredProducts =
    products.filter((item) =>
      item.products?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
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
      <h2>ร้านของฉัน</h2>

      {shop && (
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>{shop.shop_name}</h3>

          <p>
  รหัสร้าน :
  <b>{shop.shop_code}</b>
</p>


          <p>
            ระดับร้าน :
            {" "}
            {"⭐".repeat(
              shop.shop_star || 1
            )}
          </p>

          <p>
  สถานะ :
  <b
    style={{
      color:
        shop.status?.trim() === "approved"
          ? "green"
          : "orange",
    }}
  >
    {
      shop.status?.trim() === "approved"
        ? "อนุมัติแล้ว"
        : shop.status?.trim() === "pending"
        ? "รออนุมัติ"
        : "ไม่อนุมัติ"
    }
  </b>
</p>

          <p>
            จำนวนสินค้า :
            {products.length}
          </p>

          <p>
            เพิ่มได้อีก :
            {" "}
            {remainProducts}
            {" "}
            ชิ้น
          </p>
        </div>
      )}

      

      {shop && shop.status === "approved" && (
  <button
    onClick={() => (window.location.href = "/products")}
    style={{
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "#ff3366",
      color: "#fff",
      fontWeight: "bold",
      marginBottom: "15px",
      cursor: "pointer",
    }}
  >
    + เพิ่มสินค้าเข้าร้าน
  </button>
)}

{shop && shop.status === "pending" && (
  <button
    disabled
    style={{
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "#999",
      color: "#fff",
      fontWeight: "bold",
      marginBottom: "15px",
    }}
  >
    รอแอดมินอนุมัติร้าน
  </button>
)}

{!shop && (
  <button
    onClick={() => (window.location.href = "/open-shop")}
    style={{
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "#3b82f6",
      color: "#fff",
      fontWeight: "bold",
      marginBottom: "15px",
      cursor: "pointer",
    }}
  >
    🏪 เปิดร้านค้า
  </button>
)}
    {shop?.status === "approved" && (
  <>
      <input
        type="text"
        placeholder="ค้นหาสินค้าในร้าน..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "20px",
          outline: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,1fr)",
          gap: "15px",
        }}
      >
        {filteredProducts.map(
          (item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >
              <img
                src={
                  item.products?.image
                }
                alt=""
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "10px",
                }}
              >
                <h4>
                  {
                    item.products
                      ?.name
                  }
                </h4>

                <p>
                  {
                    item.products
                      ?.category
                  }
                </p>

                <p
                  style={{
                    color:
                      "#ff3366",
                    fontWeight:
                      "bold",
                    fontSize:
                      "18px",
                  }}
                >
                  ฿
                  {Number(
                    item.products
                      ?.sell_price ||
                      0
                  ).toLocaleString()}
                </p>

                <button
                  onClick={() =>
                    removeProduct(
                      item.id
                    )
                  }
                  style={{
                    width:
                      "100%",
                    marginTop:
                      "10px",
                    border:
                      "none",
                    padding:
                      "10px",
                    borderRadius:
                      "10px",
                    background:
                      "#ef4444",
                    color:
                      "#fff",
                    cursor:
                      "pointer",
                  }}
                >
                  ลบสินค้า
                </button>
              </div>
                  </div>
    ))}
      </div>
    </>
)}

      <BottomNav />
    </div>
  );
}