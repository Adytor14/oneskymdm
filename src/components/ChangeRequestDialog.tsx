import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const changeRequestSchema = z.object({
  reason: z.string().trim().min(10, "Reason must be at least 10 characters").max(1000, "Reason must be less than 1000 characters"),
  requestedChanges: z.string().trim().min(1, "Please describe the changes you want to make"),
});

interface ChangeRequestDialogProps {
  dcrId: string;
}

export const ChangeRequestDialog = ({ dcrId }: ChangeRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [requestedChanges, setRequestedChanges] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      // Validate input
      const validation = changeRequestSchema.safeParse({
        reason,
        requestedChanges,
      });

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit a change request",
          variant: "destructive",
        });
        return;
      }

      // Check if user has data_steward role
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (roleError) {
        toast({
          title: "Error",
          description: "Failed to verify user permissions",
          variant: "destructive",
        });
        return;
      }

      const hasDataStewardRole = roles?.some(
        (r) => r.role === "data_steward" || r.role === "admin"
      );

      if (!hasDataStewardRole) {
        toast({
          title: "Permission Denied",
          description: "Only Data Stewards can submit change requests",
          variant: "destructive",
        });
        return;
      }

      // Submit change request
      const { error: insertError } = await supabase
        .from("change_requests")
        .insert({
          dcr_id: dcrId,
          requested_by: user.id,
          reason: validation.data.reason,
          requested_changes: { description: validation.data.requestedChanges },
          status: "pending",
        });

      if (insertError) {
        toast({
          title: "Error",
          description: "Failed to submit change request: " + insertError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Change request submitted successfully and is pending approval",
      });

      // Reset form and close dialog
      setReason("");
      setRequestedChanges("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileEdit className="h-4 w-4 mr-2" />
          Request Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Submit Change Request</DialogTitle>
          <DialogDescription>
            Request changes to DCR record {dcrId}. Your request will be sent for approval.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="dcr-id">DCR ID</Label>
            <Input id="dcr-id" value={dcrId} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="changes">Requested Changes *</Label>
            <Textarea
              id="changes"
              placeholder="Describe the changes you want to make..."
              value={requestedChanges}
              onChange={(e) => setRequestedChanges(e.target.value)}
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {requestedChanges.length}/1000 characters
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Change *</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this change is needed..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/1000 characters
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
