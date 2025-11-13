import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockHCOs } from "@/lib/mockData";
import { Search, Eye, Building2, TrendingUp, AlertCircle, Clock, Download, FileJson, FileSpreadsheet, FileText, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { exportToExcel, exportToJSON, exportHCOToPDF, prepareHCOForExport } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const HCOList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFacilityType, setSelectedFacilityType] = useState("all");
  const [selectedCounties, setSelectedCounties] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedZip, setSelectedZip] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("all");
  const [selectedPayerType, setSelectedPayerType] = useState("all");
  const [affiliationsSearch, setAffiliationsSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [serviceLine, setServiceLine] = useState<"HH" | "HOS">("HH");

  const filteredData = mockHCOs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const activeCount = mockHCOs.filter(hco => hco.status === "Active").length;
  const inactiveCount = mockHCOs.filter(hco => hco.status === "Inactive").length;
  const pendingCount = 0; // No pending in current data

  const metrics = [
    { title: "Total Facility Accounts", value: mockHCOs.length.toString(), icon: Building2, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Active Facility Accounts", value: activeCount.toString(), icon: TrendingUp, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Inactive Facility Accounts", value: inactiveCount.toString(), icon: AlertCircle, bgColor: "bg-gray-50", iconColor: "text-gray-600" },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map(item => item.mdmId);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    return sortOrder === "asc" ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const clearAllFilters = () => {
    setSelectedFacilityType("all");
    setSelectedCounties("all");
    setSelectedState("all");
    setSelectedZip("");
    setSelectedQuarter("all");
    setSelectedPayerType("all");
    setAffiliationsSearch("");
  };

  const handleExport = (format: 'excel' | 'json' | 'pdf') => {
    if (selectedRows.size === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to export",
        variant: "destructive",
      });
      return;
    }

    const selectedData = mockHCOs.filter(hco => selectedRows.has(hco.mdmId));
    
    if (format === 'excel') {
      const exportData = selectedData.map(prepareHCOForExport);
      exportToExcel(exportData, 'HCO_Export');
    } else if (format === 'json') {
      exportToJSON(selectedData, 'HCO_Export');
    } else if (format === 'pdf') {
      selectedData.forEach(hco => exportHCOToPDF(hco));
    }

    toast({
      title: "Export successful",
      description: `Exported ${selectedRows.size} record(s) to ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Facility Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Healthcare organizations - Manage and view facility profiles, facilities, and departments
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className={metric.bgColor}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${metric.iconColor}`}>{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Counties</label>
              <Select value={selectedCounties} onValueChange={setSelectedCounties}>
                <SelectTrigger>
                  <SelectValue placeholder="All Counties" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Counties</SelectItem>
                  <SelectItem value="kings">Kings County</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles County</SelectItem>
                  <SelectItem value="harris">Harris County</SelectItem>
                  <SelectItem value="miami-dade">Miami-Dade County</SelectItem>
                  <SelectItem value="cook">Cook County</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP</label>
              <Input 
                placeholder="Enter ZIP code..." 
                value={selectedZip}
                onChange={(e) => setSelectedZip(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time (Quarters)</label>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Quarters" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Quarters</SelectItem>
                  <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                  <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                  <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                  <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="Q1-2025">Q1 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payer Type</label>
              <Select value={selectedPayerType} onValueChange={setSelectedPayerType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Payer Types" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Payer Types</SelectItem>
                  <SelectItem value="Medicare">Medicare</SelectItem>
                  <SelectItem value="Medicaid">Medicaid</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Self-Pay">Self-Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facility Type</label>
              <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Facility Types" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Facility Types</SelectItem>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="SNF">SNF</SelectItem>
                  <SelectItem value="ALF">ALF</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Medical Center">Medical Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Affiliations</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search affiliations..." 
                  className="pl-9" 
                  value={affiliationsSearch}
                  onChange={(e) => setAffiliationsSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facility Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Facility Accounts</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={selectedRows.size === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export ({selectedRows.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="whitespace-nowrap">
            <table className="w-full min-w-[2000px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <Checkbox
                      checked={selectedRows.size > 0 && selectedRows.size === filteredData.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("rank")} className="flex items-center hover:text-foreground">
                      L4QTR Rank
                      <SortIcon column="rank" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("name")} className="flex items-center hover:text-foreground">
                      Facility Name
                      <SortIcon column="name" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">NPI</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("county")} className="flex items-center hover:text-foreground">
                      County
                      <SortIcon column="county" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("city")} className="flex items-center hover:text-foreground">
                      City
                      <SortIcon column="city" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("state")} className="flex items-center hover:text-foreground">
                      State
                      <SortIcon column="state" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">Parent Facility</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">ONE ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("annualPatientCount")} className="flex items-center hover:text-foreground">
                      Annual Patient Count (FFS)
                      <SortIcon column="annualPatientCount" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("l4qtrPatientCount")} className="flex items-center hover:text-foreground">
                      L4QTR {serviceLine === "HH" ? "HH Patient" : "HOS Patient"} Count
                      <SortIcon column="l4qtrPatientCount" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("growth")} className="flex items-center hover:text-foreground">
                      L4QTR Growth %
                      <SortIcon column="growth" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("facilityType")} className="flex items-center hover:text-foreground">
                      Facility Type
                      <SortIcon column="facilityType" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">MD - Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Top Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency1Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count
                      <SortIcon column="agency1Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Second Highest Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency2Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count
                      <SortIcon column="agency2Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Third Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency3Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count
                      <SortIcon column="agency3Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Fourth Highest Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency4Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count
                      <SortIcon column="agency4Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Fifth Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency5Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count
                      <SortIcon column="agency5Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .map((record, index) => {
                    const rank = index + 1;
                    const npi = `NPI${Math.floor(Math.random() * 9000000000) + 1000000000}`;
                    const counties = ["Los Angeles", "Harris", "Miami-Dade", "Kings", "Cook"];
                    const cities = ["Los Angeles", "Houston", "Miami", "Brooklyn", "Chicago"];
                    const states = ["CA", "TX", "FL", "NY", "IL"];
                    const county = counties[Math.floor(Math.random() * counties.length)];
                    const city = cities[Math.floor(Math.random() * cities.length)];
                    const state = states[Math.floor(Math.random() * states.length)];
                    const parentFacility = `Parent ${record.name.split(" ")[0]}`;
                    const oneId = `ONE-${Math.floor(Math.random() * 90000) + 10000}`;
                    const annualPatientCount = Math.floor(Math.random() * 5000) + 1000;
                    const l4qtrPatientCount = Math.floor(Math.random() * 1500) + 300;
                    const growth = parseFloat((Math.random() * 25 + 5).toFixed(1));
                    const facilityTypes = ["Acute Care", "SNF", "IRF", "LTACH"];
                    const facilityType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
                    const mdAgency = `MD Agency ${Math.floor(Math.random() * 100) + 1}`;
                    
                    const agencies = [
                      { name: "Healthcare Partners", count: Math.floor(Math.random() * 200) + 50 },
                      { name: "Medical Associates", count: Math.floor(Math.random() * 180) + 40 },
                      { name: "Premier Health Group", count: Math.floor(Math.random() * 150) + 30 },
                      { name: "Unity Medical", count: Math.floor(Math.random() * 120) + 25 },
                      { name: "Community Health Network", count: Math.floor(Math.random() * 100) + 20 },
                    ];
                    const totalAgencyPatients = agencies.reduce((sum, a) => sum + a.count, 0);

                    return {
                      record,
                      rank,
                      npi,
                      county,
                      city,
                      state,
                      parentFacility,
                      oneId,
                      annualPatientCount,
                      l4qtrPatientCount,
                      growth,
                      facilityType,
                      mdAgency,
                      agencies,
                      totalAgencyPatients,
                      name: record.name,
                      agency1Count: agencies[0].count,
                      agency2Count: agencies[1].count,
                      agency3Count: agencies[2].count,
                      agency4Count: agencies[3].count,
                      agency5Count: agencies[4].count,
                    };
                  })
                  .sort((a, b) => {
                    if (!sortBy) return 0;
                    
                    let aVal = a[sortBy as keyof typeof a];
                    let bVal = b[sortBy as keyof typeof b];
                    
                    if (typeof aVal === 'string' && typeof bVal === 'string') {
                      return sortOrder === 'asc' 
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                    }
                    
                    if (typeof aVal === 'number' && typeof bVal === 'number') {
                      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                    }
                    
                    return 0;
                  })
                  .map((data, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedRows.has(data.record.mdmId)}
                          onCheckedChange={(checked) => handleSelectRow(data.record.mdmId, checked as boolean)}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm">{data.rank}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        <Link 
                          to={`/hco/${data.record.id}`}
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {data.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm">{data.npi}</td>
                      <td className="py-3 px-4 text-sm">{data.county}</td>
                      <td className="py-3 px-4 text-sm">{data.city}</td>
                      <td className="py-3 px-4 text-sm">{data.state}</td>
                      <td className="py-3 px-4 text-sm">{data.parentFacility}</td>
                      <td className="py-3 px-4 text-sm">{data.oneId}</td>
                      <td className="py-3 px-4 text-sm font-medium">{data.annualPatientCount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm font-medium">{data.l4qtrPatientCount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{data.growth}%</td>
                      <td className="py-3 px-4 text-sm">{data.facilityType}</td>
                      <td className="py-3 px-4 text-sm">{data.mdAgency}</td>
                      {data.agencies.map((agency, agencyIndex) => (
                        <>
                          <td key={`agency-${agencyIndex}`} className="py-3 px-4 text-sm">{agency.name}</td>
                          <td key={`count-${agencyIndex}`} className="py-3 px-4 text-sm font-medium">{agency.count}</td>
                          <td key={`pct-${agencyIndex}`} className="py-3 px-4 text-sm">{((agency.count / data.totalAgencyPatients) * 100).toFixed(1)}%</td>
                        </>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default HCOList;
