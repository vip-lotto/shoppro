import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [popup, setPopup] =
    useState(null);

  async function changePassword() {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPopup({
        type: "error",
        title: "ข้อมูลไม่ครบ",
        message: "กรุณากรอกข้อมูลให้ครบ",
      });
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setPopup({
        type: "error",
        title: "รหัสไม่ตรงกัน",
        message:
          "กรุณาตรวจสอบรหัสผ่านใหม่",
      });
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data) {
      setPopup({
        type: "error",
        title: "ไม่พบผู้ใช้",
        message: "เกิดข้อผิดพลาด",
      });
      return;
    }

    if (data.password !== oldPassword) {
      setPopup({
        type: "error",
        title: "รหัสผ่านเดิมไม่ถูกต้อง",
        message:
          "กรุณากรอกรหัสผ่านเดิมให้ถูกต้อง",
      });
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        password: newPassword,
      })
      .eq("id", user.id);

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
        "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
    });

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "#fff",
            padding: "10px 16px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← ย้อนกลับ
        </button>

        <div
          style={{
            background: "#fff",
            borderRadius: 25,
            marginTop: 20,
            padding: 25,
          }}
        >
          <h2>
            🔒 เปลี่ยนรหัสผ่าน
          </h2>

          <input
            type="password"
            placeholder="รหัสผ่านเก่า"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 10,
            }}
          />

          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 10,
            }}
          />

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 20,
            }}
          />

          <button
            onClick={changePassword}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 15,
              background:
                "linear-gradient(135deg,#4f46e5,#8b5cf6)",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>
      </div>

      {popup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 400,
              background: "#fff",
              borderRadius: 25,
              padding: 30,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 70,
              }}
            >
              {popup.type === "success"
                ? "✅"
                : "❌"}
            </div>

            <h2>{popup.title}</h2>

            <p>{popup.message}</p>

            <button
              onClick={() =>
                setPopup(null)
              }
              style={{
                width: "100%",
                padding: 14,
                border: "none",
                borderRadius: 15,
                background:
                  "#4f46e5",
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