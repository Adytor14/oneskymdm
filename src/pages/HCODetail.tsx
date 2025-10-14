import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockHCOs } from "@/lib/mockData";

const HCODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hco = mockHCOs.find((h) => h.id === id);

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
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2 shadow-elevated">
            <CardHeader className="bg-gradient-primary text-primary-foreground">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{hco.name}</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {hco.organizationType}
                  </Badge>
                </div>
                <Badge className={hco.status === "Active" ? "bg-success" : "bg-warning"}>
                  {hco.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">NPI ID</p>
                  <p className="font-semibold">{hco.npiId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MDM ID</p>
                  <p className="font-semibold">{hco.mdmId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Org ID</p>
                  <p className="font-semibold">{hco.orgId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{hco.organizationType}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${hco.email}`} className="text-primary hover:underline">
                      {hco.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{hco.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p>{hco.address.street}</p>
                      <p>
                        {hco.address.city}, {hco.address.state} {hco.address.zipCode}
                      </p>
                      <p>{hco.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Departments
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {hco.departments.map((dept, idx) => (
                    <Badge key={idx} variant="outline">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Affiliated HCPs
                </h3>
                <p className="text-muted-foreground">
                  {hco.affiliatedHCPs.length} healthcare professionals affiliated
                </p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {hco.affiliatedHCPs.map((hcpId, idx) => (
                    <Badge key={idx} variant="secondary">
                      {hcpId}
                    </Badge>
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
                  {hco.identifiers.map((id, idx) => (
                    <Badge key={idx} variant="outline" className="w-full justify-start">
                      {id}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Accreditation</CardTitle>
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

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Source System</p>
                  <p className="font-semibold">{hco.source}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{hco.lastUpdated}</p>
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
