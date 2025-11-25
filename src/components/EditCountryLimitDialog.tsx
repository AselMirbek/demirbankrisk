// components/EditCountryLimitDialog.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountryRecord } from "./CountryLimits";

const EditCountryLimitDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: CountryRecord | null;
  onSave: (updated: CountryRecord) => void;
  currentUserLogin?: string;
}> = ({ open, onOpenChange, country, onSave, currentUserLogin = "maker_user" }) => {
  const [newLimit, setNewLimit] = useState("");
  const [newValidUntil, setNewValidUntil] = useState("");
  const [newProtocol, setNewProtocol] = useState("");

  useEffect(() => {
    if (country) {
      setNewLimit(country.currentLimit ?? "");
      setNewValidUntil(country.currentValidUntil ?? "");
      setNewProtocol(country.currentProtocol ?? "");
    } else {
      setNewLimit("");
      setNewValidUntil("");
      setNewProtocol("");
    }
  }, [country]);

  if (!country) return null;

  const handleSave = () => {
    const updated: CountryRecord = {
      ...country,
      oldLimit: country.currentLimit,
      newLimit,
      oldValidUntil: country.currentValidUntil,
      newValidUntil,
      oldProtocol: country.currentProtocol,
      newProtocol,
      requestedBy: currentUserLogin,
      requestedAt: new Date().toISOString(),
      status: "PendingMaker",
    };
    onSave(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit / Create Request — {country.name}</DialogTitle>
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
            <Input value={newValidUntil} onChange={(e) => setNewValidUntil(e.target.value)} />
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
