import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Withdraw() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(0);
  const [profile, setProfile] =
  useState(null);


  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] =
    useState("");
  const [accountNumber, setAccountNumber] =
    useState("");

  const [popup, setPopup] =
    useState(null);

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const { data: wallet } =
    await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

  if (wallet) {
    setWallet(
      Number(wallet.balance || 0)
    );
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  if (profile) {
    setProfile(profile);

    setBankName(
      profile.bank_name || ""
    );

    setAccountName(
      profile.account_name || ""
    );

    setAccountNumber(
      profile.account_number || ""
    );
  }
}

  async function submitWithdraw() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (
  !profile?.bank_name ||
  !profile?.account_name ||
  !profile?.account_number
) {
  setPopup({
    type: "error",
    title: "ยังไม่ได้เพิ่มบัญชี",
    message:
      "กรุณาเพิ่มบัญชีธนาคารก่อนถอนเงิน",
  });

  return;
}

  if (
    !amount ||
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

  if (Number(amount) > wallet) {
    setPopup({
      type: "error",
      title: "ยอดเงินไม่เพียงพอ",
      message:
        "ยอดถอนมากกว่ายอดเงินคงเหลือ",
    });
    return;
  }

  // บันทึกคำขอถอน
  const { error } = await supabase
    .from("withdrawals")
    .insert([
      {
        user_id: user.id,
        amount: Number(amount),
        bank_name: bankName,
        account_name: accountName,
        account_number:
          accountNumber,
        status: "pending",
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

    await supabase
  .from("wallets")
  .update({
    balance:
      wallet - Number(amount),
  })
  .eq("user_id", user.id);

setWallet(
  wallet - Number(amount)
);
  

  setPopup({
    type: "success",
    title: "ส่งคำขอสำเร็จ",
    message:
      "⌛️ กรุณารอการตรวจสอบ อนุมัติถอนเงิน",
  });

  setAmount("");
  setBankName("");
  setAccountName("");
  setAccountNumber("");
}

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          border: "none",
          background: "#5a09f1",
          color: "#fff",
          padding: "10px 15px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ← ย้อนกลับ
      </button>

      <h2>ถอนเงิน</h2>

      <h3>
        เงินคงเหลือ : ฿
        {wallet.toLocaleString()}
      </h3>

      <input
        placeholder="จำนวนเงิน"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
        }}
      />

      <input
        value={bankName}
        disabled
      
        onChange={(e) =>
          setBankName(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
        }}
      />

      <input
        value={accountName}
        disabled
        onChange={(e) =>
          setAccountName(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
        }}
      />

      <input
        value={accountNumber}
         disabled
        onChange={(e) =>
          setAccountNumber(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={submitWithdraw}
        style={{
          width: "100%",
          padding: "14px",
          border: "none",
          borderRadius: "12px",
          background: "#6209f1",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ยืนยันถอนเงิน
      </button>

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
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "90%",
              maxWidth: "420px",
              borderRadius: "24px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "70px",
                marginBottom: "10px",
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
              onClick={() => {
                if (
                  popup.type ===
                  "success"
                ) {
                  navigate(
                    "/profile"
                  );
                }

                setPopup(null);
              }}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background:
                  "#2c09f1",
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