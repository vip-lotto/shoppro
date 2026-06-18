import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function ProfileImage() {

const navigate = useNavigate();

const [avatar, setAvatar] =
useState("");

const [uploading, setUploading] =
useState(false);

const [popup, setPopup] =
useState(null);

useEffect(() => {
loadProfile();
}, []);

async function loadProfile() {

```
const user = JSON.parse(
  localStorage.getItem("user")
);

const { data } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

if (data?.avatar_url) {
  setAvatar(
    data.avatar_url
  );
}
```

}

async function uploadImage(e) {


const file =
  e.target.files?.[0];

if (!file) return;

setUploading(true);

const user = JSON.parse(
  localStorage.getItem("user")
);

const fileName =
  `${user.id}-${Date.now()}`;

const { error } =
  await supabase.storage
    .from("avatars")
    .upload(
      fileName,
      file,
      {
        upsert: true,
      }
    );

if (error) {

  setPopup({
    type: "error",
    title:
      "อัปโหลดไม่สำเร็จ",
    message:
      error.message,
  });

  setUploading(false);

  return;
}

const {
  data: publicUrlData,
} = supabase.storage
  .from("avatars")
  .getPublicUrl(
    fileName
  );

const imageUrl =
  publicUrlData.publicUrl;

await supabase
  .from("profiles")
  .update({
    avatar_url:
      imageUrl,
  })
  .eq("id", user.id);

setAvatar(
  imageUrl
);

setPopup({
  type: "success",
  title:
    "สำเร็จ",
  message:
    "อัปโหลดรูปโปรไฟล์เรียบร้อยแล้ว",
});

setUploading(false);


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
maxWidth: 500,
margin: "0 auto",
}}
>


    <button
      onClick={() =>
        navigate(-1)
      }
      style={{
        border: "none",
        background:
          "#fff",
        padding:
          "10px 16px",
        borderRadius: 12,
        cursor:
          "pointer",
        fontWeight:
          "bold",
      }}
    >
      ← ย้อนกลับ
    </button>

    <div
      style={{
        background:
          "#fff",
        borderRadius: 25,
        padding: 25,
        marginTop: 20,
        textAlign:
          "center",
      }}
    >

      <h2>
        📸 รูปโปรไฟล์
      </h2>

      <img
        src={
          avatar ||
          "https://via.placeholder.com/180"
        }
        alt=""
        style={{
          width: 180,
          height: 180,
          borderRadius:
            "50%",
          objectFit:
            "cover",
          border:
            "5px solid #e5e7eb",
          marginBottom: 20,
        }}
      />

      <label
        style={{
          display:
            "inline-block",
          padding:
            "14px 25px",
          background:
            "linear-gradient(135deg,#4f46e5,#8b5cf6)",
          color:
            "#fff",
          borderRadius:
            15,
          cursor:
            "pointer",
          fontWeight:
            "bold",
        }}
      >
        {uploading
          ? "กำลังอัปโหลด..."
          : "เลือกรูปโปรไฟล์"}

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={
            uploadImage
          }
        />
      </label>

    </div>

  </div>

  {popup && (
    <div
      style={{
        position:
          "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.6)",
        display:
          "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width:
            "90%",
          maxWidth:
            "420px",
          background:
            "#fff",
          borderRadius:
            "25px",
          padding:
            "30px",
          textAlign:
            "center",
        }}
      >

        <div
          style={{
            fontSize:
              "70px",
          }}
        >
          {popup.type ===
          "success"
            ? "✅"
            : "❌"}
        </div>

        <h2>
          {popup.title}
        </h2>

        <p>
          {popup.message}
        </p>

        <button
          onClick={() =>
            setPopup(
              null
            )
          }
          style={{
            width:
              "100%",
            padding:
              "14px",
            border:
              "none",
            borderRadius:
              "15px",
            background:
              "#4f46e5",
            color:
              "#fff",
            fontWeight:
              "bold",
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
