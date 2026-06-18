import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  const openPopup = (text) => {
    setPopupText(text);
    setShowPopup(true);
  };

  const handleLogin = async () => {
    if (!login || !password) {
      openPopup("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`mobile.eq.${login},username.eq.${login}`)
      .eq("password", password)
      .single();

    if (error || !data) {
      openPopup("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    openPopup("เข้าสู่ระบบสำเร็จ 🎉");

    setTimeout(() => {
        window.location.replace("/home");
    }, 1000);
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">

          <img
            src="/SHOPPRO.png"
            alt="SHOPPRO"
            className="login-logo"
          />

          <h2 className="login-title">
            SHOPPRO
          </h2>

          <p className="login-subtitle">
            เข้าสู่ระบบ
          </p>

          <input
            type="text"
            placeholder="เบอร์โทร หรือ ชื่อผู้ใช้"
            value={login}
            onChange={(e) =>
              setLogin(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="login-btn"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </button>

          <div
            className="login-link"
            onClick={() =>
              navigate("/register")
            }
          >
            สมัครสมาชิก
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