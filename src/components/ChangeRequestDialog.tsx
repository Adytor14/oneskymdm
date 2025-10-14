import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileEdit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }).max(500, {
    message: "Reason must not exceed 500 characters.",
  }),
  requestedChanges: z.string().min(10, {
    message: "Requested changes must be at least 10 characters.",
  }).max(1000, {
    message: "Requested changes must not exceed 1000 characters.",
  }),
});

interface ChangeRequestDialogProps {
  dcrId: string;
  dcrData?: any;
}

export function ChangeRequestDialog({ dcrId, dcrData }: ChangeRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      requestedChanges: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to submit a change request.",
          variant: "destructive",
        });
        return;
      }

      // Check if user has data_steward or admin role
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesError) {
        console.error("Error checking roles:", rolesError);
        toast({
          title: "Error",
          description: "Failed to verify user permissions.",
          variant: "destructive",
        });
        return;
      }

      const hasPermission = roles?.some(
        (r) => r.role === "data_steward" || r.role === "admin"
      );

      if (!hasPermission) {
        toast({
          title: "Permission denied",
          description: "You must be a Data Steward or Admin to submit change requests.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("change_requests").insert({
        dcr_id: dcrId,
        requested_by: user.id,
        reason: values.reason,
        requested_changes: {
          changes: values.requestedChanges,
          originalData: dcrData || {},
        },
        status: "pending",
      });

      if (error) {
        console.error("Error submitting change request:", error);
        toast({
          title: "Error",
          description: "Failed to submit change request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Change request submitted for approval.",
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting change request:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
          <DialogTitle>Request DCR Change</DialogTitle>
          <DialogDescription>
            Submit a change request for this Doctor Call Report. An admin will review and approve your request.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this change is needed..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear reason for requesting this change.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestedChanges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Changes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the changes you want to make..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe in detail what changes should be made.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}