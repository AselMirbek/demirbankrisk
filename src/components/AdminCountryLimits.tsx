import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { Check, X, Edit, Plus } from "lucide-react";

import AddCountryLimitDialog from "./AddCountryLimitDialog";
import EditCountryLimitDialog from "./EditCountryLimitDialog";

export default function AdminCountryLimits() {
  const [activeTab, setActiveTab] = useState("approval");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // DATA for Approval
  const [approvalData, setApprovalData] = useState([
    {
      id: 1,
      code: "CA",
      countryName: "Canada",
      oldLimit: "139M",
      newLimit: "579M",
      protocol: "BD-100/2025",
      requestedBy: "risk_analyst",
      requestedAt: "2025-01-19",
      approved: false,
      rejected: false,
    },
    {
      id: 2,
      code: "SG",
      countryName: "Singapore",
      oldLimit: "186M",
      newLimit: "204M",
      protocol: "BD-101/2025",
      requestedBy: "risk_maker",
      requestedAt: "2025-01-17",
      approved: false,
      rejected: false,
    },
  ]);

  // approve / reject
  const toggleStatus = (id: number, field: "approved" | "rejected") => {
    setApprovalData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: !row[field] } : row
      )
    );
  };

  // open Edit dialog
  const openEditDialog = (row: any) => {
    setSelectedCountry({
      code: row.code,
      name: row.countryName,
      balance: "",
      landing: "",
      limit: row.newLimit,
      overlimit: "0",
      limitExceeded: "No",
      validUntil: "Unlimited",
      protocolNo: row.protocol,
      lastUpdated: row.requestedAt,
      lastUpdatedBy: row.requestedBy,
    });

    setShowEdit(true);
  };

  const handleSaveEdit = (updated: any) => {
    setApprovalData((prev) =>
      prev.map((row) =>
        row.code === updated.code
          ? {
              ...row,
              newLimit: updated.limit,
              protocol: updated.protocolNo,
            }
          : row
      )
    );
  };

  const handleSaveAdd = (data: any) => {
    setApprovalData((prev) => [
      ...prev,
      {
        id: Date.now(),
        code: data.country.slice(0, 2).toUpperCase(),
        countryName: data.country,
        oldLimit: "0",
        newLimit: data.limit + "M",
        protocol: data.protocol,
        requestedBy: "admin_panel",
        requestedAt: data.date,
        approved: false,
        rejected: false,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Admin Panel -- Country Limits
      </h1>

      <Tabs defaultValue="approval" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger
            value="approval"
            className="data-[state=active]:bg-warning data-[state=active]:text-white"
          >
            Approval
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* ADD BUTTON */}
        <div className="flex justify-end">
          <Button
            className="bg-success text-white hover:bg-success/90"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Country Limit
          </Button>
        </div>

        {/* APPROVAL TAB */}
        <TabsContent value="approval">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Old Limit</TableHead>
                  <TableHead>New Limit</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>✓</TableHead>
                  <TableHead>✕</TableHead>
                  <TableHead>Edit</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {approvalData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/40">
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.countryName}</TableCell>
                    <TableCell>{row.oldLimit}</TableCell>
                    <TableCell className="text-success font-medium">
                      {row.newLimit}
                    </TableCell>
                    <TableCell className="text-blue-600 underline">
                      {row.protocol}
                    </TableCell>
                    <TableCell>{row.requestedBy}</TableCell>
                    <TableCell>{row.requestedAt}</TableCell>

                    <TableCell>
                      {row.approved ? (
                        <Badge className="bg-success text-white">Approved</Badge>
                      ) : row.rejected ? (
                        <Badge className="bg-destructive text-white">Rejected</Badge>
                      ) : (
                        <Badge className="bg-warning text-white">Pending</Badge>
                      )}
                    </TableCell>

                    {/* APPROVE */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-success hover:text-success/80"
                        onClick={() => toggleStatus(row.id, "approved")}
                      >
                        <Check />
                      </Button>
                    </TableCell>

                    {/* REJECT */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => toggleStatus(row.id, "rejected")}
                      >
                        <X />
                      </Button>
                    </TableCell>

                    {/* EDIT */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openEditDialog(row)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="general">
          <p className="text-muted-foreground">General section</p>
        </TabsContent>

        <TabsContent value="history">
          <p className="text-muted-foreground">History section</p>
        </TabsContent>
      </Tabs>

      {/* DIALOGS */}
      <AddCountryLimitDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleSaveAdd}
      />

      <EditCountryLimitDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        country={selectedCountry}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

