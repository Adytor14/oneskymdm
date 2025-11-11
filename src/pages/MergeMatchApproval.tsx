import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MergeMatchApproval = () => {
  const navigate = useNavigate();
  const [activeStatusTab, setActiveStatusTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const mockPendingData = [
    {
      requestId: "8f569b06",
      entityIds: "HCP1001, HCP2104",
      matchScore: 70,
      status: "Pending",
      processedDate: "16/10/2025",
    },
    {
      requestId: "8f569b06",
      entityIds: "HCP1002",
      matchScore: 85,
      status: "Pending",
      processedDate: "17/10/2025",
    },
    {
      requestId: "8f569b06",
      entityIds: "HCP1003",
      matchScore: 90,
      status: "Pending",
      processedDate: "18/10/2025",
    },
    {
      requestId: "8f569b06",
      entityIds: "HCP1004",
      matchScore: 81,
      status: "Pending",
      processedDate: "19/10/2025",
    },
    {
      requestId: "8f569b06",
      entityIds: "HCP1005",
      matchScore: 68,
      status: "Pending",
      processedDate: "20/10/2025",
    },
  ];

  const mockResolvedData = [
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
      requestId: "8f569B06",
      entityIds: "HCP1002",
      matchScore: 85,
      status: "Rejected",
      processedDate: "17/10/2025",
      resolvedDate: "22/10/2025",
      resolvedBy: "Scott Henderson",
      comments: "Rejected",
    },
    {
      requestId: "8f569B06",
      entityIds: "HCP1003",
      matchScore: 90,
      status: "Merged",
      processedDate: "18/10/2025",
      resolvedDate: "21/10/2025",
      resolvedBy: "Lewis Hamilton",
      comments: "Accepted",
    },
    {
      requestId: "8f569B06",
      entityIds: "HCP1004",
      matchScore: 81,
      status: "Merged",
      processedDate: "19/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Travis Wohlberg",
      comments: "Accepted",
    },
    {
      requestId: "8f569B06",
      entityIds: "HCP1005",
      matchScore: 68,
      status: "Merged",
      processedDate: "20/10/2025",
      resolvedDate: "20/10/2025",
      resolvedBy: "Jack Sully",
      comments: "Accepted",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Merge/Match Approval</h1>
        <p className="text-muted-foreground mt-1">Review and approve match proposals</p>
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
                        <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
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
    </div>
  );
};

export default MergeMatchApproval;
