import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Edit, Search, X, Check } from "lucide-react";

import EditCountryLimitDialog from "./EditCountryLimitDialog";
import ViewCountryLimitDialog from "./ViewCountryLimitDialog";
import ApprovalDialog from "./ApprovalDialog";
const approvalCount = 3;

export default function AdminCountryLimits() {
  // ------------------------ DATA --------------------------
  const [countries, setCountries] = useState([
    {
      code: "TR",
      name: "Turkey",
      balance: "487,000",
      landing: "52,000",
      currentLimit: "298000",
      overlimit: "0",
      limitExceeded: "No",
      currentProtocol: "BD-104/2024",
      currentValidUntil: "2025-01-01",
      lastUpdated: "2025-01-10",
      lastUpdatedBy: "risk_user",
      status: "Active",
      pending: null,
      history: [],
    },
  ]);

  const [requests, setRequests] = useState([
    {
      id: 1,
      code: "TR",
      countryName: "Turkey",
      oldLimit: "298000",
      newLimit: "348000",
      oldValidUntil: "2025-01-01",
      newValidUntil: "2026-01-01",
      oldProtocol: "BD-104/2024",
      newProtocol: "BD-204/2025",
      requestedBy: "risk_maker",
      requestedAt: "2025-02-01",
      status: "Pending",
    },
  ]);

  const approvalCount = requests.filter((r) => r.status === "Pending").length;

  // dialogs
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);

  const [selected, setSelected] = useState(null);

  // ------------------------ HANDLERS --------------------------
  const openEdit = (row) => {
    setSelected(row);
    setEditOpen(true);
  };

  const openView = (row) => {
    setSelected(row);
    setViewOpen(true);
  };

  const submitEdit = (payload) => {
    const { code, pending } = payload;

    // add request
    setRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        code,
        countryName: countries.find((c) => c.code === code)?.name,
        oldLimit: pending.oldLimit,
        newLimit: pending.newLimit,
        oldValidUntil: pending.oldValidUntil,
        newValidUntil: pending.newValidUntil,
        oldProtocol: pending.oldProtocol,
        newProtocol: pending.newProtocol,    
        requestedBy: "approval_user",
        requestedAt: new Date().toISOString(),
        status: "Pending",
      },
    ]);

    // mark row as pending
    setCountries((prev) =>
      prev.map((r) =>
        r.code === code
          ? { ...r, status: "Pending", pending: pending }
          : r
      )
    );

    setEditOpen(false);
  };

  const approve = (req) => {
    // update live row
    setCountries((prev) =>
      prev.map((r) =>
        r.code === req.code
          ? {
              ...r,
              currentLimit: req.newLimit,
              currentValidUntil: req.newValidUntil,
              currentProtocol: req.protocol,
              pending: null,
              status: "Active",
              lastUpdated: new Date().toISOString().split("T")[0],
              lastUpdatedBy: "approval_user",
            }
          : r
      )
    );

    // update request status
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: "Approved" } : r
      )
    );
  };

  const reject = (req) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: "Rejected" } : r
      )
    );

    // remove pending from row
    setCountries((prev) =>
      prev.map((r) =>
        r.code === req.code ? { ...r, pending: null, status: "Active" } : r
      )
    );
  };

  // ------------------------ UI --------------------------
  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Panel — Country Limits</h1>

        {/* 🔥 Notification Button */}
     <Button
    onClick={() => setApprovalOpen(true)}
    className="relative bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 flex items-center gap-2"
    >
    <Check className="h-4 w-4" />

    <span className="
      absolute -right-2 -top-2
      bg-white text-blue-600 text-xs font-bold
      w-6 h-6 rounded-full flex items-center justify-center shadow
    ">
      {approvalCount}
    </span>
  </Button>
      </div>

      {/* ------------ General table ----------------- */}
      <div className="bg-card rounded-lg border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Landing</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Overlimit</TableHead>
              <TableHead>Limit Exceeded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {countries.map((row) => (
              <TableRow key={row.code}>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.balance}</TableCell>
                <TableCell>{row.landing}</TableCell>
                <TableCell>{row.currentLimit}</TableCell>
                <TableCell>{row.overlimit ?? "0"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      row.limitExceeded === "Yes"
                        ? "bg-red-500 text-white"
                        : "bg-muted"
                    }
                  >
                    {row.limitExceeded}
                  </Badge>
                </TableCell>

                <TableCell>{row.currentValidUntil}</TableCell>

                <TableCell>
                  <Badge
                    className={
                      row.status === "Pending"
                        ? "bg-yellow-400"
                        : "bg-muted"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openView(row)}
                    >
                      View
                    </Button>

                    {row.status !== "Pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(row)}
                      >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
              )}

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- Dialogs ----------------- */}
      <EditCountryLimitDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        country={selected}
        onSave={submitEdit}
      />

      <ViewCountryLimitDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        country={selected}
      />

      <ApprovalDialog
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        requests={requests}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  );
}
