
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./Deposit.css";

export default function Deposit() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  

  const [showPopup, setShowPopup] =
    useState(false);

  const [popupText, setPopupText] =
    useState("");

  const openPopup = (text) => {
    setPopupText(text);
    setShowPopup(true);
  };

  const handleDeposit = async () => {
    if (!amount) {
      openPopup("กรุณากรอกจำนวนเงิน");
      return;
    }

    if (!file) {
      openPopup("กรุณาแนบสลิป");
      return;
    }

    try {
      const fileName =
        Date.now() + "-" + file.name;

      const { error: uploadError } =
        await supabase.storage
          .from("deposit-slips")
          .upload(fileName, file);

      if (uploadError) {
        openPopup(uploadError.message);
        return;
      }

      const { data } =
        supabase.storage
          .from("deposit-slips")
          .getPublicUrl(fileName);

      const slipUrl =
        data.publicUrl;

      const { error } =
        await supabase
            .from("deposits")
            .insert([
                {
                user_id: user.id,
                member_id: user.member_id,
                username: user.username,
                amount: Number(amount),
                slip_url: slipUrl,
                status: "pending",
                },
            ]);

      if (error) {
        openPopup(error.message);
        return;
      }

      setAmount("");
      setFile(null);

      openPopup(
        "ส่งสลิปสำเร็จ กรุณารอตรวจสอบ"
      );
    } catch (err) {
      openPopup(err.message);
    }
  };

  return (
    <div className="deposit-page">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← ย้อนกลับ
      </button>

      <div className="deposit-card">

        <h2>
          💰 ฝากเงิน
        </h2>

        <div className="bank-box">

          <h3>
            บัญชีฝากเงิน
          </h3>

          <p>
            ธนาคาร : กสิกรไทย
          </p>

          <p>
            ชื่อบัญชี : SHOPPRO
          </p>

          <p>
            เลขบัญชี :
            0101010101
          </p>

        </div>

        <div className="deposit-warning">
  <div className="warning-icon">
    ⚠️
  </div>

  <div>
    <strong>
      กรุณาโอนเงินก่อน แล้วแนบสลิปให้ถูกต้อง
    </strong>

    <br />

    หากมีปัญหา กรุณาติดต่อแอดมิน
  </div>
</div>

<a
  href="https://lin.ee/6D9kMVo"
  target="_blank"
  rel="noreferrer"
  className="admin-contact-btn"
>
  💬 คลิกเพื่อติดต่อแอดมิน
</a>

        <input
            type="number"
            placeholder="จำนวนเงิน"
            value={amount}
            onChange={(e) =>
                setAmount(e.target.value)
            }
            />

                    <label className="upload-box">

            {file ? (
                <>
                ✅ {file.name}
                </>
            ) : (
                <>
                📷 กดเพื่อเลือกสลิปโอนเงิน
                </>
            )}

  <input
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {

    const selectedFile =
      e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    setPreview(
      URL.createObjectURL(selectedFile)
    );
  }}
/>

</label>

{preview && (
  <img
    src={preview}
    alt=""
    className="slip-preview"
  />
)}

        <button
          className="deposit-btn"
          onClick={handleDeposit}
        >
          ส่งสลิป
        </button>

      </div>

      {showPopup && (
        <div className="popup-overlay">

          <div className="popup-box">

            <div className="popup-icon">
              ✅
            </div>

            <h2>
              สำเร็จ
            </h2>

            <p>
              {popupText}
            </p>

            <button
              className="popup-btn"
              onClick={() =>
                setShowPopup(false)
              }
            >
              ตกลง
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

