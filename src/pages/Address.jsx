import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Address() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] =
    useState("");

  const [popup, setPopup] =
    useState(null);

  const [addresses, setAddresses] =
    useState([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setAddresses(data || []);
  }

  async function saveAddress() {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      !fullName ||
      !phone ||
      !address ||
      !district ||
      !province ||
      !postalCode
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
      .from("addresses")
      .insert([
        {
          user_id: user.id,
          full_name: fullName,
          phone,
          address,
          district,
          province,
          postal_code: postalCode,
          is_default: true,
        },
      ]);

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
      title: "บันทึกสำเร็จ",
      message:
        "เพิ่มที่อยู่จัดส่งเรียบร้อยแล้ว",
    });

    setFullName("");
    setPhone("");
    setAddress("");
    setDistrict("");
    setProvince("");
    setPostalCode("");

    loadAddresses();
  }

  async function deleteAddress(id) {
    await supabase
      .from("addresses")
      .delete()
      .eq("id", id);

    loadAddresses();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background:
          "linear-gradient(135deg,#4f46e5,#8b5cf6)",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 12,
            fontWeight: "bold",
            cursor: "pointer",
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
              "0 10px 30px rgba(0,0,0,.2)",
          }}
        >
          <h2
            style={{
              color: "#f80743ec",
            }}
          >
            📍 ที่อยู่จัดส่ง
          </h2>

          <input
            placeholder="ชื่อผู้รับ"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="เบอร์โทร"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <textarea
            placeholder="บ้านเลขที่ ถนน"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              height: 90,
            }}
          />

          <input
            placeholder="แขวง/ตำบล"
            value={district}
            onChange={(e) =>
              setDistrict(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="จังหวัด"
            value={province}
            onChange={(e) =>
              setProvince(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            placeholder="รหัสไปรษณีย์"
            value={postalCode}
            onChange={(e) =>
              setPostalCode(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={saveAddress}
            style={{
              width: "100%",
              padding: 15,
              border: "none",
              borderRadius: 15,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#4f46e5,#8b5cf6)",
            }}
          >
            💾 บันทึกที่อยู่
          </button>

          <h3
            style={{
              marginTop: 30,
            }}
          >
            ที่อยู่ของฉัน
          </h3>

          {addresses.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#f4f4ff",
                padding: 15,
                borderRadius: 15,
                marginTop: 10,
              }}
            >
              <b>
                {item.full_name}
              </b>

              <p>{item.phone}</p>

              <p>
                {item.address}
              </p>

              <p>
                {item.district}{" "}
                {item.province}
              </p>

              <p>
                {item.postal_code}
              </p>

              <button
                onClick={() =>
                  deleteAddress(
                    item.id
                  )
                }
                style={{
                  background:
                    "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding:
                    "8px 15px",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                ลบ
              </button>
            </div>
          ))}
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
              background: "#fff",
              width: "90%",
              maxWidth: 420,
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
                padding: 14,
                border: "none",
                borderRadius: 15,
                background:
                  "#5b21b6",
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

const inputStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
  marginBottom: 12,
};