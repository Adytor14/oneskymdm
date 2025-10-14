import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EntityType } from "@/types/mdm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, FileEdit, TrendingUp, AlertCircle, Clock } from "lucide-react";

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

  const approvedCount = changeRequests.filter(cr => cr.status === "approved").length;
  const pendingCount = changeRequests.filter(cr => cr.status === "pending").length;
  const rejectedCount = changeRequests.filter(cr => cr.status === "rejected").length;

  const metrics = [
    { title: "Total Change Requests", value: changeRequests.length.toString(), icon: FileEdit, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Approved", value: approvedCount.toString(), icon: TrendingUp, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Pending", value: pendingCount.toString(), icon: Clock, bgColor: "bg-orange-50", iconColor: "text-orange-600" },
    { title: "Rejected", value: rejectedCount.toString(), icon: AlertCircle, bgColor: "bg-red-50", iconColor: "text-red-600" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Change Requests</h1>
        <p className="text-muted-foreground mt-1">
          View and manage change requests for all entities
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
          <div className="grid gap-4 md:grid-cols-4">
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
              <Select value={entityType} onValueChange={(value) => setEntityType(value as EntityType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
            <CardTitle className="text-lg">Change Requests - {entityType}</CardTitle>
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted-foreground py-8">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted-foreground py-8">
                      No change requests found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50 cursor-pointer">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeRequestList;
