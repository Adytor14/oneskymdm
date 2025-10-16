import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Building2, FileText, Package, Download, FileJson, FileSpreadsheet, FileText as FilePDF } from "lucide-react";
import { ChangeRequestDialog } from "@/components/ChangeRequestDialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockDCRs } from "@/lib/mockData";
import {
  exportToExcel,
  exportToJSON,
  exportDCRToPDF,
  prepareDCRForExport,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DCRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dcr = mockDCRs.find((d) => d.id === id);

  const handleExportExcel = () => {
    if (dcr) {
      const exportData = prepareDCRForExport(dcr);
      exportToExcel([exportData], `DCR_${dcr.mdmId}_${dcr.callDate}`);
    }
  };

  const handleExportJSON = () => {
    if (dcr) {
      exportToJSON(dcr, `DCR_${dcr.mdmId}_${dcr.callDate}`);
    }
  };

  const handleExportPDF = () => {
    if (dcr) {
      exportDCRToPDF(dcr);
    }
  };

  if (!dcr) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">DCR Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested daily call report could not be found.</p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate("/dcr")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to DCR List
          </Button>
          
          <div className="flex gap-2">
            <ChangeRequestDialog entityType="DCR" entityId={dcr.id} entityData={dcr} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                  <FilePDF className="mr-2 h-4 w-4" />
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
                    <FileText className="h-6 w-6" />
                    Daily Call Report
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{dcr.callDate}</span>
                  </div>
                </div>
                <Badge className={dcr.status === "Active" ? "bg-success" : "bg-warning"}>
                  {dcr.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">MDM ID</p>
                  <p className="font-semibold">{dcr.mdmId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Org ID</p>
                  <p className="font-semibold">{dcr.orgId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call Type</p>
                  <p className="font-semibold">{dcr.callType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{dcr.callDuration} minutes</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Call Participants</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Healthcare Professional</p>
                      <p className="font-medium">{dcr.hcpName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Healthcare Organization</p>
                      <p className="font-medium">{dcr.hcoName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Representative</p>
                      <p className="font-medium">{dcr.representativeName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Products Discussed
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {dcr.productsDiscussed.map((product, idx) => (
                    <Badge key={idx} variant="secondary">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Samples Provided</h3>
                {dcr.samplesProvided.length > 0 ? (
                  <div className="space-y-2">
                    {dcr.samplesProvided.map((sample, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-sm">{sample}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No samples provided</p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Call Notes</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{dcr.notes}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Next Follow-Up</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{dcr.nextFollowUp}</span>
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
                  {dcr.identifiers.map((id, idx) => (
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
                  <p className="font-semibold">{format(new Date(dcr.lastUpdated), "MM/dd/yyyy, HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{format(new Date(dcr.lastUpdated), "MM/dd/yyyy, HH:mm")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCRDetail;
