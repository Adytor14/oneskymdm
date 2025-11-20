import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockHCPs, mockHCOs, mockAddresses, mockDCRs } from "@/lib/mockData";
import {
  Database,
  Users,
  Building2,
  MapPin,
  FileText,
  Search,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Check,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown as ArrowUpDown,
  Download,
  FileSpreadsheet,
  X,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getOrganizationTheme } from "@/lib/organizationThemes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { exportToExcel } from "@/lib/exportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // Sorting states for HCP
  const [hcpSortColumn, setHcpSortColumn] = useState<string | null>(null);
  const [hcpSortDirection, setHcpSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination states for HCP
  const [hcpCurrentPage, setHcpCurrentPage] = useState(1);
  const [hcpRowsPerPage, setHcpRowsPerPage] = useState(10);

  // Sorting states for HCO
  const [hcoSortColumn, setHcoSortColumn] = useState<string | null>(null);
  const [hcoSortDirection, setHcoSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination states for HCO
  const [hcoCurrentPage, setHcoCurrentPage] = useState(1);
  const [hcoRowsPerPage, setHcoRowsPerPage] = useState(10);

  // Search states
  const [hcpSearchQuery, setHcpSearchQuery] = useState("");
  const [hcoSearchQuery, setHcoSearchQuery] = useState("");

  // Row selection states
  const [selectedHcpRows, setSelectedHcpRows] = useState<string[]>([]);
  const [selectedHcoRows, setSelectedHcoRows] = useState<string[]>([]);

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
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Sorting handler for HCP table
  const handleHcpSort = (column: string) => {
    if (hcpSortColumn === column) {
      setHcpSortDirection(hcpSortDirection === "asc" ? "desc" : "asc");
    } else {
      setHcpSortColumn(column);
      setHcpSortDirection("asc");
    }
    setHcpCurrentPage(1); // Reset to first page on sort
  };

  // Sorting handler for HCO table
  const handleHcoSort = (column: string) => {
    if (hcoSortColumn === column) {
      setHcoSortDirection(hcoSortDirection === "asc" ? "desc" : "asc");
    } else {
      setHcoSortColumn(column);
      setHcoSortDirection("asc");
    }
    setHcoCurrentPage(1); // Reset to first page on sort
  };

  // Sort icon component
  const SortIcon = ({
    column,
    currentColumn,
    direction,
  }: {
    column: string;
    currentColumn: string | null;
    direction: "asc" | "desc";
  }) => {
    if (currentColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
    }
    return direction === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1 inline" />
    );
  };

  // Clear all filters function
  const handleClearFilters = () => {
    setSelectedStates([]);
    setSelectedCounties([]);
    setSelectedQuarters([]);
    setSelectedPayers([]);
    setHcpSearchQuery("");
    setHcoSearchQuery("");
    setHcpCurrentPage(1);
    setHcoCurrentPage(1);
    toast({
      title: "Filters cleared",
      description: "All filters and search queries have been reset",
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedStates.length > 0 ||
    selectedCounties.length > 0 ||
    selectedQuarters.length > 0 ||
    selectedPayers.length > 0 ||
    hcpSearchQuery.length > 0 ||
    hcoSearchQuery.length > 0;

  // Row selection handlers for HCP
  const handleSelectAllHcp = (checked: boolean, filteredData: any[]) => {
    if (checked) {
      setSelectedHcpRows(filteredData.map((row) => row.id));
    } else {
      setSelectedHcpRows([]);
    }
  };

  const handleSelectHcpRow = (id: string) => {
    setSelectedHcpRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Row selection handlers for HCO
  const handleSelectAllHco = (checked: boolean, filteredData: any[]) => {
    if (checked) {
      setSelectedHcoRows(filteredData.map((row) => row.id));
    } else {
      setSelectedHcoRows([]);
    }
  };

  const handleSelectHcoRow = (id: string) => {
    setSelectedHcoRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Export handlers
  const handleHcpExport = (format: "excel" | "json" | "pdf") => {
    const activeRecords = mockHCPs.filter((record) => record.status === "Active");
    const preparedData = activeRecords.map((record, index) => ({
      ...record,
      npiId: `12345${6789 + index}0`,
      city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
      state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
      subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
      assignedAccounts: `EMR-${String(index + 1).padStart(6, "0")}`,
      distinctPatients: Math.floor(Math.random() * 500) + 100,
      growth: Math.floor(Math.random() * 20) + 1,
      addressableCount: Math.floor(Math.random() * 300) + 50,
    }));

    const selectedData = preparedData.filter((record) => selectedHcpRows.includes(record.id));

    if (selectedData.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to export",
        variant: "destructive",
      });
      return;
    }

    try {
      if (format === "excel") {
        const exportData = selectedData.map((record) => ({
          Name: `${record.firstName} ${record.lastName}`,
          NPI: record.npiId,
          City: record.city,
          State: record.state,
          "One ID": record.mdmId,
          Speciality: record.speciality[0],
          "Sub Speciality": record.subSpeciality,
          "Assigned Accounts": record.assignedAccounts,
          "Distinct Patients": record.distinctPatients,
          "Growth %": record.growth,
          "Addressable Count": record.addressableCount,
        }));
        exportToExcel(exportData, "physician_accounts.xlsx");
      } else if (format === "json") {
        const dataStr = JSON.stringify(selectedData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "physician_accounts.json";
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        const doc = new jsPDF();
        doc.text("Physician Accounts", 14, 15);
        autoTable(doc, {
          head: [["Name", "NPI", "City", "State", "One ID", "Speciality", "Sub Speciality"]],
          body: selectedData.map((record) => [
            `${record.firstName} ${record.lastName}`,
            record.npiId,
            record.city,
            record.state,
            record.mdmId,
            record.speciality[0],
            record.subSpeciality,
          ]),
          startY: 20,
        });
        doc.save("physician_accounts.pdf");
      }

      toast({
        title: "Export successful",
        description: `${selectedData.length} records exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  const handleHcoExport = (format: "excel" | "json" | "pdf") => {
    const activeRecords = mockHCOs.filter((record) => record.status === "Active");
    const preparedData = activeRecords.map((record, index) => ({
      ...record,
      distinctPatients: Math.floor(Math.random() * 2000) + 500,
      growth: Math.floor(Math.random() * 25) + 5,
      addressableCount: Math.floor(Math.random() * 1000) + 200,
    }));

    const selectedData = preparedData.filter((record) => selectedHcoRows.includes(record.id));

    if (selectedData.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to export",
        variant: "destructive",
      });
      return;
    }

    try {
      if (format === "excel") {
        const exportData = selectedData.map((record) => ({
          Name: record.name,
          "Org ID": record.orgId,
          "One ID": record.mdmId,
          "Distinct Patients": record.distinctPatients,
          "Growth %": record.growth,
          "Addressable Count": record.addressableCount,
        }));
        exportToExcel(exportData, "facility_accounts.xlsx");
      } else if (format === "json") {
        const dataStr = JSON.stringify(selectedData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "facility_accounts.json";
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        const doc = new jsPDF();
        doc.text("Facility Accounts", 14, 15);
        autoTable(doc, {
          head: [["Name", "Org ID", "One ID", "Distinct Patients", "Growth %"]],
          body: selectedData.map((record) => [
            record.name,
            record.orgId,
            record.mdmId,
            record.distinctPatients,
            record.growth,
          ]),
          startY: 20,
        });
        doc.save("facility_accounts.pdf");
      }

      toast({
        title: "Export successful",
        description: `${selectedData.length} records exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
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

  const hcoMetrics = [
    { title: "Total Facility Accounts", value: "1,324", bgColor: "bg-blue-50" },
    { title: "Active Facilities", value: "1,198", bgColor: "bg-green-50" },
    { title: "Growth", value: "4.3%", bgColor: "bg-gray-50" },
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
          color: currentTheme.colors.headerText,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={currentTheme.logo} alt={`${currentTheme.name} Logo`} className="h-16 w-auto object-contain" />
            <div>
              <h1 className="text-3xl font-bold">{currentTheme.name}</h1>
              <p className="mt-1 opacity-90">{currentTheme.tagline}</p>
            </div>
          </div>

          {/* Organization Filter */}
          <div className="space-y-2 w-64">
            <label className="text-sm font-medium">Select Organization</label>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Filters for Analysis
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {/* State Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {selectedStates.length === 0 ? "All States" : `${selectedStates.length} selected`}
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

            {/* Counties Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Counties</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {selectedCounties.length === 0 ? "All Counties" : `${selectedCounties.length} selected`}
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

            {/* ZIP Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP</label>
              <Input placeholder="Enter ZIP code" />
            </div>

            {/* Time (Quarters) Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time (Quarters)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {selectedQuarters.length === 0 ? "All Quarters" : `${selectedQuarters.length} selected`}
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

            {/* Payer Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payer Type</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {selectedPayers.length === 0 ? "All Payers" : `${selectedPayers.length} selected`}
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
            <Card key={index} style={{ backgroundColor: currentTheme.colors.cardBg }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4" style={{ color: currentTheme.colors.iconColor }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
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
        <TabsList style={{ backgroundColor: currentTheme.colors.cardBg }}>
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
              <Card key={index} style={{ backgroundColor: currentTheme.colors.cardBg }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold" style={{ color: currentTheme.colors.primary }}>
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
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg">Physician Accounts</CardTitle>
                <div className="flex items-center gap-2">
                  {selectedHcpRows.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Selected ({selectedHcpRows.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleHcpExport("excel")}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export as Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHcpExport("json")}>
                          <FileJson className="h-4 w-4 mr-2" />
                          Export as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHcpExport("pdf")}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                      const preparedData = activeRecords.map((record, index) => {
                        const npiId = `12345${6789 + index}0`;
                        const city = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5];
                        const state = ["NY", "CA", "IL", "TX", "AZ"][index % 5];
                        const subSpeciality = record.speciality[0] === "Cardiology" ? "Interventional" : "General";
                        const distinctPatients = Math.floor(Math.random() * 500) + 100;
                        const growth = Math.floor(Math.random() * 20) + 1;
                        const addressableCount = Math.floor(Math.random() * 300) + 50;

                        return {
                          ...record,
                          Name: `${record.firstName} ${record.lastName}`,
                          NPI: npiId,
                          City: city,
                          State: state,
                          "One ID": record.mdmId,
                          Speciality: record.speciality[0],
                          "Sub Speciality": subSpeciality,
                          "Assigned Identifiers": record.identifiers.join(", "),
                          "Distinct Patients": distinctPatients,
                          "Growth %": `${growth}%`,
                          "Addressable Count": addressableCount,
                        };
                      });

                      // Filter by selected rows if any are selected
                      const dataToExport = selectedHcpRows.length > 0 
                        ? preparedData.filter(record => selectedHcpRows.includes(record.id))
                        : preparedData;

                      exportToExcel(dataToExport, `Physician_Accounts_${new Date().toISOString().split("T")[0]}`);
                      toast({
                        title: "Export successful",
                        description: `${dataToExport.length} physician account(s) exported to Excel`,
                      });
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export to Excel {selectedHcpRows.length > 0 && `(${selectedHcpRows.length})`}
                  </Button>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, NPI, city, specialty..."
                  value={hcpSearchQuery}
                  onChange={(e) => {
                    setHcpSearchQuery(e.target.value);
                    setHcpCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">
                        <Checkbox
                          checked={(() => {
                            const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                            const preparedData = activeRecords.map((record, index) => ({
                              ...record,
                              npiId: `12345${6789 + index}0`,
                              city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                              state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                              subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                            }));

                            let filteredData = preparedData;
                            if (hcpSearchQuery) {
                              const query = hcpSearchQuery.toLowerCase();
                              filteredData = preparedData.filter((record) => {
                                const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
                                const npi = record.npiId.toLowerCase();
                                const city = record.city.toLowerCase();
                                const state = record.state.toLowerCase();
                                const specialty = record.speciality[0].toLowerCase();
                                const subSpecialty = record.subSpeciality.toLowerCase();

                                return (
                                  name.includes(query) ||
                                  npi.includes(query) ||
                                  city.includes(query) ||
                                  state.includes(query) ||
                                  specialty.includes(query) ||
                                  subSpecialty.includes(query)
                                );
                              });
                            }

                            const startIndex = (hcpCurrentPage - 1) * hcpRowsPerPage;
                            const paginatedData = filteredData.slice(startIndex, startIndex + hcpRowsPerPage);
                            return paginatedData.length > 0 && selectedHcpRows.length === paginatedData.length;
                          })()}
                          onCheckedChange={(checked) => {
                            const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                            const preparedData = activeRecords.map((record, index) => ({
                              ...record,
                              npiId: `12345${6789 + index}0`,
                              city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                              state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                              subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                            }));

                            let filteredData = preparedData;
                            if (hcpSearchQuery) {
                              const query = hcpSearchQuery.toLowerCase();
                              filteredData = preparedData.filter((record) => {
                                const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
                                const npi = record.npiId.toLowerCase();
                                const city = record.city.toLowerCase();
                                const state = record.state.toLowerCase();
                                const specialty = record.speciality[0].toLowerCase();
                                const subSpecialty = record.subSpeciality.toLowerCase();

                                return (
                                  name.includes(query) ||
                                  npi.includes(query) ||
                                  city.includes(query) ||
                                  state.includes(query) ||
                                  specialty.includes(query) ||
                                  subSpecialty.includes(query)
                                );
                              });
                            }

                            const startIndex = (hcpCurrentPage - 1) * hcpRowsPerPage;
                            const paginatedData = filteredData.slice(startIndex, startIndex + hcpRowsPerPage);
                            handleSelectAllHcp(checked as boolean, paginatedData);
                          }}
                        />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("name")}
                      >
                        Name
                        <SortIcon column="name" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("npi")}
                      >
                        NPI
                        <SortIcon column="npi" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("city")}
                      >
                        City
                        <SortIcon column="city" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("state")}
                      >
                        State
                        <SortIcon column="state" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("mdmId")}
                      >
                        One ID
                        <SortIcon column="mdmId" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("speciality")}
                      >
                        Speciality
                        <SortIcon column="speciality" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("subSpeciality")}
                      >
                        Sub Speciality
                        <SortIcon column="subSpeciality" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("assignedAccounts")}
                      >
                        Assigned Accounts
                        <SortIcon
                          column="assignedAccounts"
                          currentColumn={hcpSortColumn}
                          direction={hcpSortDirection}
                        />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("distinctPatients")}
                      >
                        Distinct Patients count
                        <SortIcon
                          column="distinctPatients"
                          currentColumn={hcpSortColumn}
                          direction={hcpSortDirection}
                        />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("growth")}
                      >
                        Growth %
                        <SortIcon column="growth" currentColumn={hcpSortColumn} direction={hcpSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcpSort("addressableCount")}
                      >
                        Addressable count
                        <SortIcon
                          column="addressableCount"
                          currentColumn={hcpSortColumn}
                          direction={hcpSortDirection}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Push</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const activeRecords = mockHCPs.filter((record) => record.status === "Active");

                      // Prepare data with computed columns
                      const preparedData = activeRecords.map((record, index) => ({
                        ...record,
                        npiId: `12345${6789 + index}0`,
                        city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                        state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                        subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                        assignedAccounts: `EMR-${String(index + 1).padStart(6, "0")}`,
                        distinctPatients: Math.floor(Math.random() * 500) + 100,
                        growth: Math.floor(Math.random() * 20) + 1,
                        addressableCount: Math.floor(Math.random() * 300) + 50,
                      }));

                      // Filter data based on search query
                      let filteredData = preparedData;
                      if (hcpSearchQuery) {
                        const query = hcpSearchQuery.toLowerCase();
                        filteredData = preparedData.filter((record) => {
                          const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
                          const npi = record.npiId.toLowerCase();
                          const city = record.city.toLowerCase();
                          const state = record.state.toLowerCase();
                          const specialty = record.speciality[0].toLowerCase();
                          const subSpecialty = record.subSpeciality.toLowerCase();

                          return (
                            name.includes(query) ||
                            npi.includes(query) ||
                            city.includes(query) ||
                            state.includes(query) ||
                            specialty.includes(query) ||
                            subSpecialty.includes(query)
                          );
                        });
                      }

                      // Sort data
                      let sortedData = [...filteredData];
                      if (hcpSortColumn) {
                        sortedData.sort((a: any, b: any) => {
                          let aVal = a[hcpSortColumn];
                          let bVal = b[hcpSortColumn];

                          // Handle name sorting
                          if (hcpSortColumn === "name") {
                            aVal = `${a.firstName} ${a.lastName}`;
                            bVal = `${b.firstName} ${b.lastName}`;
                          }

                          // Handle speciality sorting
                          if (hcpSortColumn === "speciality") {
                            aVal = a.speciality[0];
                            bVal = b.speciality[0];
                          }

                          // Handle npi sorting
                          if (hcpSortColumn === "npi") {
                            aVal = a.npiId;
                            bVal = b.npiId;
                          }

                          if (typeof aVal === "string" && typeof bVal === "string") {
                            return hcpSortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                          }

                          return hcpSortDirection === "asc" ? (aVal > bVal ? 1 : -1) : bVal > aVal ? 1 : -1;
                        });
                      }

                      // Paginate data
                      const startIndex = (hcpCurrentPage - 1) * hcpRowsPerPage;
                      const paginatedData = sortedData.slice(startIndex, startIndex + hcpRowsPerPage);

                      return paginatedData.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={selectedHcpRows.includes(record.id)}
                              onCheckedChange={() => handleSelectHcpRow(record.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="py-3 px-4">
                            {record.firstName} {record.lastName}
                          </td>
                          <td className="py-3 px-4 text-sm">{record.npiId}</td>
                          <td className="py-3 px-4 text-sm">{record.city}</td>
                          <td className="py-3 px-4 text-sm">{record.state}</td>
                          <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                          <td className="py-3 px-4 text-sm">{record.speciality[0]}</td>
                          <td className="py-3 px-4 text-sm">{record.subSpeciality}</td>
                          <td className="py-3 px-4 text-sm">{record.assignedAccounts}</td>
                          <td className="py-3 px-4 text-sm font-medium">{record.distinctPatients}</td>
                          <td className="py-3 px-4 text-sm text-green-600 font-medium">{record.growth}%</td>
                          <td className="py-3 px-4 text-sm font-medium">{record.addressableCount}</td>
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
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <Select
                    value={hcpRowsPerPage.toString()}
                    onValueChange={(value) => {
                      setHcpRowsPerPage(Number(value));
                      setHcpCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHcpCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={hcpCurrentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {hcpCurrentPage} of{" "}
                    {Math.ceil(
                      (() => {
                        const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                        const preparedData = activeRecords.map((record, index) => ({
                          ...record,
                          npiId: `12345${6789 + index}0`,
                          city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                          state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                          subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                        }));

                        if (!hcpSearchQuery) return preparedData.length;

                        const query = hcpSearchQuery.toLowerCase();
                        return preparedData.filter((record) => {
                          const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
                          const npi = record.npiId.toLowerCase();
                          const city = record.city.toLowerCase();
                          const state = record.state.toLowerCase();
                          const specialty = record.speciality[0].toLowerCase();
                          const subSpecialty = record.subSpeciality.toLowerCase();

                          return (
                            name.includes(query) ||
                            npi.includes(query) ||
                            city.includes(query) ||
                            state.includes(query) ||
                            specialty.includes(query) ||
                            subSpecialty.includes(query)
                          );
                        }).length;
                      })() / hcpRowsPerPage,
                    )}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setHcpCurrentPage((prev) => {
                        const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                        const preparedData = activeRecords.map((record, index) => ({
                          ...record,
                          npiId: `12345${6789 + index}0`,
                          city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                          state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                          subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                        }));

                        let filteredCount = preparedData.length;
                        if (hcpSearchQuery) {
                          const query = hcpSearchQuery.toLowerCase();
                          filteredCount = preparedData.filter((record) => {
                            const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
                            const npi = record.npiId.toLowerCase();
                            const city = record.city.toLowerCase();
                            const state = record.state.toLowerCase();
                            const specialty = record.speciality[0].toLowerCase();
                            const subSpecialty = record.subSpeciality.toLowerCase();

                            return (
                              name.includes(query) ||
                              npi.includes(query) ||
                              city.includes(query) ||
                              state.includes(query) ||
                              specialty.includes(query) ||
                              subSpecialty.includes(query)
                            );
                          }).length;
                        }

                        return Math.min(Math.ceil(filteredCount / hcpRowsPerPage), prev + 1);
                      })
                    }
                    disabled={
                      hcpCurrentPage >=
                      Math.ceil(
                        (() => {
                          const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                          const preparedData = activeRecords.map((record, index) => ({
                            ...record,
                            npiId: `12345${6789 + index}0`,
                            city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                            state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                            subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                          }));

                          if (!hcpSearchQuery) return preparedData.length;

                          const query = hcpSearchQuery.toLowerCase();
                          return preparedData.filter((record) => {
                            const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
                            const npi = record.npiId.toLowerCase();
                            const city = record.city.toLowerCase();
                            const state = record.state.toLowerCase();
                            const specialty = record.speciality[0].toLowerCase();
                            const subSpecialty = record.subSpeciality.toLowerCase();

                            return (
                              name.includes(query) ||
                              npi.includes(query) ||
                              city.includes(query) ||
                              state.includes(query) ||
                              specialty.includes(query) ||
                              subSpecialty.includes(query)
                            );
                          }).length;
                        })() / hcpRowsPerPage,
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hco" className="space-y-4">
          {/* HCO Data Table */}
          <div className="grid gap-4 md:grid-cols-3">
            {hcoMetrics.map((metric, index) => (
              <Card key={index} style={{ backgroundColor: currentTheme.colors.cardBg }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    {metric.value}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg">Facility Accounts</CardTitle>
                <div className="flex items-center gap-2">
                  {selectedHcoRows.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Selected ({selectedHcoRows.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleHcoExport("excel")}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export as Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHcoExport("json")}>
                          <FileJson className="h-4 w-4 mr-2" />
                          Export as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHcoExport("pdf")}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                      const preparedData = activeRecords.map((record, index) => {
                        const distinctPatients = Math.floor(Math.random() * 2000) + 500;
                        const growth = Math.floor(Math.random() * 25) + 5;
                        const addressableCount = Math.floor(Math.random() * 1000) + 200;

                        return {
                          ...record,
                          Name: record.name,
                          "Org ID": record.orgId,
                          "Skyra MDM ID": record.mdmId,
                          Identifiers: `NPI-${record.mdmId.slice(-6)}`,
                          "Distinct Patients": distinctPatients,
                          "Growth %": `${growth}%`,
                          "Addressable Count": addressableCount,
                        };
                      });

                      // Filter by selected rows if any are selected
                      const dataToExport = selectedHcoRows.length > 0 
                        ? preparedData.filter(record => selectedHcoRows.includes(record.id))
                        : preparedData;

                      exportToExcel(dataToExport, `Facility_Accounts_${new Date().toISOString().split("T")[0]}`);
                      toast({
                        title: "Export successful",
                        description: `${dataToExport.length} facility account(s) exported to Excel`,
                      });
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export to Excel {selectedHcoRows.length > 0 && `(${selectedHcoRows.length})`}
                  </Button>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, org ID, MDM ID..."
                  value={hcoSearchQuery}
                  onChange={(e) => {
                    setHcoSearchQuery(e.target.value);
                    setHcoCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">
                        <Checkbox
                          checked={(() => {
                            const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                            const preparedData = activeRecords.map((record, index) => ({
                              ...record,
                              distinctPatients: Math.floor(Math.random() * 2000) + 500,
                              growth: Math.floor(Math.random() * 25) + 5,
                              addressableCount: Math.floor(Math.random() * 1000) + 200,
                            }));

                            let filteredData = preparedData;
                            if (hcoSearchQuery) {
                              const query = hcoSearchQuery.toLowerCase();
                              filteredData = preparedData.filter((record) => {
                                const name = record.name.toLowerCase();
                                const orgId = record.orgId.toLowerCase();
                                const mdmId = record.mdmId.toLowerCase();

                                return name.includes(query) || orgId.includes(query) || mdmId.includes(query);
                              });
                            }

                            const startIndex = (hcoCurrentPage - 1) * hcoRowsPerPage;
                            const paginatedData = filteredData.slice(startIndex, startIndex + hcoRowsPerPage);
                            return paginatedData.length > 0 && selectedHcoRows.length === paginatedData.length;
                          })()}
                          onCheckedChange={(checked) => {
                            const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                            const preparedData = activeRecords.map((record, index) => ({
                              ...record,
                              distinctPatients: Math.floor(Math.random() * 2000) + 500,
                              growth: Math.floor(Math.random() * 25) + 5,
                              addressableCount: Math.floor(Math.random() * 1000) + 200,
                            }));

                            let filteredData = preparedData;
                            if (hcoSearchQuery) {
                              const query = hcoSearchQuery.toLowerCase();
                              filteredData = preparedData.filter((record) => {
                                const name = record.name.toLowerCase();
                                const orgId = record.orgId.toLowerCase();
                                const mdmId = record.mdmId.toLowerCase();

                                return name.includes(query) || orgId.includes(query) || mdmId.includes(query);
                              });
                            }

                            const startIndex = (hcoCurrentPage - 1) * hcoRowsPerPage;
                            const paginatedData = filteredData.slice(startIndex, startIndex + hcoRowsPerPage);
                            handleSelectAllHco(checked as boolean, paginatedData);
                          }}
                        />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcoSort("name")}
                      >
                        Name
                        <SortIcon column="name" currentColumn={hcoSortColumn} direction={hcoSortDirection} />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Org ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Skyra MDM ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Identifiers</th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcoSort("distinctPatients")}
                      >
                        Distinct Patients count
                        <SortIcon
                          column="distinctPatients"
                          currentColumn={hcoSortColumn}
                          direction={hcoSortDirection}
                        />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcoSort("growth")}
                      >
                        Growth %
                        <SortIcon column="growth" currentColumn={hcoSortColumn} direction={hcoSortDirection} />
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleHcoSort("addressableCount")}
                      >
                        Addressable count
                        <SortIcon
                          column="addressableCount"
                          currentColumn={hcoSortColumn}
                          direction={hcoSortDirection}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const activeRecords = mockHCOs.filter((record) => record.status === "Active");

                      // Prepare data with computed columns
                      const preparedData = activeRecords.map((record, index) => ({
                        ...record,
                        distinctPatients: Math.floor(Math.random() * 2000) + 500,
                        growth: Math.floor(Math.random() * 25) + 5,
                        addressableCount: Math.floor(Math.random() * 1000) + 200,
                      }));

                      // Filter data based on search query
                      let filteredData = preparedData;
                      if (hcoSearchQuery) {
                        const query = hcoSearchQuery.toLowerCase();
                        filteredData = preparedData.filter((record) => {
                          const name = record.name.toLowerCase();
                          const orgId = record.orgId.toLowerCase();
                          const mdmId = record.mdmId.toLowerCase();

                          return name.includes(query) || orgId.includes(query) || mdmId.includes(query);
                        });
                      }

                      // Sort data
                      let sortedData = [...filteredData];
                      if (hcoSortColumn) {
                        sortedData.sort((a: any, b: any) => {
                          let aVal = a[hcoSortColumn];
                          let bVal = b[hcoSortColumn];

                          if (typeof aVal === "string" && typeof bVal === "string") {
                            return hcoSortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                          }

                          return hcoSortDirection === "asc" ? (aVal > bVal ? 1 : -1) : bVal > aVal ? 1 : -1;
                        });
                      }

                      // Paginate data
                      const startIndex = (hcoCurrentPage - 1) * hcoRowsPerPage;
                      const paginatedData = sortedData.slice(startIndex, startIndex + hcoRowsPerPage);

                      return paginatedData.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedHcoRows.includes(record.id)}
                              onCheckedChange={() => handleSelectHcoRow(record.id)}
                            />
                          </td>
                          <td
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => navigate(`/hco/${record.id}`)}
                          >
                            {record.name}
                          </td>
                          <td className="py-3 px-4 text-sm">{record.orgId}</td>
                          <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                          <td className="py-3 px-4 text-sm">NPI-{record.mdmId.slice(-6)}</td>
                          <td className="py-3 px-4 text-sm font-medium">{record.distinctPatients}</td>
                          <td className="py-3 px-4 text-sm text-green-600 font-medium">{record.growth}%</td>
                          <td className="py-3 px-4 text-sm font-medium">{record.addressableCount}</td>
                          <td className="py-3 px-4">
                            <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <Select
                    value={hcoRowsPerPage.toString()}
                    onValueChange={(value) => {
                      setHcoRowsPerPage(Number(value));
                      setHcoCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHcoCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={hcoCurrentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {hcoCurrentPage} of{" "}
                    {Math.ceil(
                      (() => {
                        const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                        const preparedData = activeRecords.map((record, index) => ({
                          ...record,
                          distinctPatients: Math.floor(Math.random() * 2000) + 500,
                          growth: Math.floor(Math.random() * 25) + 5,
                          addressableCount: Math.floor(Math.random() * 1000) + 200,
                        }));

                        if (!hcoSearchQuery) return preparedData.length;

                        const query = hcoSearchQuery.toLowerCase();
                        return preparedData.filter((record) => {
                          const name = record.name.toLowerCase();
                          const orgId = record.orgId.toLowerCase();
                          const mdmId = record.mdmId.toLowerCase();

                          return name.includes(query) || orgId.includes(query) || mdmId.includes(query);
                        }).length;
                      })() / hcoRowsPerPage,
                    )}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setHcoCurrentPage((prev) => {
                        const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                        const preparedData = activeRecords.map((record, index) => ({
                          ...record,
                          distinctPatients: Math.floor(Math.random() * 2000) + 500,
                          growth: Math.floor(Math.random() * 25) + 5,
                          addressableCount: Math.floor(Math.random() * 1000) + 200,
                        }));

                        let filteredCount = preparedData.length;
                        if (hcoSearchQuery) {
                          const query = hcoSearchQuery.toLowerCase();
                          filteredCount = preparedData.filter((record) => {
                            const name = record.name.toLowerCase();
                            const orgId = record.orgId.toLowerCase();
                            const mdmId = record.mdmId.toLowerCase();

                            return name.includes(query) || orgId.includes(query) || mdmId.includes(query);
                          }).length;
                        }

                        return Math.min(Math.ceil(filteredCount / hcoRowsPerPage), prev + 1);
                      })
                    }
                    disabled={
                      hcoCurrentPage >=
                      Math.ceil(
                        (() => {
                          const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                          const preparedData = activeRecords.map((record, index) => ({
                            ...record,
                            distinctPatients: Math.floor(Math.random() * 2000) + 500,
                            growth: Math.floor(Math.random() * 25) + 5,
                            addressableCount: Math.floor(Math.random() * 1000) + 200,
                          }));

                          if (!hcoSearchQuery) return preparedData.length;

                          const query = hcoSearchQuery.toLowerCase();
                          return preparedData.filter((record) => {
                            const name = record.name.toLowerCase();
                            const orgId = record.orgId.toLowerCase();
                            const mdmId = record.mdmId.toLowerCase();

                            return name.includes(query) || orgId.includes(query) || mdmId.includes(query);
                          }).length;
                        })() / hcoRowsPerPage,
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
