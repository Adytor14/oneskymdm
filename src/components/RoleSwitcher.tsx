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

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching role:", error);
        return;
      }

      // If no role exists, assign default "admin" role
      if (!data) {
        await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "admin" });
        setCurrentRole("admin");
      } else {
        // Map old "user" role to "admin" if it exists
        const role = data.role === "user" ? "admin" : data.role;
        setCurrentRole(role as AppRole);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRoleChange = async (newRole: AppRole) => {
    if (!userId) return;

    try {
      // Delete existing role
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
      toast({
        title: "Role Updated",
        description: `Your role has been changed to ${newRole.replace('_', ' ')}`,
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
