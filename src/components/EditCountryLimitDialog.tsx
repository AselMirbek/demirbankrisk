// components/EditCountryLimitDialog.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountryRecord, PendingBlock } from "./CountryLimits";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: CountryRecord | null;
  onSave: (payload: { code: string; pending: PendingBlock }) => void;
  currentUserLogin?: string;
};

const EditCountryLimitDialog: React.FC<Props> = ({ open, onOpenChange, country, onSave, currentUserLogin = "maker_user" }) => {
  const [newLimit, setNewLimit] = useState("");
  const [newValidUntil, setNewValidUntil] = useState("");
  const [newProtocol, setNewProtocol] = useState("");

  useEffect(() => {
    if (country) {
      // if already has pending, prefill with pending values so maker can modify existing request
      if (country.pending) {
        setNewLimit(country.pending.newLimit ?? country.currentLimit);
        setNewValidUntil(country.pending.newValidUntil ?? country.currentValidUntil);
        setNewProtocol(country.pending.newProtocol ?? country.currentProtocol);
      } else {
        setNewLimit(country.currentLimit);
        setNewValidUntil(country.currentValidUntil);
        setNewProtocol(country.currentProtocol);
      }
    } else {
      setNewLimit("");
      setNewValidUntil("");
      setNewProtocol("");
    }
  }, [country, open]);

  if (!country) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const pending: PendingBlock = {
      oldLimit: country.currentLimit,
      newLimit,
      oldValidUntil: country.currentValidUntil,
      newValidUntil: newValidUntil || country.currentValidUntil,
      oldProtocol: country.currentProtocol,
      newProtocol,
      requestedBy: currentUserLogin,
      requestedAt: now,
      status: "PendingMaker",
    };

    onSave({ code: country.code, pending });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{country ? `Edit / Request — ${country.name}` : "Edit Country Limit"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <Label>Code</Label>
            <Input disabled value={country.code} />
          </div>

          <div>
            <Label>Country</Label>
            <Input disabled value={country.name} />
          </div>

          <div>
            <Label>Balance</Label>
            <Input disabled value={country.balance} />
          </div>

          <div>
            <Label>Landing</Label>
            <Input disabled value={country.landing} />
          </div>

          <div>
            <Label>Old Limit</Label>
            <Input disabled value={country.currentLimit} />
          </div>

          <div>
            <Label>Old Valid Until</Label>
            <Input disabled value={country.currentValidUntil} />
          </div>

          <div>
            <Label>Old Protocol</Label>
            <Input disabled value={country.currentProtocol} />
          </div>

          <div>
            <Label>Last Updated</Label>
            <Input disabled value={country.lastUpdated} />
          </div>

          {/* editable */}
          <div>
            <Label>New Limit</Label>
            <Input value={newLimit} onChange={(e) => setNewLimit(e.target.value)} />
          </div>

          <div>
            <Label>New Valid Until</Label>
            <Input type="date" value={newValidUntil} onChange={(e) => setNewValidUntil(e.target.value)} />
          </div>

          <div>
            <Label>New Protocol No</Label>
            <Input value={newProtocol} onChange={(e) => setNewProtocol(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-success text-white">Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCountryLimitDialog;
