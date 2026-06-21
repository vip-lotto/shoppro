import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";


export default function Checkout() {
  const navigate = useNavigate();
const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [province, setProvince] = useState("");
const [district, setDistrict] = useState("");
const [village, setVillage] = useState("");
const [orderCode, setOrderCode] = useState("");
const [showSuccess, setShowSuccess] =
  useState(false);
const [popup, setPopup] =
  useState(null);
  


const saveAddress = async () => {
try {
if (!fullName) {
setPopup({
  type: "error",
  title: "ข้อมูลไม่ครบ",
  message: "กรุณากรอกชื่อผู้รับ",
});
return;
}


  if (!phone) {
    setPopup({
    title: "ข้อมูลไม่ครบ",
    message: "กรุณากรอกเบอร์โทร",
  });
    return;
  }

  if (!province) {
  setPopup({
    title: "ข้อมูลไม่ครบ",
    message: "กรุณากรอกจังหวัด",
  });
  return;
}

  if (!district) {
    setPopup({
    title: "ข้อมูลไม่ครบ",
    message: "กรุณากรอกเมือง",
  });
    return;
  }

  if (!village) {
    setPopup({
    title: "ข้อมูลไม่ครบ",
    message: "กรุณากรอกที่อยู่",
  });
    return;
  }

  if (!orderCode) {
    setPopup({
    title: "ข้อมูลไม่ครบ",
    message: "กรุณากรอกรหัสสั่งซื้อ",
  });
    return;
  }

  // ตรวจรหัสสั่งซื้อ
  const {
  data: codeData,
  error: codeError,
} = await supabase
  .from("order_codes")
  .select("*")
  .eq("code", orderCode)
  .eq("status", "unused");

  console.log("CODE DATA =", codeData);
console.log("CODE ERROR =", codeError);
console.log("ORDER CODE =", orderCode);

  if (codeError) {
  setPopup({
    title: "ระบบผิดพลาด",
    message: codeError.message,
  });
  return;
}

  if (!codeData || codeData.length === 0) {
    setPopup({
      title: "รหัสไม่ถูกต้อง",
      message:
    "กรุณาใส่รหัสสั่งชิ้อใหม่",
  });
  return;
  }

  

  // ดึงสินค้าในตะกร้า
  const user = JSON.parse(
  localStorage.getItem("user")
);
  
const {
  data: cartItems,
  error: cartError,
} = await supabase
  .from("cart_view")
  .select("*")
  .eq("user_id", user.id);

  if (cartError) {
  setPopup({
    title: "ระบบผิดพลาด",
    message: cartError.message,
  });
  return;
}

  if (!cartItems || cartItems.length === 0) {
    setPopup({
  title: "ไม่พบสินค้า",
  message: "ไม่มีสินค้าในตะกร้า",
});
    return;
  }

  // สร้าง Order
  for (const item of cartItems) {

    console.log("INSERT ORDER =", {
      shop_id: item.shop_id,
      product_id: item.product_id,
      customer_name: fullName,
      phone,
      province,
      district,
      village,
      customer_code: orderCode,
      qty: item.qty,
      total_price: item.total_price || 0,
      status: "pending",
    });

    


    const orderNumber =
  "SP" + Date.now();

console.log(
  "ORDER NUMBER =",
  orderNumber
);
    
      const totalPrice =
  Number(item.sell_price || 0) *
  Number(item.qty || 1);

const costPrice =
  Number(item.cost_price || 0) *
  Number(item.qty || 1);

const profit =
  totalPrice - costPrice;

const { error: orderError } =
await supabase
  .from("orders")
  .insert([
    {
      order_code: orderNumber,

      shop_id: item.shop_id,
      product_id: item.product_id,

      customer_name: fullName,

      phone,
      province,
      district,
      village,

      customer_code: orderCode,

      qty: item.qty,

      total_price:
        (item.sell_price || 0) *
        (item.qty || 1),

      cost_price:
        (item.cost_price || 0) *
        (item.qty || 1),

      profit:
        ((item.sell_price || 0) -
         (item.cost_price || 0))
         * (item.qty || 1),

      owner_paid: false,

      status: "pending",
    },
  ]);

if (orderError) {

      console.log(
        "ORDER ERROR =",
        orderError
      );

      setPopup({
  title: "สร้างคำสั่งซื้อไม่สำเร็จ",
  message: orderError.message,
});
return;
    }
  }


  await supabase
  .from("order_codes")
  .update({
    status: "used",
  })
  .eq("code", orderCode);

  // ล้างตะกร้า
  

await supabase
  .from("cart_items")
  .delete()
  .eq("user_id", user.id);
    localStorage.removeItem("cart");

    window.dispatchEvent(
  new Event("storage")
);

  setFullName("");
setPhone("");
setProvince("");
setDistrict("");
setVillage("");
setOrderCode("");

setShowSuccess(true);


} catch (err) {
  console.log(err);
  setPopup({
  title: "เกิดข้อผิดพลาด",
  message: err.message,
});
}


};

return (
<div
style={{
maxWidth: "650px",
margin: "20px auto",
background: "#fff",
padding: "25px",
borderRadius: "20px",
boxShadow:
"0 2px 20px rgba(0,0,0,.08)",
}}
>
<div
  style={{
    position: "relative",
    marginBottom: 25
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
      boxShadow: "0 4px 12px rgba(0,0,0,.08)"
    }}
  >
    ← ย้อนกลับ
  </button>

  <h2
    style={{
      textAlign: "center",
      marginTop: -35,
      color: "#ff3366"
    }}
  >
    📦 ที่อยู่จัดส่ง
  </h2>
</div>


  <input
    autoComplete="off"
    placeholder="ชื่อผู้รับ"
    value={fullName}
    onChange={(e) =>
      setFullName(e.target.value)
    }
    style={inputStyle}
  />

  <input
    autoComplete="off"
    placeholder="เบอร์โทร"
    value={phone}
    onChange={(e) =>
      setPhone(e.target.value)
    }
    style={inputStyle}
  />

  <input
    autoComplete="off"
    placeholder="แขวง / จังหวัด"
    value={province}
    onChange={(e) =>
      setProvince(e.target.value)
    }
    style={inputStyle}
  />

  <input
    autoComplete="off"
    placeholder="เมือง"
    value={district}
    onChange={(e) =>
      setDistrict(e.target.value)
    }
    style={inputStyle}
  />

  <input
    autoComplete="off"
    placeholder="บ้าน / ที่อยู่"
    value={village}
    onChange={(e) =>
      setVillage(e.target.value)
    }
    style={inputStyle}
  />

  <input
    autoComplete="off"
    placeholder="รหัสสั่งซื้อจากแอดมิน"
    value={orderCode}
    onChange={(e) =>
      setOrderCode(e.target.value)
    }
    style={inputStyle}
  />

  <button
    onClick={saveAddress}
    style={{
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "12px",
      background: "#ff3366",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    }}
  >
    ยืนยันคำสั่งซื้อ
  </button>

    {showSuccess && (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "60px" }}>
          🎉
        </div>

        <h2
          style={{
            color: "#16a34a",
          }}
        >
          สั่งซื้อสำเร็จ
        </h2>

        <p>
          ขอบคุณสำหรับคำสั่งซื้อ
          <br />
          เลือกดูสินค้าใหม่ได้เลย
        </p>

        <button
          onClick={() => {
  window.location.href = "/products";
}}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#ff3366",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🛍️ เลือกดูสินค้าเข้าใหม่
        </button>

        <button
  onClick={() =>
    setShowSuccess(false)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
  }}
>
  ปิดหน้าต่าง
</button>
      </div>
    </div>
  )}

  {popup && (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <div
  style={{
    fontSize: "70px",
    marginBottom: "10px",
  }}
>
  ❌
</div>

        <h2>{popup.title}</h2>

        <p>{popup.message}</p>

        <button
          onClick={() =>
            setPopup(null)
          }
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#ff3366",
            color: "#fff",
            fontWeight: "bold",
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

const inputStyle = {
  width: "100%",
  padding: "14px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  marginBottom: "12px",
  fontSize: "15px",
  boxSizing: "border-box",
};