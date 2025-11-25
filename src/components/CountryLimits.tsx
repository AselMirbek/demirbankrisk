// components/CountryLimits.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, Edit, Plus, Search, X } from "lucide-react";

import AddCountryLimitDialog from "./AddCountryLimitDialog";
import EditCountryLimitDialog from "./EditCountryLimitDialog";
import ViewCountryLimitDialog from "./ViewCountryLimitDialog";

export type HistoryRecord = {
  changedAt: string;
  changedBy: string;
  approvedBy?: string | null;
  oldLimit?: string;
  newLimit?: string;
  oldValidUntil?: string;
  newValidUntil?: string;
  status: "PendingMaker" | "DeletedByMaker" | "Approved" | "Dissmised" | "Edited";
};

export type PendingBlock = {
  oldLimit?: string;
  newLimit?: string;
  oldValidUntil?: string;
  newValidUntil?: string;
  oldProtocol?: string;
  newProtocol?: string;
  requestedBy?: string;
  requestedAt?: string;
  status?: "PendingMaker" | "DeletedByMaker" | "Approved" | "Dissmised" | "Edited" | null;
} | null;

export type CountryRecord = {
  code: string;
  name: string;
  balance: string;
  landing: string;
  currentLimit: string;
  overlimit: string;
  limitExceeded: string;
  currentValidUntil: string;
  currentProtocol: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  status: "Active" | "PendingMaker" | "DeletedByMaker" | "Approved" | "Dissmised";
  pending: PendingBlock;
  history: HistoryRecord[];
};

const today = () => new Date().toISOString().split("T")[0];

/** demo initial data with 4 history examples per row (Approved / Dismissed / DeletedByMaker / PendingMaker) */
const initialData = (): CountryRecord[] => {
  const base = [
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "TR", name: "Turkey" },
  ];

  return base.map((b, i) => {
    const hist: HistoryRecord[] = [
      {
        changedAt: "2025-01-15",
        changedBy: "maker_user",
        approvedBy: "approval_user",
        oldLimit: `${200000 + i * 10000}`,
        newLimit: `${250000 + i * 10000}`,
        oldValidUntil: "2024-12-31",
        newValidUntil: "2025-12-31",
        status: "Approved",
      },
      {
        changedAt: "2024-11-10",
        changedBy: "maker_user",
        approvedBy: "approval_user",
        oldLimit: `${150000 + i * 5000}`,
        newLimit: `${200000 + i * 8000}`,
        oldValidUntil: "2023-12-31",
        newValidUntil: "2024-12-31",
        status: "Dissmised",
      },
      {
        changedAt: "2024-10-01",
        changedBy: "maker_user",
        approvedBy: null,
        oldLimit: `${120000 + i * 3000}`,
        newLimit: `${140000 + i * 3000}`,
        oldValidUntil: "2023-06-01",
        newValidUntil: "2024-06-01",
        status: "DeletedByMaker",
      },
      {
        changedAt: "2025-02-01",
        changedBy: "maker_user",
        approvedBy: null,
        oldLimit: `${250000 + i * 12000}`,
        newLimit: `${300000 + i * 12000}`,
        oldValidUntil: "2025-01-01",
        newValidUntil: "2026-01-01",
        status: "PendingMaker",
      },
    ];

    // Put last entry as current pending (for some rows) to demo disabled edit
    const pending =
      i % 2 === 0
        ? {
            oldLimit: `${250000 + i * 12000}`,
            newLimit: `${300000 + i * 12000}`,
            oldValidUntil: "2025-01-01",
            newValidUntil: "2026-01-01",
            oldProtocol: `BD-${100 + i}/2024`,
            newProtocol: `BD-${200 + i}/2025`,
            requestedBy: "maker_user",
            requestedAt: "2025-02-01T10:00:00Z",
            status: "PendingMaker" as const,
          }
        : null;

    const currentLimit = pending ? pending.oldLimit! : `${300000 + i * 10000}`;

    return {
      code: b.code,
      name: b.name,
      balance: `${Math.floor(Math.random() * 500 + 50)},000`,
      landing: `${Math.floor(Math.random() * 50 + 5)},000`,
      currentLimit,
      overlimit: Math.random() > 0.7 ? `${Math.floor(Math.random() * 50)}000` : "0",
      limitExceeded: Math.random() > 0.8 ? "Yes" : "No",
      currentValidUntil: pending ? pending.oldValidUntil! : `2025-12-31`,
      currentProtocol: `BD-${100 + i}/2024`,
      lastUpdated: today(),
      lastUpdatedBy: ["risk_maker", "risk_user", "risk_admin"][i % 3],
      status: pending ? "PendingMaker" : "Active",
      pending,
      history: hist,
    } as CountryRecord;
  });
};

const CountryLimits: React.FC = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [data, setData] = useState<CountryRecord[]>(initialData());
  const [selected, setSelected] = useState<CountryRecord | null>(null);

  const filtered = useMemo(() => {
    if (!searchValue) return data;
    const s = searchValue.toLowerCase();
    return data.filter((r) => r.code.toLowerCase().includes(s) || r.name.toLowerCase().includes(s));
  }, [data, searchValue]);

  const openEdit = (row: CountryRecord) => {
    setSelected(row);
    setEditOpen(true);
  };

  const openView = (row: CountryRecord) => {
    setSelected(row);
    setViewOpen(true);
  };

  /** Maker submits request (create/update pending on row) */
  const handleSubmitRequest = (updatedPending: { code: string; pending: PendingBlock }) => {
    setData((prev) =>
      prev.map((r) => {
        if (r.code !== updatedPending.code) return r;

        // create history entry for request creation
        const now = new Date().toISOString();
        const p = updatedPending.pending!;
        const hist: HistoryRecord = {
          changedAt: now,
          changedBy: p.requestedBy ?? "maker_user",
          approvedBy: null,
          oldLimit: p.oldLimit,
          newLimit: p.newLimit,
          oldValidUntil: p.oldValidUntil,
          newValidUntil: p.newValidUntil,
          status: "PendingMaker",
        };

        return {
          ...r,
          pending: {
            ...p,
            status: "PendingMaker",
            requestedAt: p.requestedAt ?? now,
            requestedBy: p.requestedBy ?? "maker_user",
          },
          status: "PendingMaker",
          history: [hist, ...r.history],
        };
      })
    );
  };

  /** Withdraw (maker) - mark DeletedByMaker and add history entry */
  const withdrawRequest = (code: string, by = "maker_user") => {
    setData((prev) =>
      prev.map((r) => {
        if (r.code !== code) return r;
        if (!r.pending) return r;
        const now = new Date().toISOString();
        const hist: HistoryRecord = {
          changedAt: now,
          changedBy: by,
          approvedBy: null,
          oldLimit: r.pending.oldLimit,
          newLimit: r.pending.newLimit,
          oldValidUntil: r.pending.oldValidUntil,
          newValidUntil: r.pending.newValidUntil,
          status: "DeletedByMaker",
        };
        return {
          ...r,
          pending: null,
          status: "Active",
          history: [hist, ...r.history],
        };
      })
    );
  };

  /** Approve (for simulation) */
  const approveRequest = (code: string, approver = "approval_user") => {
    setData((prev) =>
      prev.map((r) => {
        if (r.code !== code) return r;
        if (!r.pending) return r;
        const now = new Date().toISOString();
        const hist: HistoryRecord = {
          changedAt: now,
          changedBy: r.pending.requestedBy ?? "maker_user",
          approvedBy: approver,
          oldLimit: r.pending.oldLimit,
          newLimit: r.pending.newLimit,
          oldValidUntil: r.pending.oldValidUntil,
          newValidUntil: r.pending.newValidUntil,
          status: "Approved",
        };
        return {
          ...r,
          currentLimit: r.pending.newLimit ?? r.currentLimit,
          currentValidUntil: r.pending.newValidUntil ?? r.currentValidUntil,
          currentProtocol: r.pending.newProtocol ?? r.currentProtocol,
          lastUpdated: now.split("T")[0],
          lastUpdatedBy: approver,
          pending: null,
          status: "Active",
          history: [hist, ...r.history],
        };
      })
    );
  };

  /** Reject (for simulation) */
  const rejectRequest = (code: string, approver = "approval_user") => {
    setData((prev) =>
      prev.map((r) => {
        if (r.code !== code) return r;
        if (!r.pending) return r;
        const now = new Date().toISOString();
        const hist: HistoryRecord = {
          changedAt: now,
          changedBy: r.pending.requestedBy ?? "maker_user",
          approvedBy: approver,
          oldLimit: r.pending.oldLimit,
          newLimit: r.pending.newLimit,
          oldValidUntil: r.pending.oldValidUntil,
          newValidUntil: r.pending.newValidUntil,
          status: "Dissmised",
        };
        return {
          ...r,
          pending: null,
          status: "Active",
          history: [hist, ...r.history],
        };
      })
    );
  };

  const handleAdd = (entry: any) => {
    const newRec: CountryRecord = {
      code: entry.code,
      name: entry.name,
      balance: entry.balance ?? "0",
      landing: entry.landing ?? "0",
      currentLimit: entry.limit ?? "0",
      overlimit: entry.overlimit ?? "0",
      limitExceeded: entry.limitExceeded ?? "No",
      currentValidUntil: entry.validUntil ?? "Unlimited",
      currentProtocol: entry.protocolNo ?? "",
      lastUpdated: today(),
      lastUpdatedBy: entry.lastUpdatedBy ?? "maker_user",
      status: "Active",
      pending: null,
      history: [],
    };
    setData((prev) => [newRec, ...prev]);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Risk Management → Country Limits</h1>
          <Button className="bg-primary text-primary-foreground" onClick={() => navigate("/admin")}>
            Go to Admin Panel
          </Button>
        </div>

        <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
          <div className="bg-card rounded-lg border border-border mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Filter</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative w-[300px]">
                    <Input
                      placeholder="country code/name"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pr-10"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button variant="destructive" size="sm" onClick={() => setSearchValue("")}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filter
                  </Button>

                  <Button size="sm" className="bg-success text-white" onClick={() => setAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Country Limit
                  </Button>

                  <Button size="sm" className="bg-muted/80" onClick={() => { console.log("Export to excel (implement)"); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* General table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto relative">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="border-r border-border">Code</TableHead>
                  <TableHead className="border-r border-border">Country Name</TableHead>
                  <TableHead className="border-r border-border">Balance</TableHead>
                  <TableHead className="border-r border-border">Landing</TableHead>
                  <TableHead className="border-r border-border">Limit</TableHead>
                  <TableHead className="border-r border-border">Overlimit</TableHead>
                  <TableHead className="border-r border-border">Limit Exceeded</TableHead>
                  <TableHead className="border-r border-border">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.code} className="border-b border-border hover:bg-muted/50">
                    <TableCell className="font-medium border-r border-border">{row.code}</TableCell>
                    <TableCell className="border-r border-border">{row.name}</TableCell>
                    <TableCell className="border-r border-border">{row.balance}</TableCell>
                    <TableCell className="border-r border-border">{row.landing}</TableCell>
                    <TableCell className="border-r border-border">{row.currentLimit}</TableCell>
                    <TableCell className="border-r border-border">{row.overlimit}</TableCell>
                    <TableCell className="border-r border-border">
                      <Badge variant="outline" className={row.limitExceeded === "Yes" ? "bg-destructive/10 text-destructive" : "bg-muted"}>
                        {row.limitExceeded}
                      </Badge>
                    </TableCell>

                    <TableCell className="border-r border-border">
                      <div>
                        {row.status === "Active" && <span className="px-2 py-1 rounded text-sm bg-muted/20">Active</span>}
                        {row.status === "PendingMaker" && <span className="px-2 py-1 rounded text-sm bg-warning/20">Pending (Maker)</span>}
                        {row.status === "DeletedByMaker" && <span className="px-2 py-1 rounded text-sm bg-destructive/10">Deleted</span>}
                        {row.status === "Approved" && <span className="px-2 py-1 rounded text-sm bg-success/20">Approved</span>}
                        {row.status === "Dissmised" && <span className="px-2 py-1 rounded text-sm bg-destructive/20">Dismissed</span>}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openView(row)}>
                          <Edit className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        {/* Edit hidden if pending exists */}
                        {!row.pending?.status && (
                          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}

                        {/* Withdraw / delete action shown as an extra button near the row (styled to appear outside table) */}
                        {row.pending?.status === "PendingMaker" && (
                          <Button variant="ghost" size="icon" onClick={() => withdrawRequest(row.code)} className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 ml-1">
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* NOTE: floating instruction showing that X is "near" row (visual approximate). */}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddCountryLimitDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleAdd} />

      <EditCountryLimitDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        country={selected}
        onSave={(payload) => {
          // payload: { code, pending: PendingBlock }
          handleSubmitRequest(payload);
          setEditOpen(false);
        }}
        currentUserLogin={"maker_user"}
      />

      <ViewCountryLimitDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        country={selected}
      />
    </div>
  );
};

export default CountryLimits;
