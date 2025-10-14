import { useState, useEffect } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { EntityType } from "@/types/mdm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
}

const ChangeRequestList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [entityType, setEntityType] = useState<EntityType>("HCP");
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChangeRequests();
  }, [entityType]);

  const fetchChangeRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("change_requests")
        .select("*")
        .eq("entity_type", entityType)
        .order("created_at", { ascending: false });

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
        return "bg-success text-success-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-primary text-primary-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Change Requests</h1>
        <p className="text-muted-foreground mt-2">
          View and manage change requests for all entities
        </p>
      </div>

      <FilterPanel
        entityType={entityType}
        onEntityTypeChange={(type) => setEntityType(type as EntityType)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={selectedStatus}
        onStatusFilterChange={setSelectedStatus}
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Change Requests - {entityType}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No change requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((request) => (
                    <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{request.id.slice(0, 8)}</TableCell>
                      <TableCell>{request.entity_type}</TableCell>
                      <TableCell>{request.entity_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {request.request_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at), "MMM dd, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeRequestList;
