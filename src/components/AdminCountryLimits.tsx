import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, Edit, Plus, Search, X,Check } from "lucide-react";
import EditCountryLimitDialog from "./EditCountryLimitDialog";
import ViewCountryLimitDialog from "./ViewCountryLimitDialog";
import AddCountryLimitDialog from "./AddCountryLimitDialog";
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
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);

  const [selected, setSelected] = useState(null);
  
const filtered = useMemo(() => {
    if (!searchValue) return data;
    const s = searchValue.toLowerCase();
    return data.filter((r) => r.code.toLowerCase().includes(s) || r.name.toLowerCase().includes(s));
  }, [data, searchValue]);
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
          oldProtocol: r.pending.oldProtocol,
          newProtocol: r.pending.newProtocol,
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
<AddCountryLimitDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleAdd} />
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
