import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import BottomNav from "../components/BottomNav";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");
  const [showCategory, setShowCategory] =
    useState(false);
  const [shopStatus, setShopStatus] =
    useState(null);
    const [popup, setPopup] =
  useState(null);
  

  const categories = [
  "เครื่องใช้ไฟฟ้า",
  "เครื่องประดับ",
  "กล้องถ่ายรูป",
  "เครื่องครัว",
  "อิเล็กทรอนิกส์",
  "แคมปิ้ง",
  "เฟอร์นิเจอร์",
  "รถยนต์และอะไหล่",
  "อุปกรณ์ก่อสร้าง",
  "เสื้อผ้าแฟชั่น",
];

  useEffect(() => {
    loadProducts();
    loadShop();
  }, []);

  const loadProducts = async () => {
  const { data } = await supabase
  .from("products")
  .select("*")
  .order("created_at", {
    ascending: false,
  });

  setProducts(data || []);
};

  const loadShop = async () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    setShopStatus(null);
    return;
  }

  const { data, error } = await supabase
    .from("shops")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    setShopStatus(null);
    return;
  }

  setShopStatus(data.status);
};

  const addToShop = async (productId) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        setPopup({
  type: "error",
  title: "แจ้งเตือน",
  message: "กรุณาเข้าสู่ระบบ",
});
        return;
      }

      const {
        data: shop,
        error: shopError,
      } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (shopError || !shop) {
        setPopup({
  type: "error",
  title: "แจ้งเตือน",
  message: "กรุณาเปิดร้านค้าก่อน",
});
        window.location.href =
          "/open-shop";
        return;
      }

      if (shop.status !== "approved") {
        setPopup({
  type: "error",
  title: "แจ้งเตือน",
  message:
    "ร้านของคุณกำลังรออนุมัติจากแอดมิน",
});
        return;
      }

      const { data: exist } =
        await supabase
          .from("shop_products")
          .select("*")
          .eq("shop_id", shop.id)
          .eq("product_id", productId)
          .maybeSingle();

      if (exist) {
        setPopup({
  type: "error",
  title: "แจ้งเตือน",
  message: "สินค้านี้อยู่ในร้านแล้ว",
});
        return;
      }

      const { error } = await supabase
        .from("shop_products")
        .insert([
          {
            shop_id: shop.id,
            product_id: productId,
          },
        ]);

      if (error) {
        setPopup({
  type: "error",
  title: "เกิดข้อผิดพลาด",
  message: error.message,
});
        return;
      }

      setPopup({
  type: "success",
  title: "สำเร็จ",
  message:
    "เพิ่มสินค้าเข้าร้านสำเร็จ 🎉",
});
    } catch (err) {
      console.log(err);
      setPopup({
  type: "error",
  title: "เกิดข้อผิดพลาด",
  message: "เกิดข้อผิดพลาด",
});
    }
  };

  const filteredProducts = products.filter(
    (item) => {
      const matchSearch =
  (item.name || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (item.category || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (item.shop_name || "")
    .toLowerCase()
    .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === ""
          ? true
          : item.category ===
            selectedCategory;

      return (
        matchSearch && matchCategory
      );
    }
  );

  return (
    <div
      className="products-page"
      style={{
        padding: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() =>
            setShowCategory(
              !showCategory
            )
          }
          style={{
            border: "none",
            background: "#fff",
            padding: "12px 16px",
            borderRadius: "30px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.1)",
          }}
        >
          ☰ Category
        </button>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            border: "none",
            background: "#fff",
            borderRadius: "30px",
            padding: "12px 16px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.1)",
          }}
        />
      </div>

      

{selectedCategory && (
  <div
    style={{
      marginBottom: "15px",
      fontWeight: "bold",
      color: "#ff3366",
    }}
  >
    หมวด : {selectedCategory}
  </div>
)}

{showCategory && (
  <div className="category-menu">

    

    <div
      className="category-item"
      onClick={() => {
        setSelectedCategory("");
        setShowCategory(false);
      }}
    >
      🔥 ทั้งหมด
    </div>

    {categories.map((cat) => (
      <div
        key={cat}
        className="category-item"
        onClick={() => {
          setSelectedCategory(cat);
          setShowCategory(false);
        }}
      >
        {cat}
      </div>
    ))}

  </div>
)}
      <h2>สินค้าทั้งหมด</h2>

      <div className="product-grid">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="product-card"
          >
            <img
              src={item.image}
              alt={item.name}
            />

            <div className="product-info">
              <h4>{item.name}</h4>

              <p>{item.category}</p>

              

              <p
                style={{
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                🏪 {item.shop_name}
              </p>

              <p
                style={{
                  color: "#f59e0b",
                  fontSize: "13px",
                }}
              >
                ⭐ {item.shop_star}
              </p>

              <p className="price">
                ฿
                {Number(
                  item.sell_price || 0
                ).toLocaleString()}
              </p>

              <button
                disabled={
                  shopStatus === "pending"
                }
                onClick={() =>
                  addToShop(item.id)
                }
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    shopStatus ===
                    "approved"
                      ? "#3a44cf"
                      : "#999",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor:
                    shopStatus ===
                    "approved"
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                {
  shopStatus === "approved"
    ? "เพิ่มเข้าร้าน"
    : shopStatus === "pending"
    ? "รออนุมัติร้าน"
    : "เปิดร้านก่อน"
}
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />

      {popup && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "450px",
        background: "#fff",
        borderRadius: "28px",
        padding: "35px",
        textAlign: "center",
        boxShadow:
          "0 15px 40px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          fontSize: "85px",
          marginBottom: "10px",
        }}
      >
        {popup.type === "success"
          ? "✅"
          : "❌"}
      </div>

      <h2
        style={{
          color: "#ff3366",
          marginBottom: "15px",
        }}
      >
        {popup.title}
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "25px",
          fontSize: "18px",
        }}
      >
        {popup.message}
      </p>

      <button
        onClick={() =>
          setPopup(null)
        }
        style={{
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "15px",
          background: "#ff3366",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer",
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