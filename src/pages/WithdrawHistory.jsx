import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function WithdrawHistory() {

  const navigate = useNavigate();

  const [list, setList] =
    useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data } =
      await supabase
        .from("withdrawals")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setList(data || []);
  }

  function statusColor(status) {

    if (status === "approved")
      return "#22c55e";

    if (status === "rejected")
      return "#ef4444";

    return "#f59e0b";
  }

  function statusText(status) {

    if (status === "approved")
      return "อนุมัติแล้ว";

    if (status === "rejected")
      return "ปฏิเสธ";

    return "รอตรวจสอบ";
  }

  function cardColor(status) {

    if (status === "approved")
      return "#ecfdf5";

    if (status === "rejected")
      return "#fef2f2";

    return "#fffbeb";
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
          maxWidth: 800,
          margin: "0 auto",
        }}
      >

        <button
          onClick={() =>
            navigate(-1)
          }
          style={{
            background: "#fff",
            border: "none",
            padding: "10px 18px",
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
          }}
        >
          <h2>
            💸 ประวัติถอนเงิน
          </h2>

          {list.length === 0 && (

            <div
              style={{
                textAlign: "center",
                padding: 40,
              }}
            >
              ยังไม่มีรายการถอนเงิน
            </div>

          )}

          {list.map((item) => (

            <div
              key={item.id}
              style={{
                background:
                  cardColor(
                    item.status
                  ),
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
                  alignItems: "center",
                }}
              >

                <b
                  style={{
                    fontSize: 20,
                  }}
                >
                  ฿
                  {Number(
                    item.amount
                  ).toLocaleString()}
                </b>

                <span
                  style={{
                    background:
                      statusColor(
                        item.status
                      ),
                    color: "#fff",
                    padding:
                      "6px 12px",
                    borderRadius: 10,
                    fontWeight:
                      "bold",
                  }}
                >
                  {statusText(
                    item.status
                  )}
                </span>

              </div>

              <p>
                🏦 ธนาคาร :
                {" "}
                {item.bank_name}
              </p>

              <p>
                👤 ชื่อบัญชี :
                {" "}
                {item.account_name}
              </p>

              <p>
                💳 เลขบัญชี :
                {" "}
                {item.account_number}
              </p>

              <p>
                📅 วันที่ :
                {" "}
                {new Date(
                  item.created_at
                ).toLocaleString(
                  "th-TH"
                )}
              </p>

              

              {item.status ===
                "rejected" &&
                item.reject_reason && (

                <div
                  style={{
                    marginTop: 10,
                    color:
                      "#ef4444",
                    fontWeight:
                      "bold",
                    background:
                      "#fff",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  ❌ เหตุผล :
                  {" "}
                  {
                    item.reject_reason
                  }
                </div>

              )}

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}