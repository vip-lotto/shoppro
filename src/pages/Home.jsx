import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import BottomNav from "../components/BottomNav";
import "./Home.css";

export default function Home() {
  const banners = [
    "/ads01.png",
    "/ads02.png",
    "/ads03.png",
    "/ads04.png",
    "/ads05.png",
    
  ];

  const [current, setCurrent] = useState(0);
  const [showCategory, setShowCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
  useState("");
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState(null);


  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("product_shop_view")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setProducts(data || []);
};

const addToCart = async (item) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
  setPopup({
    type: "error",
    title: "แจ้งเตือน",
    message: "กรุณาเข้าสู่ระบบก่อน",
  });
  return;
}

  const { error } = await supabase
    .from("cart_items")
    .insert([
      {
        user_id: user.id,
        product_id: item.id,
        shop_id: item.shop_id,
        qty: 1,
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
  message: "เพิ่มสินค้าเข้าตะกร้าเรียบร้อยแล้ว 🎉",
});
};

useEffect(() => {
  loadProducts();
}, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1
          ? 0
          : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page">

      <div className="top-bar">

        <button
          className="category-btn"
          onClick={() =>
            setShowCategory(!showCategory)
          }
        >
          ☰ Category
        </button>

        <input
          type="text"
          placeholder="ค้นหาสินค้าหรือชื่อร้าน..."
          className="search-box"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {selectedCategory && (
  <div
    style={{
      marginTop: "10px",
      fontWeight: "bold",
      color: "#ff3366",
    }}
  >
    หมวด : {selectedCategory}
  </div>
)}

      </div>

      {showCategory && (
        <div className="category-menu">
          <div onClick={() => setSelectedCategory("")}>
  🔥 ทั้งหมด
</div>

<div onClick={() => setSelectedCategory("เครื่องใช้ไฟฟ้า")}>
  🏠 เครื่องใช้ไฟฟ้า
</div>

<div onClick={() => setSelectedCategory("เครื่องประดับ")}>
  💍 เครื่องประดับ
</div>

<div onClick={() => setSelectedCategory("กล้องถ่ายรูป")}>
  📷 กล้องถ่ายรูป
</div>

<div onClick={() => setSelectedCategory("เครื่องครัว")}>
  🍳 เครื่องครัว
</div>

<div onClick={() => setSelectedCategory("อิเล็กทรอนิกส์")}>
  💻 อิเล็กทรอนิกส์
</div>

<div onClick={() => setSelectedCategory("แคมปิ้ง")}>
  🏕️ แคมปิ้ง
</div>

<div onClick={() => setSelectedCategory("เฟอร์นิเจอร์")}>
  🪑 เฟอร์นิเจอร์
</div>

<div onClick={() => setSelectedCategory("รถยนต์และอะไหล่")}>
  🚗 รถยนต์และอะไหล่
</div>

<div onClick={() => setSelectedCategory("อุปกรณ์ก่อสร้าง")}>
  🔧 อุปกรณ์ก่อสร้าง
</div>

<div onClick={() => setSelectedCategory("เสื้อผ้าแฟชั่น")}>
  👕 เสื้อผ้าแฟชั่น
</div>


        </div>
      )}

      <div className="banner-box">

        <img
          src={banners[current]}
          alt="banner"
          className="banner-image"
        />

       
      </div>

      <h2
        style={{
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        สินค้าทั้งหมด
      </h2>

      <div className="product-grid">

        {products
          .filter((item) => {
  const matchSearch =
    (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (item.shop_name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchCategory =
    !selectedCategory ||
    item.category === selectedCategory;

  return matchSearch && matchCategory;
})
          .map((item) => (
            <div
              key={item.id}
              className="product-card"
            >
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/300"
                }
                alt={item.name}
              />

              <div className="product-info">

                <h4>{item.name}</h4>

                <p className="category">
                  {item.category}
                </p>

                <p
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    margin: "2px 0"
                  }}
                >
                  🏪 {item.shop_name}
                </p>

                <p
                  style={{
                    color: "#f59e0b",
                    fontSize: "11px",
                    margin: "2px 0"
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

                <p className="stock">
                  คงเหลือ {item.stock} ชิ้น
                </p>

                <button
                  onClick={() => addToCart(item)}
                  style={{
                    width: "100%",
                    marginTop: "4px",
                    border: "none",
                    background: "#ff3366",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  เพิ่มเข้าตะกร้า
                </button>
              </div>
            </div>
          ))}

      </div>


       {popup && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
        boxShadow: "0 15px 40px rgba(0,0,0,.25)",
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
          fontSize: "34px",
        }}
      >
        {popup.title}
      </h2>

      <p
        style={{
          color: "#666",
          fontSize: "18px",
          marginBottom: "25px",
        }}
      >
        {popup.message}
      </p>

      <button
        onClick={() => setPopup(null)}
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

      <BottomNav />

      

    </div>
  );
}