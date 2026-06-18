import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function KYC() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [fullname, setFullname] =
    useState("");

  const [idCard, setIdCard] =
    useState("");

  const [frontImage, setFrontImage] =
    useState(null);

  const [selfieImage, setSelfieImage] =
    useState(null);

  const [frontPreview, setFrontPreview] =
    useState(null);

  const [selfiePreview, setSelfiePreview] =
    useState(null);

  const [popup, setPopup] =
    useState(false);

  const [popupText, setPopupText] =
    useState("");

  async function submitKYC() {
    if (
      !fullname ||
      !idCard ||
      !frontImage ||
      !selfieImage
    ) {
      setPopupText(
        "กรุณากรอกข้อมูลให้ครบ"
      );
      setPopup(true);
      return;
    }

    try {
      const frontFileName =
        Date.now() +
        "-front-" +
        frontImage.name;

      const selfieFileName =
        Date.now() +
        "-selfie-" +
        selfieImage.name;

      await supabase.storage
        .from("kyc")
        .upload(
          frontFileName,
          frontImage
        );

      await supabase.storage
        .from("kyc")
        .upload(
          selfieFileName,
          selfieImage
        );

      const frontUrl =
        supabase.storage
          .from("kyc")
          .getPublicUrl(frontFileName)
          .data.publicUrl;

      const selfieUrl =
        supabase.storage
          .from("kyc")
          .getPublicUrl(selfieFileName)
          .data.publicUrl;

      const { error } =
        await supabase
          .from("kyc")
          .insert([
            {
              user_id: user.id,
              fullname,
              id_card: idCard,
              front_image: frontUrl,
              selfie_image: selfieUrl,
              status: "pending",
            },
          ]);

      if (error) {
        setPopupText(error.message);
        setPopup(true);
        return;
      }

      setPopupText(
        "ส่งเอกสาร KYC สำเร็จ รอแอดมินตรวจสอบ"
      );

      setPopup(true);
    } catch (err) {
      setPopupText(err.message);
      setPopup(true);
    }
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#24195d",
          padding: 20,
        }}
      >
        <button
          onClick={() =>
            navigate("/settings")
          }
          style={{
            border: "none",
            background: "#fff",
            padding: "12px 18px",
            borderRadius: 15,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← ย้อนกลับ
        </button>

        <div
          style={{
            background: "#fff",
            maxWidth: 600,
            margin: "20px auto",
            borderRadius: 30,
            padding: 25,
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            🪪 ยืนยันตัวตน KYC
          </h2>

          <div
            style={{
              background: "#fff7ed",
              color: "#ea580c",
              border:
                "1px solid #fdba74",
              borderRadius: 15,
              padding: 15,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            ⚠️ กรุณาอัปโหลดข้อมูลจริง
            เพื่อยืนยันตัวตน
          </div>

          <input
            placeholder="ชื่อ-นามสกุล"
            value={fullname}
            onChange={(e) =>
              setFullname(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border:
                "1px solid #ddd",
              marginBottom: 15,
            }}
          />

          <input
            placeholder="เลขบัตรประชาชน"
            value={idCard}
            onChange={(e) =>
              setIdCard(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border:
                "1px solid #ddd",
              marginBottom: 20,
            }}
          />

          <h3>
            🪪 รูปบัตรประชาชน
          </h3>

          <label
            style={{
              width: "100%",
              minHeight: 180,
              border:
                "2px dashed #7c3aed",
              borderRadius: 16,
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
              background:
                "#faf7ff",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files[0];

                setFrontImage(file);

                if (file) {
                  setFrontPreview(
                    URL.createObjectURL(
                      file
                    )
                  );
                }
              }}
            />

            {frontPreview ? (
              <img
                src={frontPreview}
                alt=""
                style={{
                  width: "100%",
                }}
              />
            ) : (
              <div
                style={{
                  color: "#7c3aed",
                  fontWeight: 700,
                }}
              >
                📸 กดเพื่ออัปโหลดบัตรประชาชน
              </div>
            )}
          </label>

          <h3>
            🤳 รูปเซลฟี่คู่บัตร
          </h3>

          <label
            style={{
              width: "100%",
              minHeight: 180,
              border:
                "2px dashed #7c3aed",
              borderRadius: 16,
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
              background:
                "#faf7ff",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files[0];

                setSelfieImage(file);

                if (file) {
                  setSelfiePreview(
                    URL.createObjectURL(
                      file
                    )
                  );
                }
              }}
            />

            {selfiePreview ? (
              <img
                src={selfiePreview}
                alt=""
                style={{
                  width: "100%",
                }}
              />
            ) : (
              <div
                style={{
                  color: "#7c3aed",
                  fontWeight: 700,
                }}
              >
                🤳 กดเพื่ออัปโหลดรูปเซลฟี่คู่บัตร
              </div>
            )}
          </label>

          <button
            onClick={submitKYC}
            style={{
              width: "100%",
              height: 55,
              border: "none",
              borderRadius: 15,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              background:
                "linear-gradient(90deg,#4f46e5,#7c3aed)",
            }}
          >
            ส่งเอกสาร
          </button>
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
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              width: 380,
              background: "#fff",
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
              {popupText.includes(
                "สำเร็จ"
              )
                ? "✅"
                : "⚠️"}
            </div>

            <h2>
              {popupText.includes(
                "สำเร็จ"
              )
                ? "สำเร็จ"
                : "แจ้งเตือน"}
            </h2>

            <p>{popupText}</p>

            <button
              onClick={() =>
                setPopup(false)
              }
              style={{
                width: "100%",
                height: 50,
                border: "none",
                borderRadius: 15,
                color: "#fff",
                fontWeight: "bold",
                background:
                  "#ff3366",
                marginTop: 15,
              }}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </>
  );
}