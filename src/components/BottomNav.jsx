import { useState } from "react";

import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlinePlus,
} from "react-icons/ai";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../services/supabase";
import "./BottomNav.css";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);


  const handleShopClick = async () => {
    try {
      const { data: shop, error } = await supabase
        .from("shops")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        navigate("/open-shop");
        return;
      }

      // ยังไม่มีร้าน
      if (!shop) {
        navigate("/open-shop");
        return;
      }

      // รออนุมัติ
      if (shop.status === "pending") {
  setPopup({
    type: "error",
    title: "แจ้งเตือน",
    message:
      "ร้านค้าของคุณรอการตรวจสอบ",
  });
  return;
}

      // ไม่อนุมัติ
      if (shop.status === "rejected") {
  setPopup({
    type: "error",
    title: "แจ้งเตือน",
    message:
      "ร้านค้าของคุณไม่ผ่านการตรวจสอบ กรุณาสมัครใหม่",
  });

  return;
}

      // อนุมัติแล้ว
      if (shop.status === "approved") {
        navigate("/products");
        return;
      }

      navigate("/open-shop");
    } catch (err) {
      console.error(err);
      navigate("/open-shop");
    }
  };

  return (
    <div className="bottom-nav">

      <Link
        to="/home"
        className={`nav-item ${
          location.pathname === "/home"
            ? "active"
            : ""
        }`}
      >
        <AiOutlineHome />
        <span>หน้าแรก</span>
      </Link>

      <Link
        to="/products"
        className={`nav-item ${
          location.pathname === "/products"
            ? "active"
            : ""
        }`}
      >
        <AiOutlineShopping />
        <span>สินค้า</span>
      </Link>

      <button
        className="center-btn"
        onClick={handleShopClick}
      >
        <AiOutlinePlus />
      </button>

      <Link
        to="/cart"
        className={`nav-item ${
          location.pathname === "/cart"
            ? "active"
            : ""
        }`}
      >
        <AiOutlineShoppingCart />
        <span>รถเข็น</span>
      </Link>

      <Link
        to="/profile"
        className={`nav-item ${
          location.pathname === "/profile"
            ? "active"
            : ""
        }`}
      >
        <AiOutlineUser />
        <span>โปรไฟล์</span>
      </Link>


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
        
        ⌛️
      </div>

      <h2
        style={{
          color: "#e70f62",
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
        onClick={() => {
          setPopup(null);

          if (
            popup.message.includes(
              "ไม่ผ่านการอนุมัติ"
            )
          ) {
            navigate("/open-shop");
          }
        }}
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