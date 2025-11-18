import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [selectedTimeline, setSelectedTimeline] = useState<ChangeRequest | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const getDCRTypeName = (entityType: string, requestType: string) => {
    const type = requestType.toLowerCase();
    const entity = entityType.toLowerCase();
    
    if (entity === 'hcp' || entity === 'physician') {
      if (type.includes('name') || type.includes('first')) return 'First Name Change - Physician';
      if (type.includes('last')) return 'Last Name Change - Physician';
      if (type.includes('address')) return 'Update Address - Physician';
      if (type.includes('zip')) return 'Update ZIP - Physician';
      if (type.includes('phone')) return 'Phone Update - Physician';
      if (type.includes('email')) return 'Email Update - Physician';
      return 'Update - Physician';
    } else if (entity === 'hco' || entity === 'facility') {
      if (type.includes('name')) return 'Name Change - Facility';
      if (type.includes('address')) return 'Update Address - Facility';
      if (type.includes('zip')) return 'Update ZIP - Facility';
      if (type.includes('phone')) return 'Phone Update - Facility';
      if (type.includes('email')) return 'Email Update - Facility';
      return 'Update - Facility';
    } else if (entity === 'address') {
      if (type.includes('zip')) return 'Update ZIP';
      return 'Update Address';
    }
    return requestType;
  };

  const formatPriority = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === 'high') return 'High';
    if (p === 'medium') return 'Medium';
    if (p === 'low') return 'Low';
    return priority;
  };

  const handleViewTimeline = (e: React.MouseEvent, request: ChangeRequest) => {
    e.stopPropagation();
    setSelectedTimeline(request);
    setIsTimelineOpen(true);
  };

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
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">DCR Type</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Date Open</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Days Open</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Priority</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Requested by</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View Timeline</th>
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
              <td className="py-3 px-4 text-sm">
                {getDCRTypeName(record.entity_type, record.request_type)}
              </td>
              <td className="py-3 px-4 text-sm">
                {new Date(record.created_at).toLocaleDateString("en-GB")}
              </td>
              <td className="py-3 px-4 text-sm">
                {Math.floor((new Date().getTime() - new Date(record.created_at).getTime()) / (1000 * 60 * 60 * 24))}
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={
                    record.priority.toLowerCase() === "high"
                      ? "bg-red-100 text-red-700"
                      : record.priority.toLowerCase() === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }
                >
                  {formatPriority(record.priority)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">
                {record.requested_by || 'N/A'}
              </td>
              <td className="py-3 px-4 text-sm">
                {new Date(record.updated_at).toLocaleDateString("en-GB")}
              </td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleViewTimeline(e, record)}
                  className="h-8 w-8 p-0"
                >
                  <Clock className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
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

      <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>DCR Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTimeline && (
              <>
                <div className="border-l-2 border-primary pl-4 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[1.3rem] top-0 w-4 h-4 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">Request Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedTimeline.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">By: {selectedTimeline.requested_by || 'Unknown'}</p>
                      <p className="text-sm">Reason: {selectedTimeline.reason}</p>
                    </div>
                  </div>

                  {selectedTimeline.updated_at !== selectedTimeline.created_at && (
                    <div className="relative">
                      <div className="absolute -left-[1.3rem] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Request Updated</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedTimeline.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTimeline.approved_at && (
                    <div className="relative">
                      <div className="absolute -left-[1.3rem] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Request Approved</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedTimeline.approved_at).toLocaleString()}
                        </p>
                        <p className="text-sm mt-1">By: {selectedTimeline.approved_by || 'Unknown'}</p>
                      </div>
                    </div>
                  )}

                  {selectedTimeline.status === 'rejected' && (
                    <div className="relative">
                      <div className="absolute -left-[1.3rem] top-0 w-4 h-4 rounded-full bg-red-500"></div>
                      <div>
                        <p className="font-medium">Request Rejected</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedTimeline.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataChangeRequests;
