// components/ViewCountryLimitDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountryRecord } from "./CountryLimits"; // import type only

const ViewCountryLimitDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: CountryRecord | null;
}> = ({ open, onOpenChange, country }) => {
  if (!country) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>View Country Limit — {country.name} ({country.code})</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-medium">Current (live)</h4>
            <div className="mt-2 space-y-2">
              <div>Balance: <strong>{country.balance}</strong></div>
              <div>Landing: <strong>{country.landing}</strong></div>
              <div>Current Limit: <strong>{country.currentLimit}</strong></div>
              <div>Current Valid Until: <strong>{country.currentValidUntil}</strong></div>
              <div>Current Protocol No: <strong>{country.currentProtocol}</strong></div>
              <div>Last Updated: <strong>{country.lastUpdated}</strong> by <strong>{country.lastUpdatedBy}</strong></div>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Active application (if any)</h4>
            {country.newLimit ? (
              <div className="mt-2 space-y-2">
                <div>Old Limit: <strong>{country.oldLimit}</strong></div>
                <div>New Limit: <strong>{country.newLimit}</strong></div>
                <div>Old Valid Until: <strong>{country.oldValidUntil}</strong></div>
                <div>New Valid Until: <strong>{country.newValidUntil}</strong></div>
                <div>Old Protocol: <strong>{country.oldProtocol}</strong></div>
                <div>New Protocol: <strong>{country.newProtocol}</strong></div>
                <div>Requested By: <strong>{country.requestedBy}</strong></div>
                <div>Requested At: <strong>{country.requestedAt}</strong></div>
                <div>Status: <strong>{country.status}</strong></div>
              </div>
            ) : (
              <div className="mt-2 text-muted-foreground">No active application</div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium">History</h4>
          {country.history.length === 0 ? (
            <div className="mt-2 text-muted-foreground">No history records</div>
          ) : (
            <div className="overflow-auto mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Changed At</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Old Limit</TableHead>
                    <TableHead>New Limit</TableHead>
                    <TableHead>Old Valid Until</TableHead>
                    <TableHead>New Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {country.history.map((h, idx) => (
                    <TableRow key={idx}>
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
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCountryLimitDialog;
