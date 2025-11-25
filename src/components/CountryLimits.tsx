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

/** Типы */
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
  // pending application stored inside the same row
  pending: PendingBlock;
  // history array
  history: HistoryRecord[];
};

/** Генератор демо-данных (можешь заменить select-ами) */
const demoCountries = [
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "TR", name: "Turkey" },
];

const today = () => new Date().toISOString().split("T")[0];

const generateDemoData = (): CountryRecord[] =>
  demoCountries.map((c, i) => ({
    code: c.code,
    name: c.name,
    balance: `${Math.floor(Math.random() * 500 + 50)},000`,
    landing: `${Math.floor(Math.random() * 50 + 5)},000`,
    currentLimit: `${Math.floor(200 + i * 50)}000`,
    overlimit: Math.random() > 0.7 ? `${Math.floor(Math.random() * 50)}000` : "0",
    limitExceeded: Math.random() > 0.8 ? "Yes" : "No",
    currentValidUntil: Math.random() > 0.5 ? "Unlimited" : `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, "0")}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, "0")}`,
    currentProtocol: `BD-${100 + i}/2024`,
    lastUpdated: today(),
    lastUpdatedBy: ["risk_maker", "risk_user", "risk_admin"][i % 3],
    status: "Active",
    pending: null,
    history: [],
  }));

/** Компонент */
const CountryLimits: React.FC = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [data, setData] = useState<CountryRecord[]>(generateDemoData());
  const [selected, setSelected] = useState<CountryRecord | null>(null);

  /** Фильтрирование по коду/имени */
  const filtered = useMemo(() => {
    if (!searchValue) return data;
    const s = searchValue.toLowerCase();
    return data.filter((r) => r.code.toLowerCase().includes(s) || r.name.toLowerCase().includes(s));
  }, [data, searchValue]);

  /** Открыть edit dialog (maker) */
  const openEdit = (row: CountryRecord) => {
    setSelected(row);
    setEditOpen(true);
  };

  /** Open view */
  const openView = (row: CountryRecord) => {
    setSelected(row);
    setViewOpen(true);
  };

  /** Save request from Edit dialog (Maker submits request) */
  const handleSubmitRequest = (updated: CountryRecord) => {
    // Updated contains pending fields (we assume Edit dialog returns CountryRecord with pending filled)
    setData((prev) =>
      prev.map((r) => {
        if (r.code !== updated.code) return r;
        // create pending block from updated
        const pending: PendingBlock = {
          oldLimit: r.currentLimit,
          newLimit: updated.pending?.newLimit ?? updated.currentLimit,
          oldValidUntil: r.currentValidUntil,
          newValidUntil: updated.pending?.newValidUntil ?? r.currentValidUntil,
          oldProtocol: r.currentProtocol,
          newProtocol: updated.pending?.newProtocol ?? r.currentProtocol,
          requestedBy: updated.pending?.requestedBy ?? "maker_user",
          requestedAt: updated.pending?.requestedAt ?? new Date().toISOString(),
          status: "PendingMaker",
        };

        // add history record for creation of request
        const historyEntry: HistoryRecord = {
          changedAt: pending.requestedAt!,
          changedBy: pending.requestedBy!,
          approvedBy: null,
          oldLimit: pending.oldLimit,
          newLimit: pending.newLimit,
          oldValidUntil: pending.oldValidUntil,
          newValidUntil: pending.newValidUntil,
          status: "PendingMaker",
        };

        return {
          ...r,
          pending,
          status: "PendingMaker",
          // live values not changed
          history: [historyEntry, ...r.history],
        };
      })
    );
  };

  /** Withdraw request (Maker) - mark DeletedByMaker and add history entry */
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
          status: "Active", // removed from pending
          history: [hist, ...r.history],
        };
      })
    );
  };

  /** Approve request (would be used by approval role) - applies live change, history updated */
  const approveRequest = (code: string, approver = "approval_user") => {
    setData((prev) =>
      prev.map((r) => {
        if (r.code !== code) return r;
        if (!r.pending) return r;
        const now = new Date().toISOString();
        // apply pending to live
        const newLiveLimit = r.pending.newLimit ?? r.currentLimit;
        const newLiveValid = r.pending.newValidUntil ?? r.currentValidUntil;
        const newProt = r.pending.newProtocol ?? r.currentProtocol;

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
          currentLimit: newLiveLimit,
          currentValidUntil: newLiveValid,
          currentProtocol: newProt,
          lastUpdated: now.split("T")[0],
          lastUpdatedBy: approver,
          pending: null,
          status: "Active",
          history: [hist, ...r.history],
        };
      })
    );
  };

  /** Reject request (approval) - leave live as is but history record */
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

  /** Add new country via Add dialog */
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
      lastUpdated: entry.lastUpdated ?? today(),
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

                  <Button size="sm" className="bg-muted/80" onClick={() => {
                    // implement export logic
                    console.log("Export to excel (implement)");
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* General table (single source of truth) */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
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
                  <TableHead className="border-r border-border">Valid Until</TableHead>
                  <TableHead className="border-r border-border">Protocol No</TableHead>
                  <TableHead className="border-r border-border">Last Updated</TableHead>
                  <TableHead className="border-r border-border">Last Updated By</TableHead>
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
                    <TableCell className="border-r border-border">{row.currentValidUntil}</TableCell>
                    <TableCell className="text-accent border-r border-border">{row.currentProtocol}</TableCell>
                    <TableCell className="text-muted-foreground border-r border-border">{row.lastUpdated}</TableCell>
                    <TableCell className="text-muted-foreground border-r border-border">{row.lastUpdatedBy}</TableCell>
                    <TableCell className="border-r border-border">
                      <span className="px-2 py-1 rounded">
                        {row.status === "Active" && "Active"}
                        {row.status === "PendingMaker" && "Pending (Maker)"}
                        {row.status === "DeletedByMaker" && "Deleted"}
                        {row.status === "Approved" && "Approved"}
                        {row.status === "Dissmised" && "Dismissed"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openView(row)}>
                          <Edit className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        {/*
                          Edit: maker can create/edit a pending request.
                          If row has pending — Edit should allow to modify existing request (or create new).
                        */}
                        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        {/* If there is a pending request — show withdraw (maker) */}
                        {row.pending?.status === "PendingMaker" && (
                          <Button variant="destructive" size="sm" onClick={() => withdrawRequest(row.code)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddCountryLimitDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleAdd} />

      {/* Edit dialog: we pass selected row; Edit dialog should call handleSubmitRequest */}
      <EditCountryLimitDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        country={selected}
        onSave={(updated) => {
          // Edit dialog returns a CountryRecord-like object with pending fields set
          handleSubmitRequest(updated);
          setEditOpen(false);
        }}
        currentUserLogin={"maker_user"}
      />

      {/* View dialog: we pass selected row and handlers for approve/reject/withdraw */}
      <ViewCountryLimitDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        country={selected}
      />

      {/* NOTE: Approve/Reject functions are available in this component:
          - approveRequest(code)
          - rejectRequest(code)
         In production these should be invoked only by users with Approval role.
      */}
    </div>
  );
};

export default CountryLimits;
