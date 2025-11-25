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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CountryRecord } from "./CountryLimits";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: CountryRecord | null;
};

const ViewCountryLimitDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  country,
}) => {
  if (!country) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            Country Details — {country.name} ({country.code})
          </DialogTitle>
        </DialogHeader>

        {/* ========================== CURRENT LIVE TABLE ========================== */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Current (Live)</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>{country.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Country</TableCell>
                <TableCell>{country.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Balance</TableCell>
                <TableCell>{country.balance}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Landing</TableCell>
                <TableCell>{country.landing}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Current Limit</TableCell>
                <TableCell className="font-medium">{country.currentLimit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Valid Until</TableCell>
                <TableCell>{country.currentValidUntil}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Protocol No</TableCell>
                <TableCell>{country.currentProtocol}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Updated</TableCell>
                <TableCell>
                  {country.lastUpdated} by {country.lastUpdatedBy}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* ========================== ACTIVE REQUEST ========================== */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Active Request (Pending)</h3>

          {country.pending ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell>Old Limit</TableCell>
                  <TableCell>{country.pending.oldLimit}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>New Limit</TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {country.pending.newLimit}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Old Valid Until</TableCell>
                  <TableCell>{country.pending.oldValidUntil}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>New Valid Until</TableCell>
                  <TableCell>{country.pending.newValidUntil}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Old Protocol</TableCell>
                  <TableCell>{country.pending.oldProtocol}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>New Protocol</TableCell>
                  <TableCell>{country.pending.newProtocol}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Requested By</TableCell>
                  <TableCell>{country.pending.requestedBy}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Requested At</TableCell>
                  <TableCell>{country.pending.requestedAt}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell className="font-semibold">
                    {country.pending.status}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No active request.</p>
          )}
        </div>

        {/* ========================== HISTORY ========================== */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">History</h3>

          {country.history.length === 0 ? (
            <p className="text-muted-foreground">No history records</p>
          ) : (
            <div className="overflow-auto border rounded-md">
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
                  {country.history.map((h, i) => (
                    <TableRow key={i}>
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

