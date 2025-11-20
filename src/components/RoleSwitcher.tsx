import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type AppRole = "admin" | "data_steward";

export const RoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState<AppRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentRole();
  }, []);

  const fetchCurrentRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // First, clean up any duplicate roles for this user
      const { data: allRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id);

      if (allRoles && allRoles.length > 1) {
        // Keep only the first role, delete others
        const keepRole = allRoles[0];
        const deleteIds = allRoles.slice(1).map(r => r.id);
        
        await supabase
          .from("user_roles")
          .delete()
          .in("id", deleteIds);
        
        setCurrentRole(keepRole.role as AppRole);
      } else if (allRoles && allRoles.length === 1) {
        const role = allRoles[0].role === "user" ? "admin" : allRoles[0].role;
        setCurrentRole(role as AppRole);
      } else {
        // No role exists, assign default "admin" role
        await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "admin" });
        setCurrentRole("admin");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRoleChange = async (newRole: AppRole) => {
    if (!userId) return;

    try {
      // Delete all existing roles for this user
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Insert new role
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      setCurrentRole(newRole);

      // Determine features based on role
      const roleFeatures = {
        admin: {
          title: "Admin Role Activated",
          available: "All features available: Market Analysis, My Data, Data Change Requests, Merge/Match, and Rules Management",
          restricted: null
        },
        data_steward: {
          title: "Data Steward Role Activated",
          available: "Available: Market Analysis, My Data, and Data Change Requests",
          restricted: "Restricted: Merge/Match and Rules Management"
        }
      };

      const features = roleFeatures[newRole];

      toast({
        title: features.title,
        description: (
          <div className="space-y-2 mt-2">
            <div className="text-sm">
              <span className="font-semibold text-green-600">✓ {features.available}</span>
            </div>
            {features.restricted && (
              <div className="text-sm">
                <span className="font-semibold text-red-600">✗ {features.restricted}</span>
              </div>
            )}
          </div>
        ),
        duration: 5000,
      });

      // Refresh the page to update permissions
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  if (!currentRole) return (
    <div className="flex items-center gap-2">
      <Select disabled>
        <SelectTrigger className="w-[160px] bg-background border-border">
          <SelectValue placeholder="Loading role..." />
        </SelectTrigger>
      </Select>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Role:</span>
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[160px] bg-background border-border hover:bg-accent hover:text-accent-foreground">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="data_steward">Data Steward</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
