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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { EntityType, HCPProfile, HCOProfile, Address, DCRProfile } from "@/types/mdm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const changeRequestSchema = z.object({
  reason: z.string().trim().min(10, "Reason must be at least 10 characters").max(1000, "Reason must be less than 1000 characters"),
  requestedChanges: z.string().trim().min(1, "Please describe the changes you want to make"),
  requestType: z.enum(["update_address", "update_status", "update_contact"]),
});

interface ChangeRequestDialogProps {
  entityType: EntityType;
  entityId: string;
  entityData?: HCPProfile | HCOProfile | Address | DCRProfile;
}

export const ChangeRequestDialog = ({ entityType, entityId, entityData }: ChangeRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [requestType, setRequestType] = useState<"update_address" | "update_status" | "update_contact">("update_address");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldChanges, setFieldChanges] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const getEntityTypeLabel = (type: EntityType) => {
    switch (type) {
      case "HCP":
        return "Physician Account";
      case "HCO":
        return "Facility Account";
      default:
        return type;
    }
  };

  // Initialize field changes with entity data
  const initializeFieldChanges = () => {
    if (!entityData) return {};
    const changes: Record<string, any> = {};
    
    switch (entityType) {
      case "HCP":
        const hcp = entityData as HCPProfile;
        // Only include editable fields: Address, Status, and Contact
        changes.street = hcp.address.street;
        changes.city = hcp.address.city;
        changes.state = hcp.address.state;
        changes.zipCode = hcp.address.zipCode;
        changes.country = hcp.address.country;
        changes.status = hcp.status;
        changes.email = hcp.email;
        changes.phone = hcp.phone;
        break;
      case "HCO":
        const hco = entityData as HCOProfile;
        changes.name = hco.name;
        changes.npiId = hco.npiId;
        changes.organizationType = hco.organizationType;
        changes.email = hco.email;
        changes.phone = hco.phone;
        changes.departments = hco.departments.join(", ");
        changes.street = hco.address.street;
        changes.city = hco.address.city;
        changes.state = hco.address.state;
        changes.zipCode = hco.address.zipCode;
        changes.country = hco.address.country;
        break;
      case "Address":
        const addr = entityData as Address;
        changes.street = addr.street;
        changes.city = addr.city;
        changes.state = addr.state;
        changes.zipCode = addr.zipCode;
        changes.country = addr.country;
        changes.addressType = addr.addressType;
        changes.verified = addr.verified;
        break;
      case "DCR":
        const dcr = entityData as DCRProfile;
        changes.callDate = dcr.callDate;
        changes.hcpName = dcr.hcpName;
        changes.hcoName = dcr.hcoName;
        changes.representativeName = dcr.representativeName;
        changes.callDuration = dcr.callDuration.toString();
        changes.callType = dcr.callType;
        changes.productsDiscussed = dcr.productsDiscussed.join(", ");
        changes.samplesProvided = dcr.samplesProvided.join(", ");
        changes.nextFollowUp = dcr.nextFollowUp;
        changes.notes = dcr.notes;
        break;
    }
    return changes;
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setFieldChanges(initializeFieldChanges());
      setReason("");
      setRequestType("update_address");
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFieldChanges(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate input
      if (!reason.trim() || reason.length < 10) {
        toast({
          title: "Validation Error",
          description: "Reason must be at least 10 characters",
          variant: "destructive",
        });
        return;
      }

      if (Object.keys(fieldChanges).length === 0) {
        toast({
          title: "Validation Error",
          description: "Please make at least one change",
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

      // Submit change request
      const { error: insertError } = await supabase
        .from("change_requests")
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          requested_by: user.id,
          reason: reason,
          requested_changes: fieldChanges,
          request_type: requestType,
          priority: "medium",
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
        description: "Data change request submitted successfully and is pending approval",
      });

      // Reset form and close dialog
      setReason("");
      setFieldChanges({});
      setRequestType("update_address");
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

  const renderEntityFields = () => {
    switch (entityType) {
      case "HCP":
        return (
          <>
            {/* Status Field */}
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={fieldChanges.status || ""} onValueChange={(value) => handleFieldChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            <h4 className="font-semibold">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={fieldChanges.email || ""} onChange={(e) => handleFieldChange("email", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={fieldChanges.phone || ""} onChange={(e) => handleFieldChange("phone", e.target.value)} />
              </div>
            </div>
            
            <Separator />
            <h4 className="font-semibold">Address</h4>
            <div className="grid gap-2">
              <Label>Street</Label>
              <Input value={fieldChanges.street || ""} onChange={(e) => handleFieldChange("street", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input value={fieldChanges.city || ""} onChange={(e) => handleFieldChange("city", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Input value={fieldChanges.state || ""} onChange={(e) => handleFieldChange("state", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>ZIP Code</Label>
                <Input value={fieldChanges.zipCode || ""} onChange={(e) => handleFieldChange("zipCode", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Country</Label>
              <Input value={fieldChanges.country || ""} onChange={(e) => handleFieldChange("country", e.target.value)} />
            </div>
          </>
        );
      case "HCO":
        return (
          <>
            <div className="grid gap-2">
              <Label>Organization Name</Label>
              <Input value={fieldChanges.name || ""} onChange={(e) => handleFieldChange("name", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>NPI ID</Label>
                <Input value={fieldChanges.npiId || ""} onChange={(e) => handleFieldChange("npiId", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Organization Type</Label>
                <Input value={fieldChanges.organizationType || ""} onChange={(e) => handleFieldChange("organizationType", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={fieldChanges.email || ""} onChange={(e) => handleFieldChange("email", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={fieldChanges.phone || ""} onChange={(e) => handleFieldChange("phone", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Departments (comma-separated)</Label>
              <Input value={fieldChanges.departments || ""} onChange={(e) => handleFieldChange("departments", e.target.value)} />
            </div>
            <Separator />
            <h4 className="font-semibold">Address</h4>
            <div className="grid gap-2">
              <Label>Street</Label>
              <Input value={fieldChanges.street || ""} onChange={(e) => handleFieldChange("street", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input value={fieldChanges.city || ""} onChange={(e) => handleFieldChange("city", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Input value={fieldChanges.state || ""} onChange={(e) => handleFieldChange("state", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>ZIP Code</Label>
                <Input value={fieldChanges.zipCode || ""} onChange={(e) => handleFieldChange("zipCode", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Country</Label>
              <Input value={fieldChanges.country || ""} onChange={(e) => handleFieldChange("country", e.target.value)} />
            </div>
          </>
        );
      case "Address":
        return (
          <>
            <div className="grid gap-2">
              <Label>Street</Label>
              <Input value={fieldChanges.street || ""} onChange={(e) => handleFieldChange("street", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input value={fieldChanges.city || ""} onChange={(e) => handleFieldChange("city", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Input value={fieldChanges.state || ""} onChange={(e) => handleFieldChange("state", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>ZIP Code</Label>
                <Input value={fieldChanges.zipCode || ""} onChange={(e) => handleFieldChange("zipCode", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Country</Label>
              <Input value={fieldChanges.country || ""} onChange={(e) => handleFieldChange("country", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Address Type</Label>
              <Select value={fieldChanges.addressType || ""} onValueChange={(value) => handleFieldChange("addressType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="verified" 
                checked={fieldChanges.verified || false}
                onCheckedChange={(checked) => handleFieldChange("verified", checked)}
              />
              <Label htmlFor="verified" className="cursor-pointer">Verified</Label>
            </div>
          </>
        );
      case "DCR":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Call Date</Label>
                <Input type="date" value={fieldChanges.callDate || ""} onChange={(e) => handleFieldChange("callDate", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Call Type</Label>
                <Input value={fieldChanges.callType || ""} onChange={(e) => handleFieldChange("callType", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>HCP Name</Label>
              <Input value={fieldChanges.hcpName || ""} onChange={(e) => handleFieldChange("hcpName", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>HCO Name</Label>
              <Input value={fieldChanges.hcoName || ""} onChange={(e) => handleFieldChange("hcoName", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Representative Name</Label>
              <Input value={fieldChanges.representativeName || ""} onChange={(e) => handleFieldChange("representativeName", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Call Duration (minutes)</Label>
              <Input type="number" value={fieldChanges.callDuration || ""} onChange={(e) => handleFieldChange("callDuration", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Products Discussed (comma-separated)</Label>
              <Input value={fieldChanges.productsDiscussed || ""} onChange={(e) => handleFieldChange("productsDiscussed", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Samples Provided (comma-separated)</Label>
              <Input value={fieldChanges.samplesProvided || ""} onChange={(e) => handleFieldChange("samplesProvided", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Next Follow-Up</Label>
              <Input type="date" value={fieldChanges.nextFollowUp || ""} onChange={(e) => handleFieldChange("nextFollowUp", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea 
                value={fieldChanges.notes || ""} 
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileEdit className="h-4 w-4 mr-2" />
          Request Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Submit Data Change Request</DialogTitle>
          <DialogDescription>
            Request changes to {getEntityTypeLabel(entityType)} record. Your request will be sent for approval.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Request Type *</Label>
              <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update_address">Update Address</SelectItem>
                  <SelectItem value="update_status">Update Status</SelectItem>
                  <SelectItem value="update_contact">Update Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            <h3 className="font-semibold text-lg">Editable Fields</h3>
            
            {renderEntityFields()}
            
            <Separator />
            <div className="grid gap-2">
              <Label>Reason for Change *</Label>
              <Textarea
                placeholder="Explain why this change is needed..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {reason.length}/1000 characters
              </p>
            </div>
          </div>
        </ScrollArea>
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
