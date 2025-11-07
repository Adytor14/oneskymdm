import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockHCPs, mockHCOs, mockAddresses, mockDCRs } from "@/lib/mockData";
import { Database, Users, Building2, MapPin, FileText, Search, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getOrganizationTheme } from "@/lib/organizationThemes";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hcp");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  
  // Get current organization theme
  const currentTheme = getOrganizationTheme(selectedOrganization);

  const topStats = [
    {
      title: "Physician Accounts",
      value: "2,847",
      subtitle: "Healthcare professionals",
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Facility Accounts",
      value: "468",
      subtitle: "Healthcare organizations",
      icon: Building2,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Distinct Patient Counts",
      value: "4,521",
      subtitle: "All distinct",
      icon: MapPin,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Census Growth",
      value: "342",
      subtitle: "Population increase",
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const hcpMetrics = [
    { title: "Total Physician Accounts", value: "2,847", bgColor: "bg-blue-50" },
    { title: "Distinct Patients", value: "2,683", bgColor: "bg-green-50" },
    { title: "Growth", value: "6.1%", bgColor: "bg-gray-50" },
  ];

  const masterDataRecords = [
    {
      name: "Dr. Sarah Johnson",
      type: "HCP",
      orgId: "ORG-12345",
      mdmId: "MDM-HCP-001",
      identifiers: "NPI-123456789, DEA-AB1234567",
      status: "Active",
      source: "NPPES",
      lastUpdated: "15/01/2024",
    },
    {
      name: "Memorial Hospital",
      type: "HCO",
      orgId: "ORG-67890",
      mdmId: "MDM-HCO-001",
      identifiers: "NPI-987654321",
      status: "Active",
      source: "CMS",
      lastUpdated: "14/01/2024",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Branded Header Band */}
      <div 
        className="rounded-lg p-6 shadow-lg mb-6"
        style={{ 
          background: currentTheme.colors.headerBg,
          color: currentTheme.colors.headerText
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={currentTheme.logo} 
              alt={`${currentTheme.name} Logo`}
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold">{currentTheme.name}</h1>
              <p className="mt-1 opacity-90">{currentTheme.tagline}</p>
            </div>
          </div>
          
          {/* Organization Filter */}
          <div className="space-y-2 w-64">
            <label className="text-sm font-medium">Organization</label>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger className="bg-white text-foreground">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="reliant">Reliant</SelectItem>
                <SelectItem value="opuscare">Opuscare</SelectItem>
                <SelectItem value="choice">Choice</SelectItem>
                <SelectItem value="jethealth">Jethealth</SelectItem>
                <SelectItem value="skyra">Skyra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filters for Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Filters for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                  <SelectItem value="il">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Counties</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  <SelectItem value="kings">Kings County</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles County</SelectItem>
                  <SelectItem value="harris">Harris County</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP</label>
              <Input placeholder="Enter ZIP code" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time (Quarters)</label>
              <Select defaultValue="q4-2024">
                <SelectTrigger>
                  <SelectValue placeholder="Select Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="q3-2024">Q3 2024</SelectItem>
                  <SelectItem value="q2-2024">Q2 2024</SelectItem>
                  <SelectItem value="q1-2024">Q1 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payer Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Payers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payers</SelectItem>
                  <SelectItem value="medicare">Medicare</SelectItem>
                  <SelectItem value="medicaid">Medicaid</SelectItem>
                  <SelectItem value="private">Private Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {topStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              style={{ backgroundColor: currentTheme.colors.cardBg }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon 
                  className="h-4 w-4" 
                  style={{ color: currentTheme.colors.iconColor }}
                />
              </CardHeader>
              <CardContent>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList 
          style={{ backgroundColor: currentTheme.colors.cardBg }}
        >
          <TabsTrigger value="hcp" className="data-[state=active]:bg-white">
            <Users className="h-4 w-4 mr-2" />
            Physician Accounts
          </TabsTrigger>
          <TabsTrigger value="hco">
            <Building2 className="h-4 w-4 mr-2" />
            Facility Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hcp" className="space-y-4">
          {/* HCP Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            {hcpMetrics.map((metric, index) => (
              <Card 
                key={index} 
                style={{ backgroundColor: currentTheme.colors.cardBg }}
              >
                <CardHeader className="pb-2">
                  <CardTitle 
                    className="text-xl font-bold"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    {metric.value}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Physician Accounts Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Physician Accounts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing 13 of 15 profiles
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">NPI</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">City</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">State</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">One ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Speciality</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Sub Speciality</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Assigned Identifiers</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Distinct Patients count</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Growth %</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Addressable count</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Push</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHCPs
                      .filter((record) => record.status === "Active")
                      .slice(0, 10)
                      .map((record, index) => {
                        // Mock data for new columns
                        const npiId = `12345${6789 + index}0`;
                        const city = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5];
                        const state = ["NY", "CA", "IL", "TX", "AZ"][index % 5];
                        const subSpeciality = record.speciality[0] === "Cardiology" ? "Interventional" : "General";
                        const distinctPatients = Math.floor(Math.random() * 500) + 100;
                        const growth = Math.floor(Math.random() * 20) + 1;
                        const addressableCount = Math.floor(Math.random() * 300) + 50;
                        
                        return (
                          <tr
                            key={index}
                            className="border-b hover:bg-muted/50"
                          >
                          <td className="py-3 px-4">
                            Dr. {record.firstName} {record.lastName}
                          </td>
                          <td className="py-3 px-4 text-sm">{npiId}</td>
                          <td className="py-3 px-4 text-sm">{city}</td>
                            <td className="py-3 px-4 text-sm">{state}</td>
                            <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                            <td className="py-3 px-4 text-sm">{record.speciality[0]}</td>
                            <td className="py-3 px-4 text-sm">{subSpeciality}</td>
                            <td className="py-3 px-4 text-sm">{record.identifiers.join(", ")}</td>
                            <td className="py-3 px-4 text-sm font-medium">{distinctPatients}</td>
                            <td className="py-3 px-4 text-sm text-green-600 font-medium">{growth}%</td>
                            <td className="py-3 px-4 text-sm font-medium">{addressableCount}</td>
                            <td className="py-3 px-4">
                              <Eye 
                                className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                                onClick={() => navigate(`/hcp/${record.id}`)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 px-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Push initiated",
                                    description: `Pushing data for Dr. ${record.firstName} ${record.lastName}`,
                                  });
                                }}
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hco" className="space-y-4">
          {/* HCO Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Facility Accounts Master Data</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing 441 of 468 profiles
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Org ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Skyra MDM ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Identifiers</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Distinct Patients count</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Growth %</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Addressable count</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHCOs
                      .filter((record) => record.status === "Active")
                      .slice(0, 10)
                      .map((record, index) => {
                        // Mock data for new columns
                        const distinctPatients = Math.floor(Math.random() * 2000) + 500;
                        const growth = Math.floor(Math.random() * 25) + 5;
                        const addressableCount = Math.floor(Math.random() * 1000) + 200;
                        
                        return (
                          <tr
                            key={index}
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => navigate(`/hco/${record.id}`)}
                          >
                            <td className="py-3 px-4">{record.name}</td>
                            <td className="py-3 px-4 text-sm">{record.orgId}</td>
                            <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                            <td className="py-3 px-4 text-sm">NPI-{record.mdmId.slice(-6)}</td>
                            <td className="py-3 px-4 text-sm font-medium">{distinctPatients}</td>
                            <td className="py-3 px-4 text-sm text-green-600 font-medium">{growth}%</td>
                            <td className="py-3 px-4 text-sm font-medium">{addressableCount}</td>
                            <td className="py-3 px-4">
                              <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
