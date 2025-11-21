import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CountryLimit {
  code: string;
  name: string;
  balance: string;
  landing: string;
  limit: string;
  overlimit: string;
  limitExceeded: string;
  validUntil: string;
  protocolNo: string;
  lastUpdated: string;
  lastUpdatedBy: string;
}

interface EditCountryLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: CountryLimit | null;
  onSave: (country: CountryLimit) => void;
}

const EditCountryLimitDialog = ({ open, onOpenChange, country, onSave }: EditCountryLimitDialogProps) => {
  const [formData, setFormData] = useState<CountryLimit>({
    code: "",
    name: "",
    balance: "",
    landing: "",
    limit: "",
    overlimit: "",
    limitExceeded: "",
    validUntil: "",
    protocolNo: "",
    lastUpdated: "",
    lastUpdatedBy: "",
  });

  useEffect(() => {
    if (country) {
      setFormData({
        ...country,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    }
  }, [country]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Country Limit</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Country</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landing">Landing</Label>
            <Input
              id="landing"
              value={formData.landing}
              onChange={(e) => setFormData({ ...formData, landing: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Limit</Label>
            <Input
              id="limit"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overlimit">Overlimit</Label>
            <Input
              id="overlimit"
              value={formData.overlimit}
              onChange={(e) => setFormData({ ...formData, overlimit: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limitExceeded">Limit Exceeded</Label>
            <Input
              id="limitExceeded"
              value={formData.limitExceeded}
              onChange={(e) => setFormData({ ...formData, limitExceeded: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="protocolNo">Protocol No</Label>
            <Input
              id="protocolNo"
              value={formData.protocolNo}
              onChange={(e) => setFormData({ ...formData, protocolNo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastUpdated">Last Updated</Label>
            <Input
              id="lastUpdated"
              type="date"
              value={formData.lastUpdated}
              onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="bg-success hover:bg-success/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCountryLimitDialog;
