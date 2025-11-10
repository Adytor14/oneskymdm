import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Users, Download, FileJson, FileSpreadsheet, FileText, Award } from "lucide-react";
import { ChangeRequestDialog } from "@/components/ChangeRequestDialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockHCOs } from "@/lib/mockData";
import {
  exportToExcel,
  exportToJSON,
  exportHCOToPDF,
  prepareHCOForExport,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HCODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hco = mockHCOs.find((h) => h.id === id);

  const handleExportExcel = () => {
    if (hco) {
      const exportData = prepareHCOForExport(hco);
      exportToExcel([exportData], `HCO_${hco.name.replace(/\s+/g, '_')}_${hco.mdmId}`);
    }
  };

  const handleExportJSON = () => {
    if (hco) {
      exportToJSON(hco, `HCO_${hco.name.replace(/\s+/g, '_')}_${hco.mdmId}`);
    }
  };

  const handleExportPDF = () => {
    if (hco) {
      exportHCOToPDF(hco);
    }
  };

  if (!hco) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">HCO Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested healthcare organization profile could not be found.</p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/hco")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Profile Header Card */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              {/* Header Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{hco.name}</h1>
                    <Badge variant="secondary" className="mb-2">Facility Account</Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{hco.email}</span>
                      </div>
                      <div>FACILITY TYPE: {hco.organizationType}</div>
                      <div>ORG ID: {hco.orgId}</div>
                      <div>SOURCE: {hco.source}</div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{hco.phone}</span>
                    </div>
                    <div>Skyra MDM ID: {hco.mdmId}</div>
                    <div>TYPE: {hco.organizationType}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export to PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileJson className="mr-2 h-4 w-4" />
                    DCR History
                  </Button>
                  <ChangeRequestDialog entityType="HCO" entityId={hco.id} entityData={hco} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Primary Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Facility Name</p>
                    <p className="font-medium">{hco.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Skyra MDM ID</p>
                    <p className="font-medium">{hco.mdmId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ORG ID</p>
                    <p className="font-medium">{hco.orgId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Facility Type</p>
                    <p className="font-medium">{hco.organizationType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NPI ID</p>
                    <p className="font-medium">{hco.npiId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-success">{hco.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Record State</p>
                    <p className="font-medium">Valid</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">
                        {hco.address.street} {hco.address.city} {hco.address.state} {hco.address.zipCode}
                      </p>
                      <Badge>Primary</Badge>
                    </div>
                    <Badge variant="outline" className="mr-2">Verified</Badge>
                    <p className="text-sm text-muted-foreground mt-1">Primary Address</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identifiers */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Identifiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">NPI</p>
                    <p className="font-medium">{hco.npiId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NPI Source ID</p>
                    <p className="font-medium">NPPES</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CMS Certification Number</p>
                    <p className="font-medium">345678</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source ID</p>
                    <p className="font-medium">CMS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Departments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {hco.departments.map((dept, idx) => (
                    <Badge key={idx} variant="outline">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Affiliated HCPs */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Affiliated Healthcare Professionals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {hco.affiliatedHCPs.length} healthcare professionals affiliated
                </p>
                <div className="flex gap-2 flex-wrap">
                  {hco.affiliatedHCPs.map((hcpId, idx) => (
                    <Badge key={idx} variant="secondary">
                      {hcpId}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient Volume & Trends */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Patient Volume & Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Admissions (Annual)</p>
                    <p className="text-3xl font-bold">15,240</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Daily Census</p>
                    <p className="text-3xl font-bold">342</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bed Capacity</p>
                    <p className="text-3xl font-bold">450</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Occupancy Rate</p>
                    <p className="text-3xl font-bold">76%</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Top Referral Sources</h4>
                  <div className="space-y-2">
                    {["University Medical Center", "Regional Hospital Network", "Community Health Partners"].map((source, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-sm">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Top Discharge Destinations</h4>
                  <div className="space-y-2">
                    {["Skilled Nursing Facility Network", "Home Health Services Inc", "Rehabilitation Centers Group"].map((dest, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-sm">{dest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality & Performance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quality & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">CMS Star Rating</p>
                    <p className="text-4xl font-bold mb-1">4.0</p>
                    <p className="text-xs text-muted-foreground">From CMS Care Compare</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                    <p className="text-4xl font-bold mb-1">92</p>
                    <p className="text-xs text-muted-foreground">From CMS Care Compare</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Revision History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">Update from CMS Database</p>
                  <p className="text-muted-foreground">2025-10-15 IST</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Update from NPPES</p>
                  <p className="text-muted-foreground">2025-09-30 IST</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Accreditation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hco.accreditation.map((acc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success" />
                      <span className="text-sm">{acc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HCODetail;
