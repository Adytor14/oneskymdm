import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockHCPs, mockHCOs, mockAddresses, mockDCRs } from "@/lib/mockData";
import { Database, Users, Building2, MapPin, FileText, Search, Eye, TrendingUp, ArrowUpRight, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getOrganizationTheme } from "@/lib/organizationThemes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hcp");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  
  // Filter states
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([]);
  const [selectedPayers, setSelectedPayers] = useState<string[]>([]);
  
  // Get current organization theme
  const currentTheme = getOrganizationTheme(selectedOrganization);
  
  // Filter options
  const states = [
    { value: "ny", label: "New York" },
    { value: "ca", label: "California" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
    { value: "il", label: "Illinois" },
  ];
  
  const counties = [
    { value: "kings", label: "Kings County" },
    { value: "los-angeles", label: "Los Angeles County" },
    { value: "harris", label: "Harris County" },
    { value: "miami-dade", label: "Miami-Dade County" },
    { value: "cook", label: "Cook County" },
  ];
  
  const quarters = [
    { value: "q4-2024", label: "Q4 2024" },
    { value: "q3-2024", label: "Q3 2024" },
    { value: "q2-2024", label: "Q2 2024" },
    { value: "q1-2024", label: "Q1 2024" },
  ];
  
  const payers = [
    { value: "medicare", label: "Medicare" },
    { value: "medicaid", label: "Medicaid" },
    { value: "private", label: "Private Insurance" },
    { value: "commercial", label: "Commercial" },
  ];
  
  const toggleSelection = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedStates.length === 0
                      ? "All States"
                      : `${selectedStates.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover z-50" align="start">
                  <div className="max-h-64 overflow-auto p-2">
                    {states.map((state) => (
                      <div
                        key={state.value}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => toggleSelection(state.value, selectedStates, setSelectedStates)}
                      >
                        <Checkbox
                          checked={selectedStates.includes(state.value)}
                          onCheckedChange={() => toggleSelection(state.value, selectedStates, setSelectedStates)}
                        />
                        <label className="flex-1 cursor-pointer">{state.label}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Counties</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedCounties.length === 0
                      ? "All Counties"
                      : `${selectedCounties.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover z-50" align="start">
                  <div className="max-h-64 overflow-auto p-2">
                    {counties.map((county) => (
                      <div
                        key={county.value}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => toggleSelection(county.value, selectedCounties, setSelectedCounties)}
                      >
                        <Checkbox
                          checked={selectedCounties.includes(county.value)}
                          onCheckedChange={() => toggleSelection(county.value, selectedCounties, setSelectedCounties)}
                        />
                        <label className="flex-1 cursor-pointer">{county.label}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP</label>
              <Input placeholder="Enter ZIP code" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time (Quarters)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedQuarters.length === 0
                      ? "All Quarters"
                      : `${selectedQuarters.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover z-50" align="start">
                  <div className="max-h-64 overflow-auto p-2">
                    {quarters.map((quarter) => (
                      <div
                        key={quarter.value}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => toggleSelection(quarter.value, selectedQuarters, setSelectedQuarters)}
                      >
                        <Checkbox
                          checked={selectedQuarters.includes(quarter.value)}
                          onCheckedChange={() => toggleSelection(quarter.value, selectedQuarters, setSelectedQuarters)}
                        />
                        <label className="flex-1 cursor-pointer">{quarter.label}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payer Type</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedPayers.length === 0
                      ? "All Payers"
                      : `${selectedPayers.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover z-50" align="start">
                  <div className="max-h-64 overflow-auto p-2">
                    {payers.map((payer) => (
                      <div
                        key={payer.value}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => toggleSelection(payer.value, selectedPayers, setSelectedPayers)}
                      >
                        <Checkbox
                          checked={selectedPayers.includes(payer.value)}
                          onCheckedChange={() => toggleSelection(payer.value, selectedPayers, setSelectedPayers)}
                        />
                        <label className="flex-1 cursor-pointer">{payer.label}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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
