import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Building2, Download } from "lucide-react";
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mb-4">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportExcel}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                Export to JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">NPI ID</p>
                  <p className="font-semibold">{hcp.npiId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MDM ID</p>
                  <p className="font-semibold">{hcp.mdmId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Org ID</p>
                  <p className="font-semibold">{hcp.orgId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">License</p>
                  <p className="font-semibold">{hcp.license}</p>
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
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${hcp.email}`} className="text-primary hover:underline">
                      {hcp.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{hcp.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p>{hcp.address.street}</p>
                      <p>
                        {hcp.address.city}, {hcp.address.state} {hcp.address.zipCode}
                      </p>
                      <p>{hcp.address.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Preferred Contact:</span>
                    <Badge variant="outline">{hcp.preferredContact}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {hcp.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-4">
                      <p className="font-semibold">{edu.degree} - {edu.fieldOfStudy}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">Class of {edu.year}</p>
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
                <CardTitle className="text-lg">Identifiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hcp.identifiers.map((id, idx) => (
                    <Badge key={idx} variant="outline" className="w-full justify-start">
                      {id}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Affiliations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hcp.affiliations.map((affiliation, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{affiliation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Source System</p>
                  <p className="font-semibold">{hcp.source}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{hcp.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Degree Type</p>
                  <p className="font-semibold">{hcp.degreeType}</p>
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
