import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  Trash2
} from "lucide-react";

export default function AdminUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
  useState(null);

const [walletAmount, setWalletAmount] =
  useState("");

  const [bankName, setBankName] =
  useState("");

const [accountName, setAccountName] =
  useState("");

const [accountNumber, setAccountNumber] =
  useState("");

  useEffect(() => {
    loadUsers();


  }, []);

  async function loadUsers() {

  const { data: profiles } =
    await supabase
      .from("profiles")
      .select("*")
      .order("id", {
        ascending: false,
      });

  const { data: wallets } =
    await supabase
      .from("wallets")
      .select("*");

  const merged =
    (profiles || []).map(user => {

      const wallet =
        wallets?.find(
          w => w.user_id === user.id
        );

      return {
        ...user,
        wallet_balance:
          wallet?.balance || 0,
      };
    });

  setUsers([...merged]);
}
  async function deleteUser(id) {

    const confirmDelete =
      window.confirm(
        "ต้องการลบสมาชิกนี้หรือไม่ ?"
      );

    if (!confirmDelete) return;

    await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    loadUsers();
  }

  async function addMoney() {

  if (!walletAmount) return;

  const amount =
    Number(walletAmount);

  const { data: wallet } =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        selectedUser.id
      )
      .single();

  if (!wallet) return;

  await supabase
    .from("wallets")
    .update({
      balance:
        Number(wallet.balance) +
        amount,
    })
    .eq("id", wallet.id);

  await loadUsers();

const { data: newWallet } =
  await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", selectedUser.id)
    .single();

setSelectedUser({
  ...selectedUser,
  wallet_balance: newWallet.balance,
});

setWalletAmount("");
}

async function removeMoney() {

  if (!walletAmount) return;

  const amount =
    Number(walletAmount);

  const { data: wallet } =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        selectedUser.id
      )
      .single();

  if (!wallet) return;

  await supabase
    .from("wallets")
    .update({
      balance:
        Math.max(
          0,
          Number(wallet.balance) -
            amount
        ),
    })
    .eq("id", wallet.id);

  await loadUsers();

const { data: newWallet } =
  await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", selectedUser.id)
    .single();

setSelectedUser({
  ...selectedUser,
  wallet_balance: newWallet.balance,
});

setWalletAmount("");
}

  function viewUser(user) {

  setSelectedUser(user);

  setBankName(
    user.bank_name || ""
  );

  setAccountName(
    user.account_name || ""
  );

  setAccountNumber(
    user.account_number || ""
  );
}

async function saveBankInfo() {

  await supabase
    .from("profiles")
    .update({
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
    })
    .eq(
      "id",
      selectedUser.id
    );

  await loadUsers();

setSelectedUser({
  ...selectedUser,
  bank_name: bankName,
  account_name: accountName,
  account_number: accountNumber,
});

alert("บันทึกสำเร็จ");
}

  const filteredUsers =
    users.filter(user => {

      const keyword =
        search.toLowerCase();

    

      return (
        

        String(
          user.username || ""
        )
          .toLowerCase()
          .includes(keyword)

        ||

        String(
          user.member_id || ""
        )
          .toLowerCase()
          .includes(keyword)

        ||

        String(
          user.mobile ||
          user.phone ||
          ""
        )
          .toLowerCase()
          .includes(keyword)

        ||

        String(
          user.id || ""
        )
          .toLowerCase()
          .includes(keyword)

        
      );

    });

  return (
    <>
    
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
          placeholder="
ค้นหา Member ID, ชื่อผู้ใช้,
เบอร์ หรือ UUID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: 12,
            borderRadius: 12,
            border:
              "1px solid #ddd",
            width: 320
          }}
        />

      </div>

      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}
      >
        <Users />
        สมาชิกทั้งหมด
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
        <h3>
          จำนวนสมาชิกทั้งหมด
        </h3>

        <h1>
          {filteredUsers.length}
        </h1>
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
              <th>Member ID</th>
              <th>ชื่อผู้ใช้</th>
              <th>เบอร์</th>
              <th>ยอดเงิน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>

          </thead>

          <tbody>

            {filteredUsers.map(
              (
                user,
                index
              ) => (

                <tr
                  key={user.id}
                  style={{
                    borderBottom:
                      "1px solid #eee"
                  }}
                >

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {user.member_id}
                  </td>

                  <td>
                    {user.username}
                  </td>

                  <td>
                    {user.mobile ||
                      user.phone ||
                      "-"}
                  </td>

                  <td>
                    ฿
                    {Number(
                        user.wallet_balance || 0
                    ).toLocaleString()}
                  </td>

                  <td>

                    <span
                      style={{
                        background:
                          "#22c55e",
                        color:
                          "#fff",
                        padding:
                          "5px 12px",
                        borderRadius:
                          20,
                        fontSize: 12
                      }}
                    >
                      Active
                    </span>

                  </td>

                  <td>

                    <div
                      style={{
                        display:
                          "flex",
                        gap: 10
                      }}
                    >

                      <button
                        onClick={() =>
                          viewUser(user)
                        }
                        style={{
                          background:
                            "#3b82f6",
                          border:
                            "none",
                          color:
                            "#fff",
                          padding:
                            "8px 12px",
                          borderRadius:
                            10,
                          cursor:
                            "pointer"
                        }}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(
                            user.id
                          )
                        }
                        style={{
                          background:
                            "#ef4444",
                          border:
                            "none",
                          color:
                            "#fff",
                          padding:
                            "8px 12px",
                          borderRadius:
                            10,
                          cursor:
                            "pointer"
                        }}
                      >
                        <Trash2 size={16} />
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

          {selectedUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "650px",
              background: "#fff",
              borderRadius: 20,
              padding: 25,
            }}
          >
            <h2>
              ข้อมูลสมาชิก
            </h2>

            <p>
              Member ID :
              {selectedUser.member_id}
            </p>

            <p>
              Username :
              {selectedUser.username}
            </p>

            <p>
              Mobile :
              {selectedUser.mobile}
            </p>

            <p>
              Invite :
              {selectedUser.invite_code}
            </p>

            <p>
              Customer :
              {selectedUser.customer_code}
            </p>

            <p>
              Wallet :
              ฿{Number(
                selectedUser.wallet_balance || 0
              ).toLocaleString()}
            </p>

            <p>
                ชื่อเจ้าของบัญชี :
                {selectedUser.account_name || "-"}
            </p>

            <p>
                ธนาคาร :
                {selectedUser.bank_name || "-"}
            </p>

            <p>
                เลขบัญชี :
                {selectedUser.account_number || "-"}
            </p>

            <hr />

            <h3>ข้อมูลธนาคาร</h3>

            <input
            type="text"
            value={accountName}
            onChange={(e)=>
                setAccountName(
                e.target.value
                )
            }
            placeholder="ชื่อเจ้าของบัญชี"
            />

            <input
            type="text"
            value={bankName}
            onChange={(e)=>
                setBankName(
                e.target.value
                )
            }
            placeholder="ชื่อธนาคาร"
            />

            <input
            type="text"
            value={accountNumber}
            onChange={(e)=>
                setAccountNumber(
                e.target.value
                )
            }
            placeholder="เลขบัญชี"
            />

            <button
            onClick={saveBankInfo}
            >
            บันทึกข้อมูลธนาคาร
            </button>

            <h3>
              เพิ่ม / ลดยอดเงิน
            </h3>

            <input
              type="number"
              value={walletAmount}
              onChange={(e) =>
                setWalletAmount(
                  e.target.value
                )
              }
              placeholder="จำนวนเงิน"
              style={{
                width: "100%",
                padding: 12,
                border:
                  "1px solid #ddd",
                borderRadius: 10,
                marginBottom: 15,
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <button
                onClick={addMoney}
                style={{
                  flex: 1,
                  background:
                    "#22c55e",
                  color: "#fff",
                  border: "none",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                + เพิ่มเงิน
              </button>

              <button
                onClick={removeMoney}
                style={{
                  flex: 1,
                  background:
                    "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                - ลบเงิน
              </button>
            </div>

            <button
              onClick={() =>
                setSelectedUser(
                  null
                )
              }
              style={{
                width: "100%",
                marginTop: 15,
                padding: 12,
                border: "none",
                borderRadius: 10,
                background: "#64748b",
                color: "#fff",
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
    
  );
}