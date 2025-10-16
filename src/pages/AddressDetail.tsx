import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle, XCircle, Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { ChangeRequestDialog } from "@/components/ChangeRequestDialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockAddresses } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToJSON, exportAddressToPDF, prepareAddressForExport } from "@/lib/exportUtils";

const AddressDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const address = mockAddresses.find((a) => a.id === id);

  const handleExportExcel = () => {
    if (address) {
      const data = prepareAddressForExport(address);
      exportToExcel([data], `Address_${address.mdmId}`);
    }
  };

  const handleExportJSON = () => {
    if (address) {
      exportToJSON(address, `Address_${address.mdmId}`);
    }
  };

  const handleExportPDF = () => {
    if (address) {
      exportAddressToPDF(address);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Address Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested address profile could not be found.</p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Address List
          </Button>
          
          <div className="flex gap-2 mb-4">
            <ChangeRequestDialog entityType="Address" entityId={address.id} entityData={address} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileJson className="mr-2 h-4 w-4" />
                  Download JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2 shadow-elevated">
            <CardHeader className="bg-gradient-primary text-primary-foreground">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    Address Profile
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {address.addressType}
                  </Badge>
                </div>
                <Badge className={address.status === "Active" ? "bg-success" : "bg-warning"}>
                  {address.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">MDM ID</p>
                  <p className="font-semibold">{address.mdmId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Org ID</p>
                  <p className="font-semibold">{address.orgId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address Type</p>
                  <p className="font-semibold">{address.addressType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <div className="flex items-center gap-2">
                    {address.verified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="font-semibold text-success">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-warning" />
                        <span className="font-semibold text-warning">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Complete Address</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-lg font-medium">{address.street}</p>
                  <p className="text-lg">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-lg">{address.country}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Address Components</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Street</p>
                    <p className="font-medium">{address.street}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{address.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{address.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ZIP Code</p>
                    <p className="font-medium">{address.zipCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{address.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Identifiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {address.identifiers.map((id, idx) => (
                    <Badge key={idx} variant="outline" className="w-full justify-start">
                      {id}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Record Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">{format(new Date(address.lastUpdated), "MM/dd/yyyy, HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{format(new Date(address.lastUpdated), "MM/dd/yyyy, HH:mm")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetail;
