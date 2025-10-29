import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockHCPs, mockHCOs, mockAddresses, mockDCRs } from "@/lib/mockData";
import { Database, Users, Building2, MapPin, FileText, Search, Eye, TrendingUp } from "lucide-react";
import { getOrganizationTheme } from "@/lib/organizationThemes";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hcp");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  
  // Get current organization theme
  const currentTheme = getOrganizationTheme(selectedOrganization);

  const topStats = [
    {
      title: "Total Profiles",
      value: "7,836",
      subtitle: "All profile types",
      icon: Database,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
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
      title: "Address Profiles",
      value: "4,521",

      icon: MapPin,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Data Change Requests",
      value: "342",

      icon: FileText,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const hcpMetrics = [
    { title: "Total Physician Accounts", value: "2,847", bgColor: "bg-blue-50" },
    { title: "Active Physicians", value: "2,683", bgColor: "bg-green-50" },
    { title: "Inactive Physicians", value: "164", bgColor: "bg-gray-50" },
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

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
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
          <TabsTrigger value="address">
            <MapPin className="h-4 w-4 mr-2" />
            Address Profiles
          </TabsTrigger>
          <TabsTrigger value="dcr">
            <FileText className="h-4 w-4 mr-2" />
            Data Change Requests
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

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name, ID, or identifier..." className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Master Data Records Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Profile List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing 2,683 of 2,847 profiles
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
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHCPs
                      .filter((record) => record.status === "Active")
                      .slice(0, 10)
                      .map((record, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigate(`/hcp/${record.id}`)}
                        >
                          <td className="py-3 px-4">
                            Dr. {record.firstName} {record.lastName}
                          </td>
                          <td className="py-3 px-4 text-sm">{record.orgId}</td>
                          <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                          <td className="py-3 px-4 text-sm">{record.identifiers.join(", ")}</td>
                          <td className="py-3 px-4">
                             <Badge
                               style={{
                                 backgroundColor: record.status === "Active" 
                                   ? currentTheme.colors.primary 
                                   : "hsl(0, 0%, 60%)",
                                 color: "white"
                               }}
                             >
                               {record.status}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hco" className="space-y-4">
          {/* HCO Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Profile List</CardTitle>
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
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHCOs
                      .filter((record) => record.status === "Active")
                      .slice(0, 10)
                      .map((record, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigate(`/hco/${record.id}`)}
                        >
                          <td className="py-3 px-4">{record.name}</td>
                          <td className="py-3 px-4 text-sm">{record.orgId}</td>
                          <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                          <td className="py-3 px-4 text-sm">NPI-{record.mdmId.slice(-6)}</td>
                           <td className="py-3 px-4">
                             <Badge
                               style={{
                                 backgroundColor: record.status === "Active" 
                                   ? currentTheme.colors.primary 
                                   : "hsl(0, 0%, 60%)",
                                 color: "white"
                               }}
                             >
                               {record.status}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          {/* Address Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Address Master Data</CardTitle>
                <p className="text-sm text-muted-foreground">Showing 4,521 profiles</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Address</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">City</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">State</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">ZIP Code</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Skyra MDM ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAddresses.slice(0, 10).map((record, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/address/${record.id}`)}
                      >
                        <td className="py-3 px-4">{record.street}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">Address</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{record.city}</td>
                        <td className="py-3 px-4 text-sm">{record.state}</td>
                        <td className="py-3 px-4 text-sm">{record.zipCode}</td>
                        <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                         <td className="py-3 px-4">
                           <Badge
                             style={{
                               backgroundColor: record.status === "Active" 
                                 ? currentTheme.colors.primary 
                                 : "hsl(0, 0%, 60%)",
                               color: "white"
                             }}
                           >
                             {record.status}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dcr" className="space-y-4">
          {/* DCR Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Data Change Requests Master Data</CardTitle>
                <p className="text-sm text-muted-foreground">Showing 342 change requests</p>
              </div>
            </CardHeader>
            <CardContent>
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
                    {mockDCRs.slice(0, 10).map((record, index) => (
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
                             style={{
                               backgroundColor: record.status === "Active" 
                                 ? currentTheme.colors.primary 
                                 : "hsl(0, 0%, 60%)",
                               color: "white"
                             }}
                           >
                             {record.status}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
