import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Building2, Download, Award, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockHCPs } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToJSON, exportHCPToPDF, prepareHCPForExport } from "@/lib/exportUtils";
import { ChangeRequestDialog } from "@/components/ChangeRequestDialog";
import { format } from "date-fns";

const HCPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hcp = mockHCPs.find((h) => h.id === id);

  const handleExportExcel = () => {
    if (hcp) {
      const data = prepareHCPForExport(hcp);
      exportToExcel([data], `HCP_${hcp.lastName}_${hcp.firstName}_${hcp.mdmId}`);
    }
  };

  const handleExportJSON = () => {
    if (hcp) {
      exportToJSON(hcp, `HCP_${hcp.lastName}_${hcp.firstName}_${hcp.mdmId}`);
    }
  };

  const handleExportPDF = () => {
    if (hcp) {
      exportHCPToPDF(hcp);
    }
  };

  if (!hcp) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">HCP Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested healthcare professional profile could not be found.</p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
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
                    <h1 className="text-2xl font-bold mb-1">
                      {hcp.firstName} {hcp.lastName[0]} {hcp.lastName}
                    </h1>
                    <Badge variant="secondary" className="mb-2">Physician Account</Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{hcp.email}</span>
                      </div>
                      <div>HCP TYPE: {hcp.degreeType}</div>
                      <div>ORG ID: {hcp.orgId}</div>
                      <div>SOURCE: {hcp.source}</div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{hcp.phone}</span>
                    </div>
                    <div>Skyra MDM ID: {hcp.mdmId}</div>
                    <div>PRIMARY SPECIALTY: {hcp.speciality[0]}</div>
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
                  <ChangeRequestDialog entityType="HCP" entityId={hcp.id} entityData={hcp} />
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
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="font-medium">{hcp.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Middle Name</p>
                    <p className="font-medium">M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="font-medium">{hcp.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Skyra MDM ID</p>
                    <p className="font-medium">{hcp.mdmId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ORG ID</p>
                    <p className="font-medium">{hcp.orgId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HCP Type</p>
                    <p className="font-medium">{hcp.degreeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Specialty</p>
                    <p className="font-medium">{hcp.speciality[0]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-success">{hcp.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Record State</p>
                    <p className="font-medium">Valid</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">Female</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Flags</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">PDRP</p>
                      <p className="font-medium">Yes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Medical Director</p>
                      <p className="font-medium">Yes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deliberate Duplicate</p>
                      <p className="font-medium">No</p>
                    </div>
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
                        {hcp.address.street} {hcp.address.city} {hcp.address.state} {hcp.address.zipCode}
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
                    <p className="font-medium">{hcp.npiId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NPI Source ID</p>
                    <p className="font-medium">NPPES</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DEA</p>
                    <p className="font-medium">BK1234563</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DEA Source ID</p>
                    <p className="font-medium">DEA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licenses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Licenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold mb-2">{hcp.license}</p>
                  <p className="text-sm text-muted-foreground mb-3">Effective until 2026-06-30</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className="mt-1">Active</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Licensing Authority</p>
                      <p className="font-medium">Massachusetts</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Type</p>
                      <p className="font-medium">State</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliations - Source Derived */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Affiliations - Source Derived</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Sarasota Memorial Hospital-Sarasota Campus</h4>
                        <Badge variant="outline">Primary Affiliation</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="text-sm">1700 S Tamiami Trl, Sarasota, FL 34239</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="text-sm">{hcp.speciality[0]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="text-sm">Attending Physician</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className="mt-1">Active</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Effective Date</p>
                        <p className="text-sm">2015-03-01</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliations - Field Intelligence */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Affiliations - Field Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Venice Regional Bayfront Health</h4>
                      <Badge variant="outline">Secondary Affiliation</Badge>
                    </div>
                  </div>
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
                    <p className="text-sm text-muted-foreground mb-1">Home Health Patients (Raw)</p>
                    <p className="text-3xl font-bold">245</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hospice Patients (Raw)</p>
                    <p className="text-3xl font-bold">89</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Inpatient Patients (Raw)</p>
                    <p className="text-3xl font-bold">1234</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Outpatient Patients (Raw)</p>
                    <p className="text-3xl font-bold">3567</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Top Referral Sources</h4>
                  <div className="space-y-2">
                    {["Boston Medical Center", "Mass General Hospital", "Brigham and Women's Hospital"].map((source, idx) => (
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
                  <h4 className="text-sm font-semibold mb-3">Top Referral Destinations</h4>
                  <div className="space-y-2">
                    {["Skilled Nursing Facility A", "Home Health Agency B", "Rehabilitation Center C"].map((dest, idx) => (
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
                    <p className="text-sm text-muted-foreground mb-1">Star Rating</p>
                    <p className="text-4xl font-bold mb-1">4.5</p>
                    <p className="text-xs text-muted-foreground">From CMS Care Compare</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                    <p className="text-4xl font-bold mb-1">87</p>
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
                  <p className="text-muted-foreground">Update from OpenData</p>
                  <p className="text-muted-foreground">2025-10-02 IST</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Update from OpenData</p>
                  <p className="text-muted-foreground">2025-09-25 IST</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HCPDetail;
