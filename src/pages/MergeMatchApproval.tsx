import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MergeMatchApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const entityType = searchParams.get("type") || "hcp";
  const [activeStatusTab, setActiveStatusTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState("");

  const mockPendingDataHCP = [
    {
      requestId: "8f569b06",
      entityIds: "HCP1001, HCP2104",
      matchScore: 70,
      status: "Pending",
      processedDate: "16/10/2025",
    },
    {
      requestId: "8f569b07",
      entityIds: "HCP1002, HCP3205",
      matchScore: 85,
      status: "Pending",
      processedDate: "17/10/2025",
    },
    {
      requestId: "8f569b08",
      entityIds: "HCP1003, HCP4106",
      matchScore: 90,
      status: "Pending",
      processedDate: "18/10/2025",
    },
    {
      requestId: "8f569b09",
      entityIds: "HCP1004, HCP5207",
      matchScore: 81,
      status: "Pending",
      processedDate: "19/10/2025",
    },
    {
      requestId: "8f569b10",
      entityIds: "HCP1005, HCP6308",
      matchScore: 68,
      status: "Pending",
      processedDate: "20/10/2025",
    },
  ];

  const mockPendingDataHCO = [
    {
      requestId: "9a671c01",
      entityIds: "HCO2001, HCO3102",
      matchScore: 75,
      status: "Pending",
      processedDate: "15/10/2025",
    },
    {
      requestId: "9a671c02",
      entityIds: "HCO2002, HCO4203",
      matchScore: 88,
      status: "Pending",
      processedDate: "16/10/2025",
    },
    {
      requestId: "9a671c03",
      entityIds: "HCO2003, HCO5304",
      matchScore: 92,
      status: "Pending",
      processedDate: "17/10/2025",
    },
    {
      requestId: "9a671c04",
      entityIds: "HCO2004, HCO6405",
      matchScore: 79,
      status: "Pending",
      processedDate: "18/10/2025",
    },
    {
      requestId: "9a671c05",
      entityIds: "HCO2005, HCO7506",
      matchScore: 83,
      status: "Pending",
      processedDate: "19/10/2025",
    },
  ];

  const mockPendingData = entityType === "hco" ? mockPendingDataHCO : mockPendingDataHCP;

  const mockEntityDetailsHCP: Record<string, any> = {
    HCP1001: {
      firstName: "Sarah",
      lastName: "Johnson",
      npiId: "1234567890",
      orgId: "ORG-12345",
      source: "Epic EMR",
      mdmId: "MDM-HCP-001",
      medicalLicense: "MA-MD-123456",
      address: "123 Medical Plaza, Boston, MA 02115, USA",
    },
    HCP2104: {
      firstName: "Sarrah",
      lastName: "Johnson",
      npiId: "1234567890",
      orgId: "ORG-12345",
      source: "Epic EMR",
      mdmId: "MDM-HCP-001",
      medicalLicense: "MA-MD-123456",
      address: "123 Medical Plaza, Boston, MA 02115, USA",
    },
  };

  const mockEntityDetailsHCO: Record<string, any> = {
    HCO2001: {
      name: "Boston General Hospital",
      npiId: "9876543210",
      orgId: "ORG-56789",
      source: "Cerner",
      mdmId: "MDM-HCO-501",
      taxId: "12-3456789",
      address: "456 Healthcare Ave, Boston, MA 02116, USA",
    },
    HCO3102: {
      name: "Boston General Medical Center",
      npiId: "9876543210",
      orgId: "ORG-56789",
      source: "Cerner",
      mdmId: "MDM-HCO-501",
      taxId: "12-3456789",
      address: "456 Healthcare Ave, Boston, MA 02116, USA",
    },
  };

  const mockEntityDetails = entityType === "hco" ? mockEntityDetailsHCO : mockEntityDetailsHCP;

  const mockResolvedDataHCP = [
    {
      requestId: "8f569B06",
      entityIds: "HCP1001, HCP2104",
      matchScore: 70,
      status: "Merged",
      processedDate: "16/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "John Doe",
      comments: "Accepted",
    },
    {
      requestId: "8f569B07",
      entityIds: "HCP1002, HCP3205",
      matchScore: 85,
      status: "Rejected",
      processedDate: "17/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "Scott Henderson",
      comments: "Rejected",
    },
    {
      requestId: "8f569B08",
      entityIds: "HCP1003, HCP4106",
      matchScore: 90,
      status: "Merged",
      processedDate: "18/10/2025",
      resolvedDate: "21/10/2025",
      resolvedBy: "Lewis Hamilton",
      comments: "Accepted",
    },
    {
      requestId: "8f569B09",
      entityIds: "HCP1004, HCP5207",
      matchScore: 81,
      status: "Merged",
      processedDate: "19/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Travis Wohlberg",
      comments: "Accepted",
    },
    {
      requestId: "8f569B10",
      entityIds: "HCP1005, HCP6308",
      matchScore: 68,
      status: "Merged",
      processedDate: "20/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Jack Sully",
      comments: "Accepted",
    },
  ];

  const mockResolvedDataHCO = [
    {
      requestId: "9a671C01",
      entityIds: "HCO2001, HCO3102",
      matchScore: 75,
      status: "Merged",
      processedDate: "15/10/2025",
      resolvedDate: "21/10/2025",
      resolvedBy: "Jane Smith",
      comments: "Accepted",
    },
    {
      requestId: "9a671C02",
      entityIds: "HCO2002, HCO4203",
      matchScore: 88,
      status: "Merged",
      processedDate: "16/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Robert Johnson",
      comments: "Accepted",
    },
    {
      requestId: "9a671C03",
      entityIds: "HCO2003, HCO5304",
      matchScore: 92,
      status: "Rejected",
      processedDate: "17/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "Emily Davis",
      comments: "Rejected - Different facilities",
    },
    {
      requestId: "9a671C04",
      entityIds: "HCO2004, HCO6405",
      matchScore: 79,
      status: "Merged",
      processedDate: "18/10/2025",
      resolvedDate: "23/10/2025",
      resolvedBy: "Michael Brown",
      comments: "Accepted",
    },
    {
      requestId: "9a671C05",
      entityIds: "HCO2005, HCO7506",
      matchScore: 83,
      status: "Deliberate Duplicate",
      processedDate: "19/10/2025",
      resolvedDate: "24/10/2025",
      resolvedBy: "Sarah Wilson",
      comments: "Marked as deliberate duplicate",
    },
  ];

  const mockResolvedData = entityType === "hco" ? mockResolvedDataHCO : mockResolvedDataHCP;

  const handleViewRequest = (record: any) => {
    setSelectedRequest(record);
    setIsDialogOpen(true);
    setComment("");
  };

  const handleApprove = () => {
    toast({
      title: "Request Approved",
      description: `Merge request ${selectedRequest?.requestId} has been approved.`,
    });
    setIsDialogOpen(false);
  };

  const handleReject = () => {
    toast({
      title: "Request Rejected",
      description: `Merge request ${selectedRequest?.requestId} has been rejected.`,
      variant: "destructive",
    });
    setIsDialogOpen(false);
  };

  const handleMarkDuplicate = () => {
    toast({
      title: "Marked as Deliberate Duplicate",
      description: `Request ${selectedRequest?.requestId} marked as deliberate duplicate.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Merge/Match Approval - {entityType === "hco" ? "Facility Accounts" : "Physician Accounts"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and approve merge/match requests for {entityType === "hco" ? "facility" : "physician"} accounts
        </p>
      </div>

      <Tabs value={activeStatusTab} onValueChange={setActiveStatusTab}>
        <TabsList className="bg-muted">
          <TabsTrigger 
            value="resolved" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Resolved
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Request ID or Entity ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Scores" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (&gt;80%)</SelectItem>
                <SelectItem value="medium">Medium (60-80%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-background border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-sm">Request ID</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Entity IDs</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Match Score</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Processed Date</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">View</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPendingData.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm">{record.requestId}</td>
                      <td className="py-3 px-4 text-sm">
                        {record.entityIds.split(", ").map((id, i) => (
                          <span key={i}>
                            <span className="text-primary hover:underline cursor-pointer">{id}</span>
                            {i < record.entityIds.split(", ").length - 1 && ", "}
                          </span>
                        ))}
                      </td>
                      <td className="py-3 px-4 text-sm">{record.matchScore}%</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                          {record.status}
                        </Badge>
                      </td>
                          <td className="py-3 px-4 text-sm">{record.processedDate}</td>
                          <td className="py-3 px-4">
                            <Eye 
                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                              onClick={() => handleViewRequest(record)}
                            />
                          </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Request ID or Entity ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Scores" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (&gt;80%)</SelectItem>
                <SelectItem value="medium">Medium (60-80%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-background border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-sm">Request ID</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Entity IDs</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Match Score</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Processed Date</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Resolved Date</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Resolved By</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {mockResolvedData.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm">{record.requestId}</td>
                      <td className="py-3 px-4 text-sm">
                        {record.entityIds.split(", ").map((id, i) => (
                          <span key={i}>
                            <span className="text-primary hover:underline cursor-pointer">{id}</span>
                            {i < record.entityIds.split(", ").length - 1 && ", "}
                          </span>
                        ))}
                      </td>
                      <td className="py-3 px-4 text-sm">{record.matchScore}%</td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            record.status === "Merged"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{record.processedDate}</td>
                      <td className="py-3 px-4 text-sm">{record.resolvedDate}</td>
                      <td className="py-3 px-4 text-sm">{record.resolvedBy}</td>
                      <td className="py-3 px-4 text-sm">{record.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              {selectedRequest?.requestId} - Merge
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Summary Info */}
              <div className="grid grid-cols-2 gap-8 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Entity ID</div>
                    <div className="font-medium text-primary">
                      {selectedRequest.entityIds}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Rule</div>
                    <div className="font-medium">Suspect</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Match Score</div>
                    <div className="font-medium">{selectedRequest.matchScore}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Processed Date</div>
                    <div className="font-medium">{selectedRequest.processedDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Resolved Date</div>
                    <div className="font-medium">-</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Resolved By</div>
                    <div className="font-medium">-</div>
                  </div>
                </div>
              </div>

              {/* Entity Details */}
              {selectedRequest.entityIds.split(", ").map((entityId: string, index: number) => {
                const details = mockEntityDetails[entityId as keyof typeof mockEntityDetails];
                return (
                  <div key={entityId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{entityId}</h3>
                      <Button 
                        variant="link" 
                        className="text-primary p-0 h-auto"
                        onClick={() => navigate(entityType === "hco" ? `/hco/${entityId}` : `/hcp/${entityId}`)}
                      >
                        View more
                      </Button>
                    </div>
                    
                    {entityType === "hco" ? (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Facility Name</div>
                          <div className={index === 0 ? "text-red-600 font-medium" : ""}>
                            {details?.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">NPI ID</div>
                          <div>{details?.npiId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">ORG ID</div>
                          <div>{details?.orgId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Source</div>
                          <div>{details?.source}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">MDM ID</div>
                          <div>{details?.mdmId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Tax ID</div>
                          <div>{details?.taxId}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-muted-foreground mb-1">Address</div>
                          <div>{details?.address}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">First Name</div>
                          <div className={index === 0 ? "text-red-600 font-medium" : ""}>
                            {details?.firstName}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">NPI ID</div>
                          <div>{details?.npiId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Last Name</div>
                          <div>{details?.lastName}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">ORG ID</div>
                          <div>{details?.orgId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Source</div>
                          <div>{details?.source}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">MDM ID</div>
                          <div>{details?.mdmId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Medical License</div>
                          <div>{details?.medicalLicense}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Address</div>
                          <div>{details?.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Comment Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Add a comment (Optional)</label>
                <Textarea
                  placeholder="Enter your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleReject}
                >
                  Reject
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleMarkDuplicate}
                >
                  Mark Deliberate Duplicate
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MergeMatchApproval;
