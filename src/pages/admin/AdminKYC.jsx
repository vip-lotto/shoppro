import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

export default function AdminKYC() {

    const navigate = useNavigate();

  const [kycList, setKycList] =
    useState([]);

  useEffect(() => {
    loadKYC();
  }, []);

  async function loadKYC() {

    const { data } =
      await supabase
        .from("kyc")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {
      setKycList(data);
    }
  }

  async function approve(item) {

    await supabase
      .from("kyc")
      .update({
        status: "approved",
      })
      .eq("id", item.id);

    await supabase
      .from("profiles")
      .update({
        kyc_status:
          "approved",
      })
      .eq(
        "id",
        item.user_id
      );

    loadKYC();
  }

  async function reject(item) {

    await supabase
      .from("kyc")
      .update({
        status: "rejected",
      })
      .eq("id", item.id);

    await supabase
      .from("profiles")
      .update({
        kyc_status:
          "rejected",
      })
      .eq(
        "id",
        item.user_id
      );

    loadKYC();
  }

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1>
        🪪 ตรวจสอบ KYC
      </h1>
      <button
          onClick={() =>
            navigate("/admin")
          }
          style={{
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 15,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← กลับหน้าแอดมิน
        </button>




      {kycList.map(
        (item) => (
          <div
            key={item.id}
            style={{
              background:
                "#fff",
              padding: 20,
              borderRadius: 20,
              marginBottom: 20,
              boxShadow:
                "0 5px 15px rgba(0,0,0,.08)",
            }}
          >

            <h3>
              {item.fullname}
            </h3>

            <p>
              เลขบัตร :
              {" "}
              {item.id_card}
            </p>

            <p>
              สถานะ :
              {" "}
              {item.status}
            </p>

            <div
              style={{
                display:
                  "flex",
                gap: 15,
                marginTop: 15,
              }}
            >

              <img
                src={
                  item.front_image
                }
                alt=""
                style={{
                  width: 250,
                  borderRadius: 15,
                }}
              />

              <img
                src={
                  item.selfie_image
                }
                alt=""
                style={{
                  width: 250,
                  borderRadius: 15,
                }}
              />

            </div>

            {item.status ===
              "pending" && (
              <div
                style={{
                  display:
                    "flex",
                  gap: 10,
                  marginTop: 20,
                }}
              >

                <button
                  onClick={() =>
                    approve(
                      item
                    )
                  }
                  style={{
                    background:
                      "#22c55e",
                    color:
                      "#fff",
                    border:
                      "none",
                    padding:
                      "12px 25px",
                    borderRadius: 12,
                    cursor:
                      "pointer",
                  }}
                >
                  ✅ อนุมัติ
                </button>

                <button
                  onClick={() =>
                    reject(
                      item
                    )
                  }
                  style={{
                    background:
                      "#ef4444",
                    color:
                      "#fff",
                    border:
                      "none",
                    padding:
                      "12px 25px",
                    borderRadius: 12,
                    cursor:
                      "pointer",
                  }}
                >
                  ❌ ไม่อนุมัติ
                </button>

              </div>
            )}

          </div>
        )
      )}
    </div>
  );
}