import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function AdminOrderCodes() {

  const [codes, setCodes] = useState([]);

  useEffect(() => {
    loadCodes();
  }, []);

  async function loadCodes() {
    const { data } = await supabase
      .from("order_codes")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setCodes(data || []);
  }

  async function createCode() {

    const code =
      "SP" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    await supabase
      .from("order_codes")
      .insert([
        {
          code,
          status: "unused",
        },
      ]);

    loadCodes();
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>🔑 รหัสสั่งซื้อ</h1>

      <button
        onClick={createCode}
      >
        สร้างรหัสใหม่
      </button>

      <table
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >
        <thead>
          <tr>
            <th>รหัส</th>
            <th>สถานะ</th>
          </tr>
        </thead>

        <tbody>
          {codes.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}