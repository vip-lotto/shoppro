import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "/SHOPPRO.png";

export default function Register() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  const openPopup = (text) => {
    setPopupText(text);
    setShowPopup(true);
  };

  const handleRegister = async () => {
if (!mobile || !username || !password || !confirm) {
openPopup("กรุณากรอกข้อมูลให้ครบ");
return;
}

if (password !== confirm) {
openPopup("รหัสผ่านไม่ตรงกัน");
return;
}

const memberId =
"M" +
Math.floor(
10000 + Math.random() * 90000
);

const inviteCode =
"SHOP" +
Math.floor(
1000 + Math.random() * 9000
);

const customerCode =
"CUS" +
Math.floor(
100000 + Math.random() * 900000
);

const { data, error } =
await supabase
.from("profiles")
.insert([
{
member_id: memberId,
username,
shop_name: username,
invite_code: inviteCode,
customer_code: customerCode,
balance: 0,
role: "member",
mobile,
password,


verified: false,

status: "active",

avatar_url:
"https://eplvhlcltkjbrhibaskv.supabase.co/storage/v1/object/public/avatars/SHOPPRO.png",

}
])
.select()
.single();

if (error) {
openPopup(
"สมัครสมาชิกไม่สำเร็จ\n" +
error.message
);
return;
}

await supabase
.from("wallets")
.insert([
{
user_id: data.id,
balance: 0,
},
]);

openPopup(
"สมัครสมาชิกสำเร็จ 🎉"
);

setMobile("");
setUsername("");
setPassword("");
setConfirm("");

setTimeout(() => {
navigate("/login");
}, 1500);
};


  return (
    <>
      <div className="register-page">
        <div className="register-card">

          <div className="register-header">

            <img
              src={logo}
              alt="SHOPPRO"
              className="register-logo"
            />

            <h2 className="register-title">
              SHOPPRO
            </h2>

            <p className="register-subtitle">
              สมัครสมาชิกเพื่อเริ่มขายสินค้า
            </p>

          </div>

          <div className="register-tabs">
            <span className="active">
              เบอร์โทรศัพท์
            </span>
          </div>

          <input
            type="text"
            placeholder="เบอร์โทรศัพท์"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value)
            }
          />

          <label>*Name</label>

          <input
            type="text"
            placeholder="ชื่อ และ นามสกุล"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <label>*Password</label>

          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <label>*Confirm</label>

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านอีกครั้ง"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
          />

          <button
            className="register-btn"
            onClick={handleRegister}
          >
            สมัครสมาชิก
          </button>

          <div
            className="login-link"
            onClick={() =>
              navigate("/login")
            }
          >
            กลับเพื่อเข้าสู่ระบบ
          </div>

        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">

            <div className="popup-icon">
              {popupText.includes("สำเร็จ")
                ? "✓"
                : "✕"}
            </div>

            <h2>แจ้งเตือน</h2>

            <p>{popupText}</p>

            <button
              className="popup-btn"
              onClick={() =>
                setShowPopup(false)
              }
            >
              ตกลง
            </button>

          </div>
        </div>
      )}
    </>
  );
}
