import { useNavigate } from "react-router-dom";

export default function Transaction() {
const navigate = useNavigate();

const menus = [
{
icon: "🏦",
title: "บัญชีธนาคาร",
desc: "จัดการบัญชีสำหรับถอนเงิน",
path: "/bank-account",
},
{
icon: "📍",
title: "ที่อยู่จัดส่ง",
desc: "ใช้สำหรับรับสินค้า",
path: "/address",
},
{
icon: "💰",
title: "ประวัติฝากเงิน",
desc: "ตรวจสอบรายการฝากเงิน",
path: "/deposit-history",
},
{
icon: "💸",
title: "ประวัติถอนเงิน",
desc: "ตรวจสอบรายการถอนเงิน",
path: "/withdraw-history",
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
onClick={() => navigate(-1)}
style={{
border: "none",
background: "#fff",
padding: "12px 18px",
borderRadius: 15,
fontWeight: "bold",
cursor: "pointer",
boxShadow:
"0 5px 15px rgba(0,0,0,.15)",
}}
>
← ย้อนกลับ </button>


    <div
      style={{
        marginTop: 20,
        background:
          "rgba(255,255,255,.15)",
        backdropFilter: "blur(20px)",
        borderRadius: 30,
        padding: 25,
        color: "#fff",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 32,
        }}
      >
        💳 ธุรกรรม
      </h1>

      <p
        style={{
          opacity: .9,
          marginTop: 10,
        }}
      >
        จัดการข้อมูลการเงินและบัญชีของคุณ
      </p>
    </div>

    <div
      style={{
        marginTop: 25,
      }}
    >
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
            justifyContent:
              "space-between",
            cursor: "pointer",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.12)",
            transition: ".2s",
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
                background:
                  "#f5f5ff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
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
                  marginTop: 3,
                }}
              >
                {item.desc}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 26,
              color: "#999",
            }}
          >
            ›
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


);
}
