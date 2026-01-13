import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CalendarIcon, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  
  // Filter states
  const [selectedDCRType, setSelectedDCRType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedRequestedBy, setSelectedRequestedBy] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  // Sort states
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getDCRTypeName = (entityType: string, requestType: string) => {
    const type = requestType.toLowerCase();
    
    // Map to only the three allowed DCR types
    if (type.includes('address')) return 'Update Address';
    if (type.includes('status')) return 'Update Status';
    if (type.includes('contact')) return 'Update Contact';
    
    // Default fallback based on common patterns
    return 'Update Status';
  };

  const formatPriority = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === 'high' || p === 'urgent') return 'High';
    if (p === 'medium') return 'Medium';
    if (p === 'low') return 'Low';
    return 'Medium'; // Default to Medium for any unexpected values
  };

  const getRequestedByName = (requestedBy: string) => {
    // For now, extract a readable name from the user ID
    // This should ideally fetch from a profiles table
    if (!requestedBy) return 'N/A';
    
    // If it's a UUID, format it nicely or return a placeholder
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(requestedBy)) {
      // Return first 8 characters as User ID for now
      return `User-${requestedBy.slice(0, 8)}`;
    }
    
    // Otherwise, return the value as-is (might already be a name)
    return requestedBy;
  };

  const handleViewTimeline = (e: React.MouseEvent, request: ChangeRequest) => {
    e.stopPropagation();
    setSelectedTimeline(request);
    setIsTimelineOpen(true);
  };

  const clearFilters = () => {
    setSelectedDCRType("all");
    setSelectedPriority("all");
    setSelectedRequestedBy("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = selectedDCRType !== "all" || selectedPriority !== "all" || selectedRequestedBy !== "all" || dateFrom !== undefined || dateTo !== undefined;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1 inline" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 inline" />
    );
  };

  // Fixed DCR Types
  const dcrTypes = ["Update Address", "Update Status", "Update Contact"];
  const uniqueRequestedBy = Array.from(new Set(requests.map(r => r.requested_by).filter(Boolean)));

  // Apply filters to requests
  const filteredRequests = requests.filter(request => {
    const dcrType = getDCRTypeName(request.entity_type, request.request_type);
    const matchesDCRType = selectedDCRType === "all" || dcrType === selectedDCRType;
    const matchesPriority = selectedPriority === "all" || request.priority.toLowerCase() === selectedPriority.toLowerCase();
    const matchesRequestedBy = selectedRequestedBy === "all" || request.requested_by === selectedRequestedBy;
    
    const requestDate = new Date(request.created_at);
    const matchesDateFrom = !dateFrom || requestDate >= dateFrom;
    const matchesDateTo = !dateTo || requestDate <= dateTo;
    
    return matchesDCRType && matchesPriority && matchesRequestedBy && matchesDateFrom && matchesDateTo;
  });

  // Apply sorting to filtered requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case "dcr_id":
        aValue = a.dcr_id || `DCR-${a.id.slice(0, 8)}`;
        bValue = b.dcr_id || `DCR-${b.id.slice(0, 8)}`;
        break;
      case "dcr_type":
        aValue = getDCRTypeName(a.entity_type, a.request_type);
        bValue = getDCRTypeName(b.entity_type, b.request_type);
        break;
      case "date_open":
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case "days_open":
        aValue = Math.floor((new Date().getTime() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24));
        bValue = Math.floor((new Date().getTime() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24));
        break;
      case "priority":
        const priorityOrder: { [key: string]: number } = { high: 3, urgent: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority.toLowerCase()] || 2;
        bValue = priorityOrder[b.priority.toLowerCase()] || 2;
        break;
      case "requested_by":
        aValue = a.requested_by || "";
        bValue = b.requested_by || "";
        break;
      case "last_updated":
        aValue = new Date(a.updated_at).getTime();
        bValue = new Date(b.updated_at).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("dcr_id")}
            >
              DCR ID <SortIcon column="dcr_id" />
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("dcr_type")}
            >
              DCR Type <SortIcon column="dcr_type" />
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("date_open")}
            >
              Date Open <SortIcon column="date_open" />
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("days_open")}
            >
              Days Open <SortIcon column="days_open" />
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("priority")}
            >
              Priority <SortIcon column="priority" />
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("requested_by")}
            >
              Requested by <SortIcon column="requested_by" />
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort("last_updated")}
            >
              Last Updated <SortIcon column="last_updated" />
            </th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View Timeline</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map((record) => (
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
                    record.priority.toLowerCase() === "high" || record.priority.toLowerCase() === "urgent"
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
                {getRequestedByName(record.requested_by)}
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* DCR Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">DCR Type</label>
              <Select value={selectedDCRType} onValueChange={setSelectedDCRType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {dcrTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requested By Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Requested By</label>
              <Select value={selectedRequestedBy} onValueChange={setSelectedRequestedBy}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueRequestedBy.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTable(sortedRequests, status)}
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
