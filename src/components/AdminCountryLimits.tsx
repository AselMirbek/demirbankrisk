import React, { useState } from "react";
import AddCountryLimitDialog from "./AddCountryLimitDialog";

export default function AdminCountryLimits() {
  const tabs = ["general", "approval", "history"]; 
  const [activeTab, setActiveTab] = useState("general");
  const [showAdd, setShowAdd] = useState(false);

  const [approvalItems, setApprovalItems] = useState([
    {
      id: 1,
      country: "Turkey",
      limit: 5000,
      protocol: "PR-001",
      date: new Date().toISOString().slice(0, 10),
      approved: false,
      rejected: false,
    },
  ]);

  const toggle = (id, field) => {
    setApprovalItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: !i[field] } : i))
    );
  };

  const onSaveAdd = (data) => {
    setApprovalItems((prev) => [...prev, data]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel - Country Limits</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            className={`pb-1 ${activeTab === t ? "border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        className="bg-blue-600 text-white px-3 py-2 rounded mb-3"
        onClick={() => setShowAdd(true)}
      >
        Add Country Limit
      </button>

      {/* APPROVAL TAB */}
      {activeTab === "approval" && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Country</th>
              <th className="p-2 border">Limit</th>
              <th className="p-2 border">Protocol</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">✔</th>
              <th className="p-2 border">✖</th>
              <th className="p-2 border">Edit</th>
            </tr>
          </thead>
          <tbody>
            {approvalItems.map((row) => (
              <tr key={row.id}>
                <td className="p-2 border">{row.country}</td>
                <td className="p-2 border">{row.limit}</td>
                <td className="p-2 border">{row.protocol}</td>
                <td className="p-2 border">{row.date}</td>

                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={row.approved}
                    onChange={() => toggle(row.id, "approved")}
                  />
                </td>

                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={row.rejected}
                    onChange={() => toggle(row.id, "rejected")}
                  />
                </td>

                <td className="p-2 border text-center">
                  <button className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* GENERAL */}
      {activeTab === "general" && <div>General section (same as your existing logic)</div>}

      {/* HISTORY */}
      {activeTab === "history" && <div>History section</div>}

      {/* ADD MODAL */}
      <AddCountryLimitDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={onSaveAdd}
      />
    </div>
  );
}
