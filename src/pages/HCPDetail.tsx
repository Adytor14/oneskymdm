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
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to HCP List
          </Button>
          
          <div className="flex gap-2 mb-4">
            <ChangeRequestDialog entityType="HCP" entityId={hcp.id} entityData={hcp} />
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
                  <CardTitle className="text-2xl mb-2">
                    Dr. {hcp.firstName} {hcp.lastName}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {hcp.speciality.map((spec) => (
                      <Badge key={spec} variant="secondary" className="bg-white/20 text-white">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className={hcp.status === "Active" ? "bg-success" : "bg-warning"}>
                  {hcp.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="font-semibold">{hcp.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="font-semibold">{hcp.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NPI ID</p>
                    <p className="font-semibold">{hcp.npiId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MDM ID</p>
                    <p className="font-semibold">{hcp.mdmId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organization ID</p>
                    <p className="font-semibold">{hcp.orgId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-semibold">{hcp.source}</p>
                  </div>
                </div>
              </div>
              
              <Separator />

              <div>
                <h3 className="font-semibold mb-3 text-lg">Identifiers</h3>
                <div className="flex gap-2 flex-wrap">
                  {hcp.identifiers.map((id, idx) => (
                    <Badge key={idx} variant="outline">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Organization
                </h3>
                <p>{hcp.organization}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{hcp.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${hcp.email}`} className="text-primary hover:underline font-medium">
                        {hcp.email}
                      </a>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Preferred Contact Methods</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Email</Badge>
                      <Badge variant="outline">Phone</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Address
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">{hcp.address.street}</p>
                  <p className="font-medium">{hcp.address.city}, {hcp.address.state} {hcp.address.zipCode}</p>
                  <p className="font-medium">{hcp.address.country}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Organization</p>
                    <p className="font-medium">{hcp.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                    <div className="flex gap-2 flex-wrap">
                      {hcp.speciality.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Affiliations</p>
                    <div className="space-y-2">
                      {hcp.affiliations.map((affiliation, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Badge key={idx} variant="outline">
                            {affiliation}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {hcp.education.map((edu, idx) => (
                    <div key={idx} className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">{edu.fieldOfStudy}</span>
                        <span className="text-sm font-medium">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Licenses & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Active Licenses</p>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold">Medical License</p>
                      <p className="text-sm text-muted-foreground">{hcp.license}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                  <div className="space-y-1">
                    <p className="text-sm">Board Certified - {hcp.degreeType}</p>
                  </div>
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
                  <p className="font-semibold">{format(new Date(hcp.lastUpdated), "MM/dd/yyyy, HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{format(new Date(hcp.lastUpdated), "MM/dd/yyyy, HH:mm")}</p>
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
