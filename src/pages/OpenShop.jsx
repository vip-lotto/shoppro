import { useState } from "react";
import { supabase } from "../services/supabase";
import "./OpenShop.css";

export default function OpenShop() {
  const [shopName, setShopName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] =
  useState(false);

  const handleSubmit = async () => {
    try {

      // อีเมลไม่บังคับ
      if (
        !shopName ||
        !firstName ||
        !lastName ||
        !phone
      ) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      if (!idFront || !idBack) {
        alert("กรุณาอัปโหลดรูปบัตรประชาชน");
        return;
      }

      setLoading(true);

      // ==========================
      // Upload รูปหน้าบัตร
      // ==========================

      const frontFileName =
        "front-" +
        Date.now() +
        "-" +
        idFront.name;

      const {
        error: frontError,
      } = await supabase.storage
        .from("shop-documents")
        .upload(
          frontFileName,
          idFront
        );

      if (frontError) {
        console.log(frontError);
        alert(frontError.message);
        setLoading(false);
        return;
      }

      const frontUrl =
        supabase.storage
          .from("shop-documents")
          .getPublicUrl(
            frontFileName
          ).data.publicUrl;

      // ==========================
      // Upload รูปหลังบัตร
      // ==========================

      const backFileName =
        "back-" +
        Date.now() +
        "-" +
        idBack.name;

      const {
        error: backError,
      } = await supabase.storage
        .from("shop-documents")
        .upload(
          backFileName,
          idBack
        );

      if (backError) {
        console.log(backError);
        alert(backError.message);
        setLoading(false);
        return;
      }

      const backUrl =
        supabase.storage
          .from("shop-documents")
          .getPublicUrl(
            backFileName
          ).data.publicUrl;

      // ==========================
      // บันทึกลงตาราง shops
      // ==========================
      const user = JSON.parse(
  localStorage.getItem("user")
);

if (!user) {
  alert("กรุณาเข้าสู่ระบบ");
  return;
}

      const shopCode = Math.floor(
  10000 + Math.random() * 90000
).toString();

const {
  data,
  error,
} = await supabase
  .from("shops")
  .insert([
  {
    user_id: user.id,

    shop_name: shopName,
    first_name: firstName,
    last_name: lastName,
    phone: phone,

    email:
      email.trim() === ""
        ? null
        : email,

    id_card_front: frontUrl,
    id_card_back: backUrl,

    shop_code: shopCode,
    shop_star: 1,

    status: "pending",
  },
])
  .select();

      console.log(data);

      if (error) {
  console.log("INSERT ERROR =", error);
  alert(JSON.stringify(error));
  setLoading(false);
  return;
}

      setShowSuccess(true);

      setShopName("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");

      setIdFront(null);
      setIdBack(null);

      setLoading(false);

    } catch (err) {
      console.log(err);

      alert("เกิดข้อผิดพลาด");

      setLoading(false);
    }
  };

  return (
    <div className="open-shop-page">

      <div className="shop-card">

        <div className="shop-logo">
          <img
            src="/SHOPPRO.png"
            alt="SHOPPRO"
          />
        </div>

        <h1>เปิดร้านค้าของคุณ</h1>

        <p>
          เริ่มขายสินค้ากับ SHOPPRO ได้ง่ายๆ
        </p>

        <div className="section-title">
          ข้อมูลร้านค้า
        </div>

        <input
          type="text"
          placeholder="ชื่อร้านค้า"
          value={shopName}
          onChange={(e) =>
            setShopName(
              e.target.value
            )
          }
        />

        <div className="section-title">
          ข้อมูลผู้ขาย
        </div>

        <div className="row">

          <input
            type="text"
            placeholder="ชื่อจริง"
            value={firstName}
            onChange={(e) =>
              setFirstName(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="นามสกุล"
            value={lastName}
            onChange={(e) =>
              setLastName(
                e.target.value
              )
            }
          />

        </div>

        <input
          type="text"
          placeholder="เบอร์โทรศัพท์"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
        />

        <input
          type="email"
          placeholder="อีเมล (ไม่บังคับ)"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <div className="upload-box">

          <label>
            รูปบัตรประชาชนด้านหน้า
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setIdFront(
                e.target.files[0]
              )
            }
          />

        </div>

        <div className="upload-box">

          <label>
            รูปบัตรประชาชนด้านหลัง
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setIdBack(
                e.target.files[0]
              )
            }
          />

        </div>

        <button
          className="open-shop-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "กำลังส่ง..."
            : "เปิดร้าน"}
        </button>

      
            </div>

      {showSuccess && (
        <div className="popup-overlay">

          <div className="popup-box">

            <div className="popup-icon">
              ✅
            </div>

            <h2>
              ส่งคำขอสำเร็จ
            </h2>

            <p>
              ร้านค้าของคุณถูกส่งให้แอดมินตรวจสอบแล้ว
              <br />
              กรุณารอการอนุมัติ
            </p>

            <button
              onClick={() =>
                setShowSuccess(false)
              }
            >
              ตกลง
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

    