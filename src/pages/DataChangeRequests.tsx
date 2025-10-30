import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChangeRequest {
  id: string;
  dcr_id: string;
  entity_type: string;
  entity_id: string;
  status: string;
  request_type: string;
  priority: string;
  reason: string;
  requested_changes: any;
  created_at: string;
  updated_at: string;
  requested_by: string;
  approved_by: string | null;
  approved_at: string | null;
}

const DataChangeRequests = () => {
  const navigate = useNavigate();
  const { status } = useParams<{ status: string }>();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [status]);

  const fetchRequests = async () => {
    if (!status) return;
    
    setLoading(true);
    try {
      // Map URL status to database status
      const dbStatus = status === "open" ? "pending" : status;
      
      const { data, error } = await supabase
        .from("change_requests")
        .select("*")
        .eq("status", dbStatus)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching change requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch change requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect to open by default if no status
  if (!status) {
    return <Navigate to="/change-requests/open" replace />;
  }

  // Validate status
  if (!["open", "approved", "rejected"].includes(status)) {
    return <Navigate to="/change-requests/open" replace />;
  }

  const getTitle = () => {
    switch (status) {
      case "open":
        return "Open Requests";
      case "approved":
        return "Approved Requests";
      case "rejected":
        return "Rejected Requests";
      default:
        return "Requests";
    }
  };

  const renderTable = (requests: ChangeRequest[], statusType: string) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }

    if (requests.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-muted-foreground">No {statusType} requests found</p>
        </div>
      );
    }

    return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">DCR ID</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Entity Type</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Entity ID</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Request Type</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Priority</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((record) => (
            <tr
              key={record.id}
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate(`/data-change-requests/${record.id}`)}
            >
              <td className="py-3 px-4">{record.dcr_id || `DCR-${record.id.slice(0, 8)}`}</td>
              <td className="py-3 px-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {record.entity_type}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">{record.entity_id}</td>
              <td className="py-3 px-4 text-sm capitalize">{record.request_type}</td>
              <td className="py-3 px-4">
                <Badge
                  className={
                    record.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : record.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }
                >
                  {record.priority}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={
                    statusType === "open"
                      ? "bg-yellow-100 text-yellow-700"
                      : statusType === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {statusType.charAt(0).toUpperCase() + statusType.slice(1)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">
                {new Date(record.updated_at).toLocaleDateString("en-GB")}
              </td>
              <td className="py-3 px-4">
                <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Change Requests</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTable(requests, status)}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataChangeRequests;
