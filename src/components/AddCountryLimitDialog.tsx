import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AddCountryLimitDialog({ show, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);

  const [country, setCountry] = useState("");
  const [limit, setLimit] = useState("");
  const [protocol, setProtocol] = useState("");

  const handleSave = () => {
    if (!country || !limit || !protocol) return;

    onSave({
      id: Date.now(),
      country,
      limit,
      protocol,
      date: today,
    });

    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Country Limit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Input
            placeholder="Limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <Input
            placeholder="Protocol"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
          />
          <Input value={today} disabled />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
