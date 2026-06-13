"use client";

import { table } from "console";
import { useEffect, useState } from "react";

type User = {
  id: number;
  member_id: string;
  name: string;
  mobile: string;
  aadhar_number?: string;
  taluk?: string;
  village?: string;
};


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Load data
  useEffect(() => {
    async function loadData() {
      try {
        // 🔐 Check current user
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meRes.ok || meData.member?.mobile !== "9585005304") {
          window.location.href = "/";
          return;
        }

        setIsAdmin(true);

        // ✅ Fetch all members
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    

    loadData();
  }, []);

  // ✅ Search filter
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.mobile?.includes(search)
  ); 
  // ✅ Reset PIN
  async function resetPin(userId: number)  {
    const newPin = prompt("Enter new 4-digit PIN");

    if (!newPin || newPin.length !== 4) {
      alert("Invalid PIN ❌");
      return;
    }

    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newPin }),
    });

    if (res.ok) {
      alert("PIN updated ✅");
    } else {
      alert("Error updating PIN ❌");
    }
  }

  if (!isAdmin) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Checking admin access...
    </div>
  );
}
  return (
    <div className="min-h-screen bg-emerald-950 text-white p-6">
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-amber-400 mb-4">
        Admin Dashboard
      </h1>

      {/* Count */}
      <p className="mb-4 text-sm text-emerald-300">
        Total Farmers:{" "}
        <span className="text-amber-300 font-bold">
          {filteredUsers.length}
        </span>
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded-lg bg-emerald-900 border border-emerald-700 focus:outline-none focus:border-amber-500"
      />

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-emerald-800 rounded-xl overflow-hidden">
            
            <thead className="bg-emerald-900">
                <tr>
                    <th className="p-3 text-left">Member ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Mobile</th>
                    <th className="p-3 text-left">Aadhar</th>
                    <th className="p-3 text-left">Taluk</th>
                    <th className="p-3 text-left">Village</th>
                    <th className="p-3 text-left">Action</th>
                </tr>
</thead>

        <tbody>
  {filteredUsers.map((u) => (
    <tr key={u.id} className="border-t border-emerald-800">

      <td className="p-3 text-amber-300 font-mono">
        {u.member_id}
      </td>

      <td className="p-3">{u.name}</td>

      <td className="p-3">{u.mobile}</td>

      <td className="p-3">
        {u.aadhar_number || "—"}
      </td>

      <td className="p-3">{u.taluk}</td>

      <td className="p-3">{u.village}</td>

      <td className="p-3">
        <button
          onClick={() => resetPin(u.id)}
          className="px-3 py-1 bg-amber-500 text-emerald-950 rounded"
        >
          Reset PIN
        </button>
      </td>

    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}