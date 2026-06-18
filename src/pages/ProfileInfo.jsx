import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./ProfileInfo.css";





export default function ProfileInfo() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    birthday: "",
    address: "",
    province: "",
    zipcode: "",
    bank_name: "",
    account_number: "",
    account_name: "",
  });

  const [popup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        gender: data.gender || "",
        birthday: data.birthday || "",
        address: data.address || "",
        province: data.province || "",
        zipcode: data.zipcode || "",
        bank_name: data.bank_name || "",
        account_number:
            data.account_number || "",

        account_name:
            data.account_name || "",
      });
    }
  }

  async function saveData() {

  if (!form.first_name) {
    setPopupText("กรุณากรอกชื่อจริง");
    setPopup(true);
    return;
  }

  if (!form.last_name) {
    setPopupText("กรุณากรอกนามสกุล");
    setPopup(true);
    return;
  }

  if (!form.birthday) {
    setPopupText("กรุณาเลือกวันเดือนปีเกิด");
    setPopup(true);
    return;
  }

  const updateData = {
  ...form,

  birthday:
    form.birthday === ""
      ? null
      : form.birthday,
};

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    setPopupText(error.message);
    setPopup(true);
    return;
  }

  setPopupText(
    "บันทึกข้อมูลเรียบร้อยแล้ว 🎉"
  );

  setPopup(true);
}

  return (
    <>
      <div className="info-page">

        <button
            className="back-btn"
            onClick={() => navigate("/settings")}
            >
            ← ย้อนกลับ
            </button>

        <div className="info-card">

          <h2>👤 ข้อมูล</h2>

          <input
            placeholder="ชื่อจริง"
            value={form.first_name}
            onChange={(e)=>
              setForm({
                ...form,
                first_name:e.target.value
              })
            }
          />

          <input
            placeholder="นามสกุล"
            value={form.last_name}
            onChange={(e)=>
              setForm({
                ...form,
                last_name:e.target.value
              })
            }
          />

          <input
            placeholder="อีเมล"
            value={form.email}
            onChange={(e)=>
              setForm({
                ...form,
                email:e.target.value
              })
            }
          />

          <div className="input-group">
            

            <select
                className="custom-select"
                value={form.gender}
                onChange={(e) =>
                setForm({
                    ...form,
                    gender: e.target.value,
                })
                }
            >
                <option value="">
                เลือกเพศ
                </option>

                <option value="ชาย">
                 ชาย
                </option>

                <option value="หญิง">
                 หญิง
                </option>

                
            </select>
            </div>

          <div className="input-group">
            <label>วันเดือนปีเกิด</label>

            <input
                className="custom-input"
                type="date"
                value={form.birthday}
                onChange={(e)=>
                setForm({
                    ...form,
                    birthday:e.target.value
                })
                }
            />
            </div>

          <textarea
            placeholder="ที่อยู่"
            value={form.address}
            onChange={(e)=>
              setForm({
                ...form,
                address:e.target.value
              })
            }
          />

          <input
            placeholder="จังหวัด"
            value={form.province}
            onChange={(e)=>
              setForm({
                ...form,
                province:e.target.value
              })
            }
          />

          <input
            placeholder="รหัสไปรษณีย์"
            value={form.zipcode}
            onChange={(e)=>
              setForm({
                ...form,
                zipcode:e.target.value
              })
            }
          />

          <h3>🏦 ข้อมูลธนาคาร</h3>

          <select
className="bank-select"
value={form.bank_name}
onChange={(e)=>
setForm({
...form,
bank_name:e.target.value
})
}

>

  <option value="">
    เลือกธนาคาร
  </option>

  <option value="กรุงเทพ">
    ธนาคารกรุงเทพ (BBL)
  </option>

  <option value="กสิกรไทย">
    ธนาคารกสิกรไทย (KBANK)
  </option>

  <option value="กรุงไทย">
    ธนาคารกรุงไทย (KTB)
  </option>

  <option value="ไทยพาณิชย์">
    ธนาคารไทยพาณิชย์ (SCB)
  </option>

  <option value="กรุงศรีอยุธยา">
    ธนาคารกรุงศรีอยุธยา (BAY)
  </option>

  <option value="TTB">
    ธนาคารทหารไทยธนชาต (TTB)
  </option>

  <option value="ออมสิน">
    ธนาคารออมสิน
  </option>

  <option value="ธ.ก.ส.">
    ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)
  </option>

  <option value="อาคารสงเคราะห์">
    ธนาคารอาคารสงเคราะห์ (GH Bank)
  </option>

  <option value="อิสลาม">
    ธนาคารอิสลามแห่งประเทศไทย
  </option>

  <option value="เกียรตินาคินภัทร">
    ธนาคารเกียรตินาคินภัทร (KKP)
  </option>

  <option value="CIMB Thai">
    CIMB Thai
  </option>

  <option value="UOB">
    UOB
  </option>

  <option value="แลนด์ แอนด์ เฮ้าส์">
    Land & Houses Bank
  </option>

  <option value="ไทยเครดิต">
    ธนาคารไทยเครดิต
  </option>

  <option value="ICBC">
    ICBC
  </option>

  <option value="Standard Chartered">
    Standard Chartered
  </option>

  <option value="พร้อมเพย์">
    พร้อมเพย์
  </option>
</select>




          <input
            placeholder="เลขบัญชี"
            value={form.account_number}
            onChange={(e)=>
              setForm({
                ...form,
                account_number:e.target.value
              })
            }
          />

          <input
            placeholder="ชื่อบัญชี"
            value={form.account_name}
            onChange={(e)=>
              setForm({
                ...form,
                account_name:e.target.value
              })
            }
          />

          <button
            className="save-btn"
            onClick={saveData}
          >
            บันทึกข้อมูล
          </button>

        </div>
      </div>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-box">

            <div className="popup-icon">
              ✅
            </div>

            <h2>
                {popupText.includes("🎉")
                    ? "สำเร็จ"
                    : "แจ้งเตือน"}
                </h2>

            <p>{popupText}</p>

            <button
              className="popup-btn"
              onClick={() =>
                setPopup(false)
              }
            >
              ตกลง
            </button>

          </div>
        </div>
      )}
    </>
  );
}