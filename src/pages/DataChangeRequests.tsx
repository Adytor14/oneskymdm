import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { mockDCRs } from "@/lib/mockData";

const DataChangeRequests = () => {
  const navigate = useNavigate();
  const { status } = useParams<{ status: string }>();

  // Redirect to open by default if no status
  if (!status) {
    return <Navigate to="/change-requests/open" replace />;
  }

  // Validate status
  if (!["open", "approved", "rejected"].includes(status)) {
    return <Navigate to="/change-requests/open" replace />;
  }

  // Get requests based on status
  const openRequests = mockDCRs.slice(0, 5);
  const approvedRequests = mockDCRs.slice(5, 8);
  const rejectedRequests = mockDCRs.slice(8, 10);

  const getRequests = () => {
    switch (status) {
      case "open":
        return openRequests;
      case "approved":
        return approvedRequests;
      case "rejected":
        return rejectedRequests;
      default:
        return openRequests;
    }
  };

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

  const requests = getRequests();

  const renderTable = (requests: typeof mockDCRs, statusType: string) => (
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
