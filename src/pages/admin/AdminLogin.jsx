import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function login() {

  if (!username || !password) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  setLoading(true);

  const { data, error } =
  await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .eq("password", password);

console.log("DATA =", data);
console.log("ERROR =", error);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    return;
  }

  localStorage.setItem(
  "admin",
  JSON.stringify(data[0])
);

console.log(
  "ADMIN SAVED",
  localStorage.getItem("admin")
);

window.location.href = "/admin";
}

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#4f46e5,#7c3aed)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: 30,
          borderRadius: 25,
          boxShadow:
            "0 10px 30px rgba(0,0,0,.15)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          SHOPPRO ADMIN
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 25,
          }}
        >
          เข้าสู่ระบบผู้ดูแล
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #ddd",
            marginBottom: 15,
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #ddd",
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            height: 50,
            border: "none",
            borderRadius: 12,
            background: "#4f46e5",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading
            ? "กำลังเข้าสู่ระบบ..."
            : "เข้าสู่ระบบ"}
        </button>
      </div>
    </div>
  );
}