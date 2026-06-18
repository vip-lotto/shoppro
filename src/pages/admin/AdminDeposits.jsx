import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

export default function AdminDeposits() {

  const navigate = useNavigate();

  const [deposits, setDeposits] =
    useState([]);

  useEffect(() => {
    loadDeposits();
  }, []);

  async function loadDeposits() {

    const { data } =
      await supabase
        .from("deposits")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {
      setDeposits(data);
    }
  }

  async function approve(item) {

  if (item.status !== "pending") {
    return;
  }

  const { data: wallet } =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        item.user_id
      )
      .single();

  const currentBalance =
    Number(wallet?.balance || 0);

  await supabase
    .from("wallets")
    .update({
      balance:
        currentBalance +
        Number(item.amount),
    })
    .eq(
      "user_id",
      item.user_id
    );

  await supabase
    .from("deposits")
    .update({
      status: "approved",
    })
    .eq(
      "id",
      item.id
    );

    alert("อนุมัติสำเร็จ");

  loadDeposits();
}

async function reject(item) {

  const reason = prompt(
    "เหตุผลที่ไม่อนุมัติ"
  );

  if (!reason) return;

  await supabase
    .from("deposits")
    .update({
      status: "rejected",
      reject_reason: reason,
    })
    .eq(
      "id",
      item.id
    );

  alert("ปฏิเสธรายการแล้ว");

  loadDeposits();
}

  return (
    <div
      style={{
        padding: 25,
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
      }}
    >

      <button
        onClick={() =>
          navigate(
            "/admin"
          )
        }
        style={{
          border: "none",
          background:
            "#6d5dfc",
          color: "#fff",
          padding:
            "12px 18px",
          borderRadius:
            12,
          cursor:
            "pointer",
          marginBottom:
            20,
        }}
      >
        ← กลับหน้าแอดมิน
      </button>

      <h1>
        💰 ตรวจสอบสลิปฝากเงิน
      </h1>

      {deposits.map(
        (item) => (
          <div
            key={item.id}
            style={{
              background:
                "#fff",
              borderRadius:
                20,
              padding: 20,
              marginTop: 20,
              boxShadow:
                "0 10px 25px rgba(0,0,0,.08)",
            }}
          >

            <h3>
              {
                item.username
              }
            </h3>

            <p>
              Member :
              {" "}
              {
                item.member_id
              }
            </p>

            <p>
              จำนวนเงิน :
              {" "}
              ฿
              {Number(
                item.amount
              ).toLocaleString()}
            </p>

            <p>
  วันที่ :
  {" "}
  {new Date(
    item.created_at
  ).toLocaleString("th-TH")}
</p>

            <div
  style={{
    display: "inline-block",
    
    padding: "6px 14px",
    borderRadius: 20,
    color: "#fff",
    marginTop: 10,
    background:
      item.status === "approved"
        ? "#22c55e"
        : item.status === "rejected"
        ? "#ef4444"
        : "#f59e0b",
  }}
>
  {item.status}
</div>

{item.status === "rejected" &&
 item.reject_reason && (
  <div
    style={{
      marginTop: 10,
      color: "#ef4444",
      fontWeight: "bold",
    }}
  >
    เหตุผล: {item.reject_reason}
  </div>
)}

            <img
  src={item.slip_url}
  alt=""
  style={{
    width: "100%",
    maxWidth: 500,
    borderRadius: 15,
    marginTop: 15,
    border: "3px solid #e5e7eb",
    cursor: "pointer",
  }}
  onClick={() =>
    window.open(
      item.slip_url,
      "_blank"
    )
  }
/>

            {item.status ===
              "pending" && (
              <div
                style={{
                  display:
                    "flex",
                  gap: 10,
                  marginTop:
                    20,
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
                      "12px 20px",
                    borderRadius:
                      12,
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
                      "12px 20px",
                    borderRadius:
                      12,
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