import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function BankAccount() {
  const navigate = useNavigate();

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setBankName(data.bank_name || "");
      setAccountName(
        data.account_name || ""
      );
      setAccountNumber(
        data.account_number || ""
      );
    }
  }

  async function saveBank() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (
        !bankName ||
        !accountName ||
        !accountNumber
      ) {
        setPopup({
          type: "error",
          title: "ข้อมูลไม่ครบ",
          message:
            "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          bank_name: bankName,
          account_name: accountName,
          account_number:
            accountNumber,
        })
        .eq("id", user.id);

      if (error) {
        setPopup({
          type: "error",
          title: "บันทึกไม่สำเร็จ",
          message: error.message,
        });
        return;
      }

      setPopup({
        type: "success",
        title: "สำเร็จ",
        message:
          "บันทึกข้อมูลบัญชีธนาคารเรียบร้อยแล้ว",
      });
    } catch (err) {
      setPopup({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: err.message,
      });
    }
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
          maxWidth: 550,
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
            marginTop: 20,
            borderRadius: 25,
            padding: 25,
            boxShadow:
              "0 10px 25px rgba(0,0,0,.15)",
          }}
        >
          <h2
            style={{
              color: "#4f46e5",
              marginBottom: 25,
            }}
          >
            🏦 บัญชีธนาคาร
          </h2>

          <div style={{ marginBottom: 15 }}>
            <label>ชื่อเจ้าของบัญชี</label>

            <input
              value={accountName}
              onChange={(e) =>
                setAccountName(
                  e.target.value
                )
              }
              placeholder="ชื่อเจ้าของบัญชี"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                marginTop: 5,
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>ธนาคาร</label>

            <select
              value={bankName}
              onChange={(e) =>
                setBankName(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                marginTop: 5,
              }}
            >
              <option value="">
                เลือกธนาคาร
              </option>

              <option>กรุงเทพ</option>
              <option>กสิกรไทย</option>
              <option>กรุงไทย</option>
              <option>ไทยพาณิชย์</option>
              <option>กรุงศรีอยุธยา</option>
              <option>TTB</option>
              <option>ออมสิน</option>
              <option>ธ.ก.ส.</option>
              <option>อาคารสงเคราะห์</option>
              <option>เกียรตินาคินภัทร</option>
              <option>CIMB Thai</option>
              <option>ยูโอบี</option>
              <option>แลนด์ แอนด์ เฮ้าส์</option>
              <option>ไทยเครดิต</option>
              <option>ICBC</option>
              <option>Standard Chartered</option>
              <option>พร้อมเพย์</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>เลขบัญชี</label>

            <input
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(
                  e.target.value
                )
              }
              placeholder="เลขบัญชี"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                marginTop: 5,
              }}
            />
          </div>

          <button
            onClick={saveBank}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 15,
              background:
                "linear-gradient(135deg,#4f46e5,#8b5cf6)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            💾 บันทึกข้อมูลธนาคาร
          </button>

          <div
            style={{
              marginTop: 25,
              padding: 20,
              borderRadius: 15,
              background: "#f5f6ff",
            }}
          >
            <h3>ข้อมูลปัจจุบัน</h3>

            <p>
              👤 {accountName || "-"}
            </p>

            <p>
              🏦 {bankName || "-"}
            </p>

            <p>
              💳 {accountNumber || "-"}
            </p>
          </div>
        </div>
      </div>

      {popup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "25px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "70px",
              }}
            >
              {popup.type ===
              "success"
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
                padding: "14px",
                border: "none",
                borderRadius: "15px",
                background:
                  "linear-gradient(135deg,#4f46e5,#8b5cf6)",
                color: "#fff",
                fontWeight: "bold",
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