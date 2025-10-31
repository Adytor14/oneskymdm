import { Building2, User, FileText, LayoutDashboard, LogOut, FileEdit, CheckSquare, Layers, GitMerge, ClipboardList, TrendingUp, ChevronDown } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const marketAnalysisItems = [
  { title: "Highlights", url: "/", icon: LayoutDashboard },
  { title: "Top Agencies", url: "/top-agencies", icon: TrendingUp },
  { title: "Physician Accounts", url: "/market-analysis/hcp", icon: User },
  { title: "Facility Accounts", url: "/market-analysis/hco", icon: Building2 },
];

const myDataItems = [
  { title: "Physician Accounts", url: "/hcp", icon: User },
  { title: "Facility Accounts", url: "/hco", icon: Building2 },
];

const dcrSubItems = [
  { title: "Open", url: "/change-requests/open" },
  { title: "Approved", url: "/change-requests/approved" },
  { title: "Rejected", url: "/change-requests/rejected" },
];

const adminItems = [
  { title: "Rules Management", url: "/rules", icon: Layers },
  { title: "Merge/Match Approval", url: "/merge-match-approval", icon: GitMerge },
  { title: "Data Change Requests", url: "/data-change-requests", icon: ClipboardList },
  { title: "Approval Requests", url: "/admin/approvals", icon: CheckSquare },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dcrOpen, setDcrOpen] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });

      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-3 py-4">
          <h2
            className={`font-semibold text-sidebar-foreground transition-all ${open ? "text-lg" : "text-xs text-center"}`}
          >
            {open ? "OneSky" : "MDM"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Market Analysis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketAnalysisItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) => (isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "")}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>My Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => (isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "")}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={dcrOpen} onOpenChange={setDcrOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <FileEdit className="h-4 w-4" />
                      <span>Data Change Requests</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {dcrSubItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={item.url}
                              className={({ isActive }) => (isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "")}
                            >
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
