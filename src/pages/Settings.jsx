import { useNavigate } from "react-router-dom";

export default function SettingsPage() {

const navigate = useNavigate();

function logout() {
localStorage.clear();
window.location.replace("/login");
}

const menus = [
{
  icon: "👤",
  title: "ข้อมูลส่วนตัว",
  desc: "บัญชีธนาคาร และ ที่อยู่จัดส่ง",
  path: "/profile-info"
},
{
icon: "🔒",
title: "เปลี่ยนรหัสผ่าน",
desc: "เปลี่ยนรหัสผ่านเข้าสู่ระบบ",
path: "/change-password",
},
{
icon: "📸",
title: "รูปโปรไฟล์",
desc: "จัดการรูปภาพโปรไฟล์",
path: "/profile-image",
},
{
icon: "🪪",
title: "ยืนยันตัวตน (KYC)",
desc: "อัปโหลดเอกสารยืนยันตัวตน",
path: "/kyc",
},
];

return (
<div
style={{
minHeight: "100vh",
background:
"linear-gradient(135deg,#4f46e5,#8b5cf6)",
padding: 20,
}}
>
<div
style={{
maxWidth: 550,
margin: "0 auto",
}}
>
<button
  onClick={() => navigate("/profile")}
  style={{
    border: "none",
    background: "#fff",
    padding: "12px 18px",
    borderRadius: 15,
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  ← ย้อนกลับ
</button>


    <div
      style={{
        marginTop: 20,
        background: "rgba(255,255,255,.15)",
        backdropFilter: "blur(20px)",
        borderRadius: 30,
        padding: 25,
        color: "#fff",
      }}
    >
      <h1>⚙️ ตั้งค่า</h1>

      <p>
        จัดการข้อมูลบัญชีและความปลอดภัย
      </p>
    </div>

    <div style={{ marginTop: 25 }}>

      {menus.map((item) => (
        <div
          key={item.title}
          onClick={() =>
            navigate(item.path)
          }
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: "#f5f5ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {item.icon}
            </div>

            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#888",
                }}
              >
                {item.desc}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#999",
            }}
          >
            ›
          </div>
        </div>
      ))}

      <div
        onClick={logout}
        style={{
          background: "#ef4444dc",
          color: "#ffffffe2",
          borderRadius: 24,
          padding: 20,
          cursor: "pointer",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
          marginTop: 20,
        }}
      >
         ออกจากระบบ
      </div>

    </div>
  </div>
</div>


);
}
