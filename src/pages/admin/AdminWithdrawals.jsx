
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Wallet
} from "lucide-react";

export default function AdminWithdrawals() {

  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data } = await supabase
      .from("withdrawals")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    setWithdrawals(data || []);
  }

  async function approve(id) {

    if (
      !window.confirm(
        "ยืนยันอนุมัติรายการนี้ ?"
      )
    ) return;

    await supabase
      .from("withdrawals")
      .update({
        status: "approved"
      })
      .eq("id", id);

    alert("อนุมัติสำเร็จ");

    loadData();
  }

  async function reject(item) {

    const reason = prompt(
      "เหตุผลที่ไม่อนุมัติ"
    );

    if (!reason) return;

    if (
      !window.confirm(
        "ยืนยันปฏิเสธรายการนี้ ?"
      )
    ) return;

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
      Number(
        wallet?.balance || 0
      );

    await supabase
      .from("wallets")
      .update({
        balance:
          currentBalance +
          Number(item.amount)
      })
      .eq(
        "user_id",
        item.user_id
      );

    await supabase
      .from("withdrawals")
      .update({
        status: "rejected",
        reject_reason: reason
      })
      .eq(
        "id",
        item.id
      );

    alert(
      "คืนเงินและปฏิเสธรายการแล้ว"
    );

    loadData();
  }

  function getStatusColor(status) {

    if (status === "approved")
      return "#22c55e";

    if (status === "rejected")
      return "#ef4444";

    return "#f59e0b";
  }

  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
        background: "#f5f7fb"
      }}
    >

      <button
        onClick={() =>
          navigate("/admin")
        }
        style={{
          border: "none",
          background: "#4f46e5",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 20
        }}
      >
        <ArrowLeft size={18} />
        {" "}กลับหน้า Admin
      </button>

      <h1>
        💸 จัดการถอนเงิน
      </h1>

      {withdrawals.length === 0 && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 20,
            marginTop: 20
          }}
        >
          ไม่มีรายการถอนเงิน
        </div>
      )}

      {withdrawals.map((item) => (

        <div
          key={item.id}
          style={{
            background:
              item.status === "approved"
                ? "#ecfdf5"
                : item.status === "rejected"
                ? "#fef2f2"
                : "#fffbeb",
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
            boxShadow:
              "0 5px 20px rgba(0,0,0,.08)"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center"
            }}
          >

            <h3>
              <Wallet
                size={20}
                style={{
                  marginRight: 8
                }}
              />
              ถอนเงิน
            </h3>

            <span
              style={{
                background:
                  getStatusColor(
                    item.status
                  ),
                color: "#fff",
                padding:
                  "6px 12px",
                borderRadius: 10,
                fontWeight: "bold"
              }}
            >
              {item.status === "pending"
                ? "รอตรวจสอบ"
                : item.status === "approved"
                ? "อนุมัติแล้ว"
                : "ปฏิเสธแล้ว"}
            </span>

          </div>

          <p>
            User ID :
            {item.user_id}
          </p>

          <p>
            ธนาคาร :
            {item.bank_name}
          </p>

          <p>
            ชื่อบัญชี :
            {item.account_name}
          </p>

          <p>
            เลขบัญชี :
            {item.account_number}
          </p>

          <p>
            จำนวนเงิน :
            ฿
            {Number(
              item.amount || 0
            ).toLocaleString()}
          </p>

          <p>
            วันที่ :
            {new Date(
              item.created_at
            ).toLocaleString("th-TH")}
          </p>

          {item.status === "rejected" &&
            item.reject_reason && (
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: "bold"
                }}
              >
                เหตุผล:
                {" "}
                {item.reject_reason}
              </p>
          )}

          {item.status ===
            "pending" && (

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15
              }}
            >

              <button
                onClick={() =>
                  approve(item.id)
                }
                style={{
                  background:
                    "#22c55e",
                  color: "#fff",
                  border: "none",
                  padding:
                    "10px 15px",
                  borderRadius: 10,
                  cursor: "pointer"
                }}
              >
                <CheckCircle
                  size={16}
                />
                {" "}
                อนุมัติ
              </button>

              <button
                onClick={() =>
                  reject(item)
                }
                style={{
                  background:
                    "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding:
                    "10px 15px",
                  borderRadius: 10,
                  cursor: "pointer"
                }}
              >
                <XCircle
                  size={16}
                />
                {" "}
                ปฏิเสธ
              </button>

            </div>

          )}

        </div>

      ))}

    </div>
  );
}

