import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from "lucide-react";
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
      <div className="container mx-auto p-6 space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/hco")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{hco.name}</h1>
                <Badge variant="secondary">Facility Account</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{hco.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{hco.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>FACILITY TYPE: {hco.organizationType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{hco.address.street}, {hco.address.city}, {hco.address.state} {hco.address.zipCode}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              Export to Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              Export to PDF
            </Button>
          </div>
        </div>

        {/* Primary Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Primary Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Facility Name</p>
                <p className="font-semibold">{hco.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">NPI</p>
                <p className="font-semibold">{hco.npiId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">CMS Provider Number</p>
                <p className="font-semibold">100234</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Facility Type</p>
                <p className="font-semibold">{hco.organizationType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-semibold">{hco.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-semibold">{hco.address.street}, {hco.address.city}, {hco.address.state} {hco.address.zipCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Medical Director NPI</p>
                <p className="font-semibold">1578137394</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Owner NPI</p>
                <p className="font-semibold">9876543210</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Primary</Badge>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              <p className="font-semibold mb-1">{hco.address.street}, {hco.address.city}, {hco.address.state} {hco.address.zipCode}</p>
              <p className="text-sm text-muted-foreground">Business Address</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Mailing</Badge>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              <p className="font-semibold mb-1">P.O. Box 5200, {hco.address.city}, {hco.address.state} 34239</p>
              <p className="text-sm text-muted-foreground">Mailing Address</p>
            </div>
          </CardContent>
        </Card>

        {/* Identifiers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Skyra MDM ID</span>
              <span className="font-medium">{hco.mdmId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">ORG ID</span>
              <span className="font-medium">{hco.orgId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">NPI</span>
              <span className="font-medium">{hco.npiId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">CMS Provider Number</span>
              <span className="font-medium">100234</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Source</span>
              <span className="font-medium">{hco.source}</span>
            </div>
          </CardContent>
        </Card>

        {/* Specialities */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Specialities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">Primary</Badge>
              <h4 className="font-semibold mb-1">Acute Care Hospital</h4>
              <p className="text-sm text-muted-foreground">Comprehensive medical and surgical services</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">Secondary</Badge>
              <h4 className="font-semibold mb-1">Cardiac Care Center</h4>
              <p className="text-sm text-muted-foreground">Specialized cardiac procedures and treatments</p>
            </div>
          </CardContent>
        </Card>

        {/* Licenses */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Florida State Hospital License</h4>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">License Number:</p>
                  <p className="font-medium">FL-H-12345</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">State:</p>
                  <p className="font-medium">Florida</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issue Date:</p>
                  <p className="font-medium">2020-01-15</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expiry Date:</p>
                  <p className="font-medium">2026-01-15</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accreditation */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Accreditation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">The Joint Commission</h4>
                <Badge className="bg-success text-white">Accredited</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Accreditation ID:</p>
                  <p className="font-medium">TJC-123456</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status:</p>
                  <p className="font-medium">Active</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issue Date:</p>
                  <p className="font-medium">2021-03-10</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expiry Date:</p>
                  <p className="font-medium">2024-03-10</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">CMS Certification</h4>
                <Badge className="bg-success text-white">Certified</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Certification Number:</p>
                  <p className="font-medium">100234</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status:</p>
                  <p className="font-medium">Active</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issue Date:</p>
                  <p className="font-medium">2020-06-15</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expiry Date:</p>
                  <p className="font-medium">2025-06-15</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliated Physicians - Source Derived */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Affiliated Physicians - Source Derived (2 active)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Dr. Zeina M Kayali</h4>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">NPI:</p>
                  <p className="font-medium">1578137394</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Specialty:</p>
                  <p className="font-medium">Cardiology</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role:</p>
                  <p className="font-medium">Attending Physician</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department:</p>
                  <p className="font-medium">Cardiology</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Effective Date:</p>
                  <p className="font-medium">2015-03-01</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">NPI:</p>
                  <p className="font-medium">1234567892</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Specialty:</p>
                  <p className="font-medium">Neurology</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role:</p>
                  <p className="font-medium">Attending Physician</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department:</p>
                  <p className="font-medium">Neurology</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Effective Date:</p>
                  <p className="font-medium">2018-02-20</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliated Physicians - Field Intelligence */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Affiliated Physicians - Field Intelligence (1 active)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Dr. John Smith</h4>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">NPI:</p>
                  <p className="font-medium">1234567891</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Specialty:</p>
                  <p className="font-medium">Internal Medicine</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role:</p>
                  <p className="font-medium">Consulting Physician</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department:</p>
                  <p className="font-medium">Internal Medicine</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Effective Date:</p>
                  <p className="font-medium">2016-08-15</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality & Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quality & Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">CMS Care Compare Metrics</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Star Rating</p>
                  <p className="text-5xl font-bold text-primary mb-1">4.5</p>
                  <p className="text-xs text-muted-foreground">out of 5</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Quality Score</p>
                  <p className="text-5xl font-bold text-success mb-1">92</p>
                  <p className="text-xs text-muted-foreground">CMS Score</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">Additional Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Patient Safety Rating</span>
                  <span className="font-semibold">A</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Readmission Rate</span>
                  <span className="font-semibold">12.3%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                  <span className="font-semibold">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HCODetail;
