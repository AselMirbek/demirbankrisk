import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
}

const HistoryDialog: React.FC<Props> = ({ open, onOpenChange, data }) => {
  // flatten all history
  const allHistory = data.flatMap((r) =>
    r.history.map((h: any) => ({
      ...h,
      code: r.code,
      country: r.name,
    }))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px]">
        <DialogHeader>
          <DialogTitle>Full History</DialogTitle>
        </DialogHeader>

        <div className="border rounded-md overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Changed At</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Old Limit</TableHead>
                <TableHead>New Limit</TableHead>
                <TableHead>Old Valid</TableHead>
                <TableHead>New Valid</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {allHistory.map((h, i) => (
                <TableRow key={i}>
                  <TableCell>{h.code}</TableCell>
                  <TableCell>{h.country}</TableCell>
                  <TableCell>{h.changedAt}</TableCell>
                  <TableCell>{h.changedBy}</TableCell>
                  <TableCell>{h.approvedBy ?? "-"}</TableCell>
                  <TableCell>{h.oldLimit}</TableCell>
                  <TableCell>{h.newLimit}</TableCell>
                  <TableCell>{h.oldValidUntil}</TableCell>
                  <TableCell>{h.newValidUntil}</TableCell>
                  <TableCell>{h.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDialog;
