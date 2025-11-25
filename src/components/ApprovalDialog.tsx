// components/ApprovalDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requests: any[];
  onApprove: (req: any) => void;
  onReject: (req: any) => void;
};

const ApprovalDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  requests,
  onApprove,
  onReject,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Approval Requests ({requests.length})
          </DialogTitle>
        </DialogHeader>

        {requests.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 text-sm">
            No pending requests.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Old Limit</TableHead>
                <TableHead>New Limit</TableHead>
                <TableHead>Old Valid Until</TableHead>
                <TableHead>New Valid Until</TableHead>
                <TableHead>New Protocol</TableHead>
                <TableHead>Old Protocol</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>✓</TableHead>
                <TableHead>✕</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/40">
                  <TableCell>{req.code}</TableCell>
                  <TableCell>{req.countryName}</TableCell>
                  <TableCell>{req.oldLimit}</TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {req.newLimit}
                  </TableCell>

                  <TableCell>{req.oldValidUntil ?? "-"}</TableCell>
                  <TableCell>{req.newValidUntil ?? "-"}</TableCell>

                  <TableCell className="text-blue-600 underline">
                    {req.protocol}
                  </TableCell>

                  <TableCell>{req.requestedBy}</TableCell>
                  <TableCell>{req.requestedAt}</TableCell>

                  <TableCell>
                    {req.status === "Pending" && (
                      <Badge className="bg-yellow-500 text-white">Pending</Badge>
                    )}
                    {req.status === "Approved" && (
                      <Badge className="bg-green-600 text-white">Approved</Badge>
                    )}
                    {req.status === "Rejected" && (
                      <Badge className="bg-red-600 text-white">Rejected</Badge>
                    )}
                  </TableCell>

                  {/* Approve */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={req.status !== "Pending"}
                      className="text-green-600 hover:text-green-800 disabled:opacity-40"
                      onClick={() => onApprove(req)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TableCell>

                  {/* Reject */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={req.status !== "Pending"}
                      className="text-red-600 hover:text-red-800 disabled:opacity-40"
                      onClick={() => onReject(req)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;
