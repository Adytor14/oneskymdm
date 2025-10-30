import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDCRs } from "@/lib/mockData";

const DataChangeRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("open");

  // Simulate different statuses for the sections
  const openRequests = mockDCRs.slice(0, 5);
  const approvedRequests = mockDCRs.slice(5, 8);
  const rejectedRequests = mockDCRs.slice(8, 10);

  const renderTable = (requests: typeof mockDCRs, status: string) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Report ID</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Org ID</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Skyra MDM ID</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Visit Type</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((record, index) => (
            <tr
              key={index}
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate(`/dcr/${record.id}`)}
            >
              <td className="py-3 px-4">DCR-{record.mdmId.slice(-6)}</td>
              <td className="py-3 px-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">DCR</Badge>
              </td>
              <td className="py-3 px-4 text-sm">{record.orgId}</td>
              <td className="py-3 px-4 text-sm">{record.mdmId}</td>
              <td className="py-3 px-4 text-sm">Field Visit</td>
              <td className="py-3 px-4">
                <Badge
                  className={
                    status === "open"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">
                {new Date(record.lastUpdated).toLocaleDateString("en-GB")}
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Change Requests</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="open">
            Open ({openRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Open Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(openRequests, "open")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Approved Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(approvedRequests, "approved")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rejected Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(rejectedRequests, "rejected")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataChangeRequests;
