import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  const handleSave = async () => {
    try {
      if (!name) {
        alert("กรุณากรอกชื่อสินค้า");
        return;
      }

      let imageUrl = "";

      if (image) {
        const fileName =
          Date.now() + "-" + image.name;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("products")
          .upload(fileName, image);

        if (uploadError) {
          alert(uploadError.message);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } =
        await supabase
          .from("products")
          .insert([
            {
              name,
              category,
              cost_price: Number(costPrice),
              sell_price: Number(sellPrice),
              stock: Number(stock),
              image: imageUrl,
            },
          ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert("เพิ่มสินค้าสำเร็จ");

      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f5f7fb,#eef2ff)",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "25px",
          padding: "30px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            📦 เพิ่มสินค้าใหม่
          </h2>

          <button
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            style={{
              background: "#fff",
              border:
                "1px solid #ddd",
              padding:
                "10px 18px",
              borderRadius:
                "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ← กลับ
          </button>
        </div>

        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="หมวดหมู่"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="ต้นทุน"
          value={costPrice}
          onChange={(e) =>
            setCostPrice(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="ราคาขาย"
          value={sellPrice}
          onChange={(e) =>
            setSellPrice(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="สต็อก"
          value={stock}
          onChange={(e) =>
            setStock(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <label
          style={{
            display: "block",
            border:
              "2px dashed #7c3aed",
            borderRadius:
              "20px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            marginTop: "20px",
            color: "#7c3aed",
            fontWeight: "bold",
          }}
        >
          📷 กดเพื่อเลือกรูปสินค้า

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />
        </label>

        {image && (
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <img
              src={URL.createObjectURL(
                image
              )}
              alt=""
              style={{
                width: "100%",
                borderRadius:
                  "20px",
                maxHeight:
                  "400px",
                objectFit:
                  "contain",
                background:
                  "#f5f5f5",
              }}
            />
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            marginTop: "25px",
            height: "55px",
            border: "none",
            borderRadius: "15px",
            background:
              "linear-gradient(135deg,#ff3366,#ff0066)",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          บันทึกสินค้า
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  outline: "none",
  boxSizing: "border-box",
};