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
      entityIds: "PHY1001, PHY2104, PHY3201",
      matchScore: 70,
      status: "Pending",
      processedDate: "16/10/2025",
    },
    {
      requestId: "8f569b07",
      entityIds: "PHY1002, PHY3205, PHY4301, PHY5402",
      matchScore: 85,
      status: "Pending",
      processedDate: "17/10/2025",
    },
    {
      requestId: "8f569b08",
      entityIds: "PHY1003, PHY4106",
      matchScore: 90,
      status: "Pending",
      processedDate: "18/10/2025",
    },
    {
      requestId: "8f569b09",
      entityIds: "PHY1004, PHY5207, PHY6308",
      matchScore: 81,
      status: "Pending",
      processedDate: "19/10/2025",
    },
    {
      requestId: "8f569b10",
      entityIds: "PHY1005, PHY6308, PHY7409, PHY8510, PHY9611",
      matchScore: 68,
      status: "Pending",
      processedDate: "20/10/2025",
    },
  ];

  const mockPendingDataHCO = [
    {
      requestId: "9a671c01",
      entityIds: "FAC2001, FAC3102, FAC4201",
      matchScore: 75,
      status: "Pending",
      processedDate: "15/10/2025",
    },
    {
      requestId: "9a671c02",
      entityIds: "FAC2002, FAC4203, FAC5301, FAC6402",
      matchScore: 88,
      status: "Pending",
      processedDate: "16/10/2025",
    },
    {
      requestId: "9a671c03",
      entityIds: "FAC2003, FAC5304",
      matchScore: 92,
      status: "Pending",
      processedDate: "17/10/2025",
    },
    {
      requestId: "9a671c04",
      entityIds: "FAC2004, FAC6405, FAC7503",
      matchScore: 79,
      status: "Pending",
      processedDate: "18/10/2025",
    },
    {
      requestId: "9a671c05",
      entityIds: "FAC2005, FAC7506, FAC8604, FAC9705, FAC1806",
      matchScore: 83,
      status: "Pending",
      processedDate: "19/10/2025",
    },
  ];

  const mockPendingData = entityType === "hco" ? mockPendingDataHCO : mockPendingDataHCP;

  const mockEntityDetailsHCP: Record<string, any> = {
    PHY1001: {
      firstName: "Sarah",
      lastName: "Johnson",
      npiId: "1234567890",
      orgId: "ORG-12345",
      source: "Epic EMR",
      mdmId: "MDM-PHY-001",
      medicalLicense: "MA-MD-123456",
      address: "123 Medical Plaza, Boston, MA 02115, USA",
    },
    PHY2104: {
      firstName: "Sarrah",
      lastName: "Johnson",
      npiId: "1234567890",
      orgId: "ORG-12345",
      source: "Epic EMR",
      mdmId: "MDM-PHY-001",
      medicalLicense: "MA-MD-123456",
      address: "123 Medical Plaza, Boston, MA 02115, USA",
    },
    PHY3201: {
      firstName: "Sara",
      lastName: "Johnson",
      npiId: "1234567890",
      orgId: "ORG-12346",
      source: "Cerner",
      mdmId: "MDM-PHY-002",
      medicalLicense: "MA-MD-123457",
      address: "125 Medical Plaza, Boston, MA 02115, USA",
    },
    PHY1002: {
      firstName: "Michael",
      lastName: "Williams",
      npiId: "2345678901",
      orgId: "ORG-23456",
      source: "Epic EMR",
      mdmId: "MDM-PHY-003",
      medicalLicense: "NY-MD-234567",
      address: "456 Health Ave, New York, NY 10001, USA",
    },
    PHY3205: {
      firstName: "Mike",
      lastName: "Williams",
      npiId: "2345678901",
      orgId: "ORG-23456",
      source: "Cerner",
      mdmId: "MDM-PHY-003",
      medicalLicense: "NY-MD-234567",
      address: "456 Health Ave, New York, NY 10001, USA",
    },
    PHY4301: {
      firstName: "M.",
      lastName: "Williams",
      npiId: "2345678901",
      orgId: "ORG-23457",
      source: "Allscripts",
      mdmId: "MDM-PHY-004",
      medicalLicense: "NY-MD-234568",
      address: "458 Health Ave, New York, NY 10001, USA",
    },
    PHY5402: {
      firstName: "Michael",
      lastName: "Wiliams",
      npiId: "2345678901",
      orgId: "ORG-23456",
      source: "Epic EMR",
      mdmId: "MDM-PHY-003",
      medicalLicense: "NY-MD-234567",
      address: "456 Health Ave, New York, NY 10001, USA",
    },
    PHY1003: {
      firstName: "Emily",
      lastName: "Davis",
      npiId: "3456789012",
      orgId: "ORG-34567",
      source: "Epic EMR",
      mdmId: "MDM-PHY-005",
      medicalLicense: "CA-MD-345678",
      address: "789 Care Blvd, Los Angeles, CA 90001, USA",
    },
    PHY4106: {
      firstName: "Emily",
      lastName: "Davies",
      npiId: "3456789012",
      orgId: "ORG-34567",
      source: "Cerner",
      mdmId: "MDM-PHY-005",
      medicalLicense: "CA-MD-345678",
      address: "789 Care Blvd, Los Angeles, CA 90001, USA",
    },
    PHY1004: {
      firstName: "Robert",
      lastName: "Brown",
      npiId: "4567890123",
      orgId: "ORG-45678",
      source: "Epic EMR",
      mdmId: "MDM-PHY-006",
      medicalLicense: "TX-MD-456789",
      address: "321 Wellness Dr, Houston, TX 77001, USA",
    },
    PHY5207: {
      firstName: "Rob",
      lastName: "Brown",
      npiId: "4567890123",
      orgId: "ORG-45678",
      source: "Cerner",
      mdmId: "MDM-PHY-006",
      medicalLicense: "TX-MD-456789",
      address: "321 Wellness Dr, Houston, TX 77001, USA",
    },
    PHY6308: {
      firstName: "Robert",
      lastName: "Browne",
      npiId: "4567890123",
      orgId: "ORG-45679",
      source: "Allscripts",
      mdmId: "MDM-PHY-007",
      medicalLicense: "TX-MD-456790",
      address: "323 Wellness Dr, Houston, TX 77001, USA",
    },
    PHY1005: {
      firstName: "Jennifer",
      lastName: "Martinez",
      npiId: "5678901234",
      orgId: "ORG-56789",
      source: "Epic EMR",
      mdmId: "MDM-PHY-008",
      medicalLicense: "FL-MD-567890",
      address: "654 Medical Center, Miami, FL 33101, USA",
    },
    PHY7409: {
      firstName: "Jenny",
      lastName: "Martinez",
      npiId: "5678901234",
      orgId: "ORG-56789",
      source: "Cerner",
      mdmId: "MDM-PHY-008",
      medicalLicense: "FL-MD-567890",
      address: "654 Medical Center, Miami, FL 33101, USA",
    },
    PHY8510: {
      firstName: "J.",
      lastName: "Martinez",
      npiId: "5678901234",
      orgId: "ORG-56790",
      source: "Allscripts",
      mdmId: "MDM-PHY-009",
      medicalLicense: "FL-MD-567891",
      address: "656 Medical Center, Miami, FL 33101, USA",
    },
    PHY9611: {
      firstName: "Jennifer",
      lastName: "Martines",
      npiId: "5678901234",
      orgId: "ORG-56789",
      source: "Epic EMR",
      mdmId: "MDM-PHY-008",
      medicalLicense: "FL-MD-567890",
      address: "654 Medical Center, Miami, FL 33101, USA",
    },
  };

  const mockEntityDetailsHCO: Record<string, any> = {
    FAC2001: {
      name: "Boston General Hospital",
      npiId: "9876543210",
      orgId: "ORG-56789",
      source: "Cerner",
      mdmId: "MDM-FAC-501",
      taxId: "12-3456789",
      address: "456 Healthcare Ave, Boston, MA 02116, USA",
    },
    FAC3102: {
      name: "Boston General Medical Center",
      npiId: "9876543210",
      orgId: "ORG-56789",
      source: "Cerner",
      mdmId: "MDM-FAC-501",
      taxId: "12-3456789",
      address: "456 Healthcare Ave, Boston, MA 02116, USA",
    },
    FAC4201: {
      name: "Boston Gen. Hospital",
      npiId: "9876543210",
      orgId: "ORG-56790",
      source: "Epic EMR",
      mdmId: "MDM-FAC-502",
      taxId: "12-3456790",
      address: "458 Healthcare Ave, Boston, MA 02116, USA",
    },
    FAC2002: {
      name: "New York Presbyterian",
      npiId: "8765432109",
      orgId: "ORG-67890",
      source: "Epic EMR",
      mdmId: "MDM-FAC-503",
      taxId: "23-4567890",
      address: "789 Medical Blvd, New York, NY 10001, USA",
    },
    FAC4203: {
      name: "NY Presbyterian Hospital",
      npiId: "8765432109",
      orgId: "ORG-67890",
      source: "Cerner",
      mdmId: "MDM-FAC-503",
      taxId: "23-4567890",
      address: "789 Medical Blvd, New York, NY 10001, USA",
    },
    FAC5301: {
      name: "New York Presby. Medical",
      npiId: "8765432109",
      orgId: "ORG-67891",
      source: "Allscripts",
      mdmId: "MDM-FAC-504",
      taxId: "23-4567891",
      address: "791 Medical Blvd, New York, NY 10001, USA",
    },
    FAC6402: {
      name: "NYP Hospital",
      npiId: "8765432109",
      orgId: "ORG-67890",
      source: "Epic EMR",
      mdmId: "MDM-FAC-503",
      taxId: "23-4567890",
      address: "789 Medical Blvd, New York, NY 10001, USA",
    },
    FAC2003: {
      name: "UCLA Medical Center",
      npiId: "7654321098",
      orgId: "ORG-78901",
      source: "Epic EMR",
      mdmId: "MDM-FAC-505",
      taxId: "34-5678901",
      address: "321 Wellness Dr, Los Angeles, CA 90001, USA",
    },
    FAC5304: {
      name: "UCLA Medical Ctr",
      npiId: "7654321098",
      orgId: "ORG-78901",
      source: "Cerner",
      mdmId: "MDM-FAC-505",
      taxId: "34-5678901",
      address: "321 Wellness Dr, Los Angeles, CA 90001, USA",
    },
    FAC2004: {
      name: "Houston Methodist",
      npiId: "6543210987",
      orgId: "ORG-89012",
      source: "Epic EMR",
      mdmId: "MDM-FAC-506",
      taxId: "45-6789012",
      address: "654 Care Center, Houston, TX 77001, USA",
    },
    FAC6405: {
      name: "Houston Methodist Hospital",
      npiId: "6543210987",
      orgId: "ORG-89012",
      source: "Cerner",
      mdmId: "MDM-FAC-506",
      taxId: "45-6789012",
      address: "654 Care Center, Houston, TX 77001, USA",
    },
    FAC7503: {
      name: "Methodist Hosp Houston",
      npiId: "6543210987",
      orgId: "ORG-89013",
      source: "Allscripts",
      mdmId: "MDM-FAC-507",
      taxId: "45-6789013",
      address: "656 Care Center, Houston, TX 77001, USA",
    },
    FAC2005: {
      name: "Miami General Hospital",
      npiId: "5432109876",
      orgId: "ORG-90123",
      source: "Epic EMR",
      mdmId: "MDM-FAC-508",
      taxId: "56-7890123",
      address: "987 Health Plaza, Miami, FL 33101, USA",
    },
    FAC7506: {
      name: "Miami General Med Center",
      npiId: "5432109876",
      orgId: "ORG-90123",
      source: "Cerner",
      mdmId: "MDM-FAC-508",
      taxId: "56-7890123",
      address: "987 Health Plaza, Miami, FL 33101, USA",
    },
    FAC8604: {
      name: "Miami Gen. Hospital",
      npiId: "5432109876",
      orgId: "ORG-90124",
      source: "Allscripts",
      mdmId: "MDM-FAC-509",
      taxId: "56-7890124",
      address: "989 Health Plaza, Miami, FL 33101, USA",
    },
    FAC9705: {
      name: "MGH Miami",
      npiId: "5432109876",
      orgId: "ORG-90123",
      source: "Epic EMR",
      mdmId: "MDM-FAC-508",
      taxId: "56-7890123",
      address: "987 Health Plaza, Miami, FL 33101, USA",
    },
    FAC1806: {
      name: "Miami General Hosp",
      npiId: "5432109876",
      orgId: "ORG-90125",
      source: "Meditech",
      mdmId: "MDM-FAC-510",
      taxId: "56-7890125",
      address: "991 Health Plaza, Miami, FL 33101, USA",
    },
  };

  const mockEntityDetails = entityType === "hco" ? mockEntityDetailsHCO : mockEntityDetailsHCP;

  const mockResolvedDataHCP = [
    {
      requestId: "8f569B06",
      entityIds: "PHY1001, PHY2104",
      matchScore: 70,
      status: "Merged",
      processedDate: "16/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "John Doe",
      comments: "Accepted",
    },
    {
      requestId: "8f569B07",
      entityIds: "PHY1002, PHY3205",
      matchScore: 85,
      status: "Rejected",
      processedDate: "17/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "Scott Henderson",
      comments: "Rejected",
    },
    {
      requestId: "8f569B08",
      entityIds: "PHY1003, PHY4106",
      matchScore: 90,
      status: "Merged",
      processedDate: "18/10/2025",
      resolvedDate: "21/10/2025",
      resolvedBy: "Lewis Hamilton",
      comments: "Accepted",
    },
    {
      requestId: "8f569B09",
      entityIds: "PHY1004, PHY5207",
      matchScore: 81,
      status: "Merged",
      processedDate: "19/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Travis Wohlberg",
      comments: "Accepted",
    },
    {
      requestId: "8f569B10",
      entityIds: "PHY1005, PHY6308",
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
      entityIds: "FAC2001, FAC3102",
      matchScore: 75,
      status: "Merged",
      processedDate: "15/10/2025",
      resolvedDate: "21/10/2025",
      resolvedBy: "Jane Smith",
      comments: "Accepted",
    },
    {
      requestId: "9a671C02",
      entityIds: "FAC2002, FAC4203",
      matchScore: 88,
      status: "Merged",
      processedDate: "16/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Robert Johnson",
      comments: "Accepted",
    },
    {
      requestId: "9a671C03",
      entityIds: "FAC2003, FAC5304",
      matchScore: 92,
      status: "Rejected",
      processedDate: "17/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "Emily Davis",
      comments: "Rejected - Different facilities",
    },
    {
      requestId: "9a671C04",
      entityIds: "FAC2004, FAC6405",
      matchScore: 79,
      status: "Merged",
      processedDate: "18/10/2025",
      resolvedDate: "23/10/2025",
      resolvedBy: "Michael Brown",
      comments: "Accepted",
    },
    {
      requestId: "9a671C05",
      entityIds: "FAC2005, FAC7506",
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

  // Individual entity action handlers
  const handleApproveEntity = (entityId: string) => {
    toast({
      title: "Entity Approved for Merge",
      description: `Entity ${entityId} has been approved for merge in request ${selectedRequest?.requestId}.`,
    });
  };

  const handleRejectEntity = (entityId: string) => {
    toast({
      title: "Entity Rejected",
      description: `Entity ${entityId} has been rejected from merge request ${selectedRequest?.requestId}.`,
      variant: "destructive",
    });
  };

  const handleMarkDuplicateEntity = (entityId: string) => {
    toast({
      title: "Marked as Deliberate Duplicate",
      description: `Entity ${entityId} marked as deliberate duplicate in request ${selectedRequest?.requestId}.`,
    });
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
                const trimmedId = entityId.trim();
                const details = mockEntityDetails[trimmedId as keyof typeof mockEntityDetails];
                return (
                  <div 
                    key={trimmedId} 
                    className="space-y-3 p-4 rounded-lg border bg-background border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">{trimmedId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRejectEntity(trimmedId)}
                        >
                          Reject
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkDuplicateEntity(trimmedId)}
                        >
                          Mark Duplicate
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleApproveEntity(trimmedId)}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="link" 
                          className="text-primary p-0 h-auto"
                          onClick={() => navigate(entityType === "hco" ? `/hco/${trimmedId}` : `/hcp/${trimmedId}`)}
                        >
                          View more
                        </Button>
                      </div>
                    </div>
                    
                    {entityType === "hco" ? (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Facility Name</div>
                          <div className={index === 0 ? "text-red-600 font-medium" : ""}>
                            {details?.name || "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">NPI ID</div>
                          <div>{details?.npiId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">ORG ID</div>
                          <div>{details?.orgId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Source</div>
                          <div>{details?.source || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">MDM ID</div>
                          <div>{details?.mdmId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Tax ID</div>
                          <div>{details?.taxId || "N/A"}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-muted-foreground mb-1">Address</div>
                          <div>{details?.address || "N/A"}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">First Name</div>
                          <div className={index === 0 ? "text-red-600 font-medium" : ""}>
                            {details?.firstName || "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">NPI ID</div>
                          <div>{details?.npiId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Last Name</div>
                          <div>{details?.lastName || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">ORG ID</div>
                          <div>{details?.orgId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Source</div>
                          <div>{details?.source || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">MDM ID</div>
                          <div>{details?.mdmId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Medical License</div>
                          <div>{details?.medicalLicense || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Address</div>
                          <div>{details?.address || "N/A"}</div>
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

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MergeMatchApproval;
