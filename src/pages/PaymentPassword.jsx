import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function PaymentPassword() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [popup, setPopup] =
    useState(null);

  async function savePassword() {

    if (password.length !== 6) {
      setPopup({
        type: "error",
        title: "ผิดพลาด",
        message:
          "รหัสชำระเงินต้องมี 6 หลัก",
      });
      return;
    }

    if (!/^\d+$/.test(password)) {
      setPopup({
        type: "error",
        title: "ผิดพลาด",
        message:
          "ใช้ได้เฉพาะตัวเลข 0-9",
      });
      return;
    }

    if (password !== confirm) {
      setPopup({
        type: "error",
        title: "ผิดพลาด",
        message:
          "รหัสยืนยันไม่ตรงกัน",
      });
      return;
    }

    const { error } =
      await supabase
        .from("profiles")
        .update({
          payment_password:
            password,
        })
        .eq("id", user.id);

    if (error) {
      setPopup({
        type: "error",
        title: "บันทึกไม่สำเร็จ",
        message:
          error.message,
      });
      return;
    }

    setPopup({
      type: "success",
      title: "สำเร็จ",
      message:
        "บันทึกรหัสชำระเงินเรียบร้อยแล้ว",
    });

    setPassword("");
    setConfirm("");
  }

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
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() =>
            navigate(-1)
          }
          style={{
            border: "none",
            background:
              "#fff",
            padding:
              "10px 18px",
            borderRadius: 12,
            cursor:
              "pointer",
            fontWeight:
              "bold",
          }}
        >
          ← ย้อนกลับ
        </button>

        <div
          style={{
            background:
              "#fff",
            borderRadius: 30,
            padding: 30,
            marginTop: 20,
            textAlign:
              "center",
            boxShadow:
              "0 15px 40px rgba(0,0,0,.15)",
          }}
        >
          <div
            style={{
              fontSize: 70,
            }}
          >
            🔒
          </div>

          <h1
            style={{
              marginBottom: 10,
            }}
          >
            รหัสชำระเงิน
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: 25,
            }}
          >
            ใช้ยืนยันการถอนเงิน
            และการชำระสินค้า
          </p>

          <input
            type="password"
            maxLength={6}
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="รหัส 6 หลัก"
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 15,
              border:
                "2px solid #e5e7eb",
              marginBottom: 15,
              fontSize: 18,
              textAlign:
                "center",
            }}
          />

          <input
            type="password"
            maxLength={6}
            value={confirm}
            onChange={(e) =>
              setConfirm(
                e.target.value
              )
            }
            placeholder="ยืนยันรหัสอีกครั้ง"
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 15,
              border:
                "2px solid #e5e7eb",
              marginBottom: 20,
              fontSize: 18,
              textAlign:
                "center",
            }}
          />

          <button
            onClick={
              savePassword
            }
            style={{
              width: "100%",
              padding: 15,
              border: "none",
              borderRadius: 15,
              background:
                "linear-gradient(135deg,#4f46e5,#8b5cf6)",
              color:
                "#fff",
              fontWeight:
                "bold",
              fontSize: 18,
              cursor:
                "pointer",
            }}
          >
            บันทึกรหัส
          </button>
        </div>
      </div>

      {popup && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.6)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width:
                "90%",
              maxWidth:
                420,
              background:
                "#fff",
              borderRadius:
                25,
              padding: 30,
              textAlign:
                "center",
            }}
          >
            <div
              style={{
                fontSize: 70,
              }}
            >
              {popup.type ===
              "success"
                ? "✅"
                : "❌"}
            </div>

            <h2>
              {popup.title}
            </h2>

            <p>
              {popup.message}
            </p>

            <button
              onClick={() => {
                if (
                  popup.type ===
                  "success"
                ) {
                  navigate(
                    "/profile"
                  );
                }

                setPopup(
                  null
                );
              }}
              style={{
                width:
                  "100%",
                padding:
                  14,
                border:
                  "none",
                borderRadius:
                  15,
                background:
                  "#4f46e5",
                color:
                  "#fff",
                fontWeight:
                  "bold",
                marginTop:
                  15,
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