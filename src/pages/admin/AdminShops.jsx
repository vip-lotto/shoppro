import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import {
  Store,
  Trash2,
  Eye,
  Ban,
  CheckCircle
} from "lucide-react";

export default function AdminShops() {

  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadShops();
  }, []);

  async function loadShops() {

    const { data } = await supabase
      .from("shops")
      .select("*")
      .order("id", {
        ascending: false
      });

    setShops(data || []);
  }

  async function deleteShop(id) {

    if (
      !window.confirm(
        "ต้องการลบร้านนี้หรือไม่ ?"
      )
    ) return;

    await supabase
      .from("shops")
      .delete()
      .eq("id", id);

    loadShops();
  }

  async function rejectShop(id) {

  await supabase
    .from("shops")
    .update({
      status: "rejected"
    })
    .eq("id", id);

  loadShops();
}

  async function approveShop(id) {

    await supabase
      .from("shops")
      .update({
        status: "approved"
      })
      .eq("id", id);

    loadShops();
  }

  function viewShop(shop) {

    alert(
`ชื่อร้าน : ${shop.shop_name}

เจ้าของ : ${shop.owner_name || "-"}

เบอร์ : ${shop.phone || "-"}

สถานะ : ${shop.status || "approved"}`
    );

  }

  const filteredShops =
    shops.filter(shop =>
      (
        shop.shop_name || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div
      style={{
        padding: 25,
        minHeight: "100vh",
        background: "#f5f7fb"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20
        }}
      >

        <button
          onClick={() =>
            navigate("/admin")
          }
          style={{
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 15,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← กลับหน้าแอดมิน
        </button>

        <input
          type="text"
          placeholder="ค้นหาร้าน..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: 12,
            borderRadius: 12,
            border:
              "1px solid #ddd",
            width: 250
          }}
        />

      </div>

      <h1>
        🏪 จัดการร้านค้า
      </h1>

      <div
        style={{
          background:
            "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff",
          borderRadius: 20,
          padding: 25,
          marginTop: 20,
          marginBottom: 20
        }}
      >
        <h3>ร้านค้าทั้งหมด</h3>
        <h1>{shops.length}</h1>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 20,
          overflowX: "auto",
          boxShadow:
            "0 5px 20px rgba(0,0,0,.08)"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr
              style={{
                borderBottom:
                  "2px solid #eee"
              }}
            >
              <th>#</th>
              <th>ชื่อร้าน</th>
              <th>เจ้าของ</th>
              <th>เบอร์</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>

          </thead>

          <tbody>

            {filteredShops.map(
              (
                shop,
                index
              ) => (

                <tr
                  key={shop.id}
                  style={{
                    borderBottom:
                      "1px solid #eee"
                  }}
                >

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {shop.shop_name}
                  </td>

                  <td>
                    {shop.owner_name ||
                      "-"}
                  </td>

                  <td>
                    {shop.phone ||
                      "-"}
                  </td>

                  <td>

                    <span
                      style={{
                        background:
                          shop.status === "approved"
                            ? "#22c55e"
                            : shop.status === "pending"
                            ? "#f59e0b"
                            : "#ef4444",
                        color:
                          "#fff",
                        padding:
                          "5px 12px",
                        borderRadius:
                          20,
                        fontSize:
                          12
                      }}
                    >
                      {shop.status ||
                        "approved"}
                    </span>

                  </td>

                  <td>

                    <div
                      style={{
                        display:
                          "flex",
                        gap: 8
                      }}
                    >

                      <button
                        onClick={() =>
                          viewShop(
                            shop
                          )
                        }
                        style={{
                          background:
                            "#3b82f6",
                          color:
                            "#fff",
                          border:
                            "none",
                          padding:
                            "8px 12px",
                          borderRadius:
                            10,
                          cursor:
                            "pointer"
                        }}
                      >
                        <Eye
                          size={
                            16
                          }
                        />
                      </button>

                      {shop.status !==
                      "approved" ? (

                        <button
                          onClick={() =>
                            approveShop(
                              shop.id
                            )
                          }
                          style={{
                            background:
                              "#22c55e",
                            color:
                              "#fff",
                            border:
                              "none",
                            padding:
                              "8px 12px",
                            borderRadius:
                              10,
                            cursor:
                              "pointer"
                          }}
                        >
                          <CheckCircle
                            size={
                              16
                            }
                          />
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            rejectShop(shop.id)
                          }
                          style={{
                            background:
                              "#f59e0b",
                            color:
                              "#fff",
                            border:
                              "none",
                            padding:
                              "8px 12px",
                            borderRadius:
                              10,
                            cursor:
                              "pointer"
                          }}
                        >
                          <Ban
                            size={
                              16
                            }
                          />
                        </button>

                      )}

                      <button
                        onClick={() =>
                          deleteShop(
                            shop.id
                          )
                        }
                        style={{
                          background:
                            "#ef4444",
                          color:
                            "#fff",
                          border:
                            "none",
                          padding:
                            "8px 12px",
                          borderRadius:
                            10,
                          cursor:
                            "pointer"
                        }}
                      >
                        <Trash2
                          size={
                            16
                          }
                        />
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}