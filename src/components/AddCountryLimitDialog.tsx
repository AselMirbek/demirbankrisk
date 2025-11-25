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

const countryOptions = [
  { code: "TR", name: "Turkey" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KG", name: "Kyrgyzstan" },
];

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

  const selectCountry = (e: any) => {
    const found = countryOptions.find((c) => c.code === e.target.value);

    setFormData({
      ...formData,
      code: found?.code || "",
      name: found?.name || "",
    });
  };

  const handleSendRequest = () => {
    if (!formData.code || !formData.limit) return;

    const newEntry = {
      ...formData,
      balance: "0",
      landing: "0",
      overlimit: "0",
      limitExceeded: "No",
      lastUpdated: today,
      lastUpdatedBy: "risk_user",
      status: "Pending",        // <-- заявка
      pending: {
        oldLimit: "0",
        newLimit: formData.limit,
        oldProtocol: "",
        newProtocol: formData.protocolNo,
        oldValidUntil: "",
        newValidUntil: formData.validUntil,
      },
      history: [],
    };

    onSave(newEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New Country Limit Request</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">

          {/* ---- SELECT COUNTRY ---- */}
          <div className="space-y-2 col-span-2">
            <Label>Select Country</Label>
            <select
              className="border rounded-md p-2 w-full bg-background"
              onChange={selectCountry}
            >
              <option value="">Choose...</option>
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} — {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Autofilled Code */}
          <div className="space-y-2">
            <Label>Country Code</Label>
            <Input value={formData.code} disabled />
          </div>

          {/* Autofilled Name */}
          <div className="space-y-2">
            <Label>Country Name</Label>
            <Input value={formData.name} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">New Limit</Label>
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
            <Label htmlFor="protocolNo">New Protocol No</Label>
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
            <Label>Request Date</Label>
            <Input value={today} disabled />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          {/* 🔥 Button for sending request */}
          <Button
            onClick={handleSendRequest}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCountryLimitDialog;
