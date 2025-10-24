import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MergeMatchApproval = () => {
  const navigate = useNavigate();
  const [activeEntityTab, setActiveEntityTab] = useState("hcp");
  const [activeStatusTab, setActiveStatusTab] = useState("pending");

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

      <Tabs value={activeEntityTab} onValueChange={setActiveEntityTab}>
        <TabsList className="bg-muted w-full justify-start">
          <TabsTrigger value="hcp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1">
            HCP
          </TabsTrigger>
          <TabsTrigger value="hco" className="data-[state=active]:bg-muted-foreground flex-1">
            HCO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hcp" className="space-y-4">
          <Tabs value={activeStatusTab} onValueChange={setActiveStatusTab}>
            <TabsList className="bg-background border">
              <TabsTrigger 
                value="resolved" 
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Resolved
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Pending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="text-left py-3 px-4 font-medium">Request ID</th>
                          <th className="text-left py-3 px-4 font-medium">Entity IDs</th>
                          <th className="text-left py-3 px-4 font-medium">Match Score</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Processed Date</th>
                          <th className="text-left py-3 px-4 font-medium">View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPendingData.map((record, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{record.requestId}</td>
                            <td className="py-3 px-4">{record.entityIds}</td>
                            <td className="py-3 px-4">{record.matchScore}%</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                                {record.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{record.processedDate}</td>
                            <td className="py-3 px-4">
                              <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolved">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="text-left py-3 px-4 font-medium">Request ID</th>
                          <th className="text-left py-3 px-4 font-medium">Entity IDs</th>
                          <th className="text-left py-3 px-4 font-medium">Match Score</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Processed Date</th>
                          <th className="text-left py-3 px-4 font-medium">Resolved Date</th>
                          <th className="text-left py-3 px-4 font-medium">Resolved By</th>
                          <th className="text-left py-3 px-4 font-medium">Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResolvedData.map((record, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{record.requestId}</td>
                            <td className="py-3 px-4">{record.entityIds}</td>
                            <td className="py-3 px-4">{record.matchScore}%</td>
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
                            <td className="py-3 px-4">{record.processedDate}</td>
                            <td className="py-3 px-4">{record.resolvedDate}</td>
                            <td className="py-3 px-4">{record.resolvedBy}</td>
                            <td className="py-3 px-4">{record.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="hco">
          <Card>
            <CardHeader>
              <CardTitle>HCO Match Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">HCO match approval data will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MergeMatchApproval;
