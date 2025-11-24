import { useState } from "react";
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

interface AddCountryLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (country: any) => void;
}

const AddCountryLimitDialog = ({
  open,
  onOpenChange,
  onSave,
}: AddCountryLimitDialogProps) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    limit: "",
    validUntil: "",
    protocolNo: "",
  });

  const handleSave = () => {
    if (!formData.code || !formData.name || !formData.limit) return;

    const newEntry = {
      ...formData,
      balance: "0",
      landing: "0",
      overlimit: "0",
      limitExceeded: "No",
      lastUpdated: today,
      lastUpdatedBy: "risk_user",
    };

    onSave(newEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Country Limit</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              placeholder="GB"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Country Name</Label>
            <Input
              id="name"
              placeholder="Great Britain"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Limit</Label>
            <Input
              id="limit"
              type="number"
              placeholder="500000"
              value={formData.limit}
              onChange={(e) =>
                setFormData({ ...formData, limit: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) =>
                setFormData({ ...formData, validUntil: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="protocolNo">Protocol No</Label>
            <Input
              id="protocolNo"
              placeholder="BD-150/2025"
              value={formData.protocolNo}
              onChange={(e) =>
                setFormData({ ...formData, protocolNo: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Last Updated</Label>
            <Input value={today} disabled />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-success hover:bg-success/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCountryLimitDialog;
