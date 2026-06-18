import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function DepositHistory() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data, error } =
      await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (!error) {
      setList(data || []);
    }
  }

  function getColor(status) {
    if (status === "approved")
      return "#16a34a";

    if (status === "rejected")
      return "#ef4444";

    return "#f59e0b";
  }

  function getStatusText(status) {
    if (status === "approved")
      return "อนุมัติแล้ว";

    if (status === "rejected")
      return "ไม่อนุมัติ";

    return "รอตรวจสอบ";
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
          maxWidth: 750,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "#fff",
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
            borderRadius: 25,
            padding: 25,
            marginTop: 20,
          }}
        >
          <h2>💰 ประวัติฝากเงิน</h2>

          {list.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 30,
              }}
            >
              ยังไม่มีรายการฝากเงิน
            </div>
          ) : (
            list.map((item) => (
              <div
                key={item.id}
                style={{
                  background:
                    item.status === "approved"
                      ? "#ecfdf5"
                      : item.status === "rejected"
                      ? "#fef2f2"
                      : "#fffbeb",
                  borderRadius: 18,
                  padding: 18,
                  marginTop: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <b>
                    ฿
                    {Number(
                      item.amount || 0
                    ).toLocaleString()}
                  </b>

                  <span
                    style={{
                      color: getColor(
                        item.status
                      ),
                      fontWeight:
                        "bold",
                    }}
                  >
                    {getStatusText(
                      item.status
                    )}
                  </span>
                </div>

                <p>
                  📅{" "}
                  {new Date(
                    item.created_at
                  ).toLocaleString(
                    "th-TH"
                  )}
                </p>

                {item.status === "rejected" &&
                  item.reject_reason && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontWeight: "bold",
                        marginTop: 8
                      }}
                    >
                      ❌ เหตุผล:
                      {" "}
                      {item.reject_reason}
                    </p>
                )}

                {item.slip_url && (
                  <img
                    src={item.slip_url}
                    alt="slip"
                    onClick={() =>
                      window.open(
                        item.slip_url,
                        "_blank"
                      )
                    }
                    style={{
                      width: "100%",
                      maxWidth: 250,
                      borderRadius: 12,
                      cursor: "pointer",
                      border:
                        "2px solid #ddd",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}