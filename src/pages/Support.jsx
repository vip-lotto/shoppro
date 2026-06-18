import { useNavigate } from "react-router-dom";
import "./Support.css";

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="support-page">

      <button
        className="back-btn"
        onClick={() => navigate("/profile")}
      >
        ← ย้อนกลับ
      </button>

      <div className="support-card">

        <div className="support-icon">
          🎧
        </div>

        <h2>ฝ่ายบริการลูกค้า</h2>

        <p className="support-text">
          หากพบปัญหาเกี่ยวกับ
          <br />
          การฝากเงิน ถอนเงิน
          <br />
          คำสั่งซื้อ หรือบัญชีผู้ใช้
          <br />
          กรุณาติดต่อเจ้าหน้าที่
        </p>

        <a
          href="https://lin.ee/6D9kMVo"
          target="_blank"
          rel="noreferrer"
          className="line-btn"
        >
          💬 ติดต่อแอดมินผ่าน LINE
        </a>

        <div className="support-info">

          <div className="info-box">
            ⏰ เปิดบริการ 24 ชั่วโมง
          </div>

          <div className="info-box">
            ⚡ ตอบกลับภายใน 1-5 นาที
          </div>

          <div className="info-box">
            🔒 ข้อมูลลูกค้าปลอดภัย
          </div>

        </div>

      </div>

    </div>
  );
}