import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityType } from "@/types/mdm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, FileEdit, TrendingUp, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ChangeRequest {
  id: string;
  entity_type: string;
  entity_id: string;
  request_type: string;
  priority: string;
  status: string;
  reason: string;
  created_at: string;
  requested_by: string;
  requested_changes: any;
}

const AdminApprovalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [entityType, setEntityType] = useState<EntityType | "all">("all");
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchChangeRequests();
    }
  }, [isAdmin, entityType]);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .rpc("has_role", { _user_id: user.id, _role: "admin" });

      if (error) throw error;

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to verify admin status",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchChangeRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("change_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (entityType !== "all") {
        query = query.eq("entity_type", entityType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setChangeRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch change requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ChangeRequest) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("change_requests")
        .update({
          status: "approved",
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Change request approved successfully",
      });

      fetchChangeRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve change request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("change_requests")
        .update({
          status: "rejected",
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          reason: rejectionReason,
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Change request rejected",
      });

      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedRequest(null);
      fetchChangeRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reject change request",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const filteredData = changeRequests.filter((item) => {
    const matchesSearch =
      item.entity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600 text-white hover:bg-green-700";
      case "rejected":
        return "bg-red-600 text-white hover:bg-red-700";
      case "pending":
        return "bg-orange-600 text-white hover:bg-orange-700";
      default:
        return "bg-gray-400 text-white hover:bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "low":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Checking permissions...</div>;
  }

  const approvedCount = changeRequests.filter(cr => cr.status === "approved").length;
  const pendingCount = changeRequests.filter(cr => cr.status === "pending").length;
  const rejectedCount = changeRequests.filter(cr => cr.status === "rejected").length;

  const metrics = [
    { title: "Total Requests", value: changeRequests.length.toString(), icon: FileEdit, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Approved", value: approvedCount.toString(), icon: TrendingUp, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Pending", value: pendingCount.toString(), icon: Clock, bgColor: "bg-orange-50", iconColor: "text-orange-600" },
    { title: "Rejected", value: rejectedCount.toString(), icon: AlertCircle, bgColor: "bg-red-50", iconColor: "text-red-600" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Approval Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve or reject change requests
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className={metric.bgColor}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${metric.iconColor}`}>{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by ID or entity..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entity Type</label>
              <Select value={entityType} onValueChange={(value) => setEntityType(value as EntityType | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="HCP">HCP</SelectItem>
                  <SelectItem value="HCO">HCO</SelectItem>
                  <SelectItem value="Address">Address</SelectItem>
                  <SelectItem value="DCR">DCR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Approval Requests</CardTitle>
            <p className="text-sm text-muted-foreground">Showing {filteredData.length} of {changeRequests.length} records</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Request ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Entity Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Entity ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Request Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Request Date</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted-foreground py-8">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted-foreground py-8">
                      No change requests found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{request.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{request.entity_type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{request.entity_id}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {request.request_type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {format(new Date(request.created_at), "dd/MM/yyyy")}
                      </td>
                      <td className="py-3 px-4">
                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(request)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Change Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this change request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovalDashboard;
