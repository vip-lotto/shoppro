import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function AdminOrderCodes() {

const [codes, setCodes] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
loadCodes();
}, []);

async function loadCodes() {


const { data, error } = await supabase
  .from("order_codes")
  .select("*")
  .order("created_at", {
    ascending: false,
  });

console.log("LOAD DATA =", data);
console.log("LOAD ERROR =", error);

setCodes(data || []);


}

async function createCode() {


setLoading(true);

const code =
  "SP" +
  Math.floor(
    100000 + Math.random() * 900000
  );

const { data, error } =
  await supabase
    .from("order_codes")
    .insert([
      {
        code,
        status: "unused",
      },
    ])
    .select();

console.log("INSERT DATA =", data);
console.log("INSERT ERROR =", error);

setLoading(false);

if (error) {
  alert("ERROR : " + error.message);
  return;
}

alert("สร้างรหัสสำเร็จ : " + code);

loadCodes();


}

return (
<div
style={{
padding: 20,
}}
>


  <h1>🔑 รหัสสั่งซื้อ</h1>

  <button
    onClick={createCode}
    disabled={loading}
    style={{
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: 10,
      cursor: "pointer",
    }}
  >
    {loading
      ? "กำลังสร้าง..."
      : "สร้างรหัสใหม่"}
  </button>

  <table
    style={{
      width: "100%",
      marginTop: 20,
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th
          style={{
            borderBottom:
              "1px solid #ddd",
            padding: 10,
          }}
        >
          รหัส
        </th>

        <th
          style={{
            borderBottom:
              "1px solid #ddd",
            padding: 10,
          }}
        >
          สถานะ
        </th>
      </tr>
    </thead>

    <tbody>

      {codes.map((c) => (

        <tr key={c.id}>

          <td
            style={{
              padding: 10,
              borderBottom:
                "1px solid #eee",
            }}
          >
            {c.code}
          </td>

          <td
            style={{
              padding: 10,
              borderBottom:
                "1px solid #eee",
            }}
          >
            {c.status}
          </td>

        </tr>

      ))}

    </tbody>
  </table>

</div>


);
}
