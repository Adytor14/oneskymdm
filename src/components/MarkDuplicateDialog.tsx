import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Search, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mockHCPs } from "@/lib/mockData";
import { HCPProfile } from "@/types/mdm";

interface MarkDuplicateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicate: HCPProfile;
  onSubmitted?: () => void;
}

const summarize = (hcp: HCPProfile) => ({
  mdmId: hcp.mdmId,
  name: `${hcp.firstName} ${hcp.lastName}`,
  npiId: hcp.npiId,
  status: hcp.status,
  email: hcp.email,
  phone: hcp.phone,
  speciality: hcp.speciality?.join(", "),
  organization: hcp.organization || "",
  address: `${hcp.address.street}, ${hcp.address.city}, ${hcp.address.state} ${hcp.address.zipCode}`,
});

export const MarkDuplicateDialog = ({ open, onOpenChange, duplicate, onSubmitted }: MarkDuplicateDialogProps) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const candidates = useMemo(() => {
    const term = search.trim().toLowerCase();
    return mockHCPs
      .filter((h) => h.id !== duplicate.id)
      .filter((h) => {
        if (!term) return true;
        return (
          `${h.firstName} ${h.lastName}`.toLowerCase().includes(term) ||
          h.npiId?.toLowerCase().includes(term) ||
          h.mdmId?.toLowerCase().includes(term) ||
          h.address.city?.toLowerCase().includes(term) ||
          (h.organization || "").toLowerCase().includes(term)
        );
      })
      .slice(0, 25);
  }, [search, duplicate.id]);

  const selected = mockHCPs.find((h) => h.id === selectedId);

  const reset = () => {
    setSearch("");
    setSelectedId(null);
    setReason("");
  };

  const handleSubmit = async () => {
    if (!selected) {
      toast({ title: "Select original record", description: "Search and select the original record to link.", variant: "destructive" });
      return;
    }
    if (reason.trim().length < 10) {
      toast({ title: "Validation Error", description: "Reason must be at least 10 characters", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({ title: "Authentication Error", description: "You must be logged in to submit a request", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("change_requests").insert({
        entity_type: "HCP",
        entity_id: duplicate.id,
        requested_by: user.id,
        reason: reason.trim(),
        request_type: "mark_duplicate",
        priority: "medium",
        status: "pending",
        requested_changes: {
          action: "mark_duplicate",
          duplicateRecordId: duplicate.id,
          originalRecordId: selected.id,
          duplicate: summarize(duplicate),
          original: summarize(selected),
        },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to submit request: " + error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Submitted for approval", description: "Duplicate request created and is pending approval." });
      reset();
      onOpenChange(false);
      onSubmitted?.();
    } catch (e) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Mark as Duplicate
          </DialogTitle>
          <DialogDescription>
            Search for the original record that{" "}
            <span className="font-medium text-foreground">
              {duplicate.firstName} {duplicate.lastName} ({duplicate.mdmId})
            </span>{" "}
            duplicates, add a reason, and submit for approval as a DCR.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Search original record</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, MDM ID, NPI, city or organization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-56 rounded-md border">
            <div className="divide-y">
              {candidates.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No matching records found.</p>
              )}
              {candidates.map((h) => {
                const isSelected = h.id === selectedId;
                return (
                  <button
                    type="button"
                    key={h.id}
                    onClick={() => setSelectedId(h.id)}
                    className={`flex w-full items-start justify-between gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {h.firstName} {h.lastName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {h.mdmId} · NPI {h.npiId} · {h.address.city}, {h.address.state}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline">{h.status}</Badge>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {selected && (
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <span className="text-muted-foreground">Original: </span>
              <span className="font-medium">
                {selected.firstName} {selected.lastName} ({selected.mdmId})
              </span>
              <span className="text-muted-foreground"> · Duplicate: </span>
              <span className="font-medium">
                {duplicate.firstName} {duplicate.lastName} ({duplicate.mdmId})
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label>
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Explain why this record is a duplicate of the selected original record..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
