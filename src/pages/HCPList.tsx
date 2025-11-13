import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { mockHCPs } from "@/lib/mockData";
import { Search, Eye, Users, TrendingUp, AlertCircle, Clock, Download, FileJson, FileSpreadsheet, FileText, ArrowUpRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { exportToExcel, exportToJSON, exportHCPToPDF, prepareHCPForExport } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SortDirection = "asc" | "desc" | null;

const SortIcon = ({ column, currentColumn, direction }: { 
  column: string; 
  currentColumn: string | null; 
  direction: SortDirection;
}) => {
  if (column !== currentColumn) {
    return <ArrowUpDown className="inline-block ml-1 h-3 w-3" />;
  }
  return direction === "asc" ? 
    <ArrowUp className="inline-block ml-1 h-3 w-3" /> : 
    <ArrowDown className="inline-block ml-1 h-3 w-3" />;
};

const HCPList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState("all");
  const [selectedCounties, setSelectedCounties] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedZip, setSelectedZip] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("all");
  const [selectedPayerType, setSelectedPayerType] = useState("all");
  const [affiliationsSearch, setAffiliationsSearch] = useState("");
  const [selectedPatientVolume, setSelectedPatientVolume] = useState("all");
  const [deliberateDuplicates, setDeliberateDuplicates] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredData = mockHCPs.filter((item) => {
    const matchesSearch =
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === "all" || item.speciality.includes(selectedSpecialty);
    const isActive = item.status === "Active";

    return matchesSearch && matchesSpecialty && isActive;
  });

  const totalDistinctPatients = mockHCPs.reduce((sum, hcp, index) => {
    const distinctPatients = Math.floor(Math.random() * 500) + 100;
    return sum + distinctPatients;
  }, 0);
  
  const averageGrowth = Math.floor(Math.random() * 15) + 5;

  const metrics = [
    { title: "Total Physician Accounts", value: mockHCPs.length.toString(), icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Distinct Patients", value: totalDistinctPatients.toLocaleString(), icon: TrendingUp, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Growth", value: `${averageGrowth}%`, icon: AlertCircle, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = mockHCPs.filter(r => r.status === "Active").map(r => r.mdmId);
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
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const clearAllFilters = () => {
    setSelectedSpecialty("all");
    setSelectedSubSpecialty("all");
    setSelectedCounties("all");
    setSelectedState("all");
    setSelectedZip("");
    setSelectedQuarter("all");
    setSelectedPayerType("all");
    setAffiliationsSearch("");
    setSelectedPatientVolume("all");
    setDeliberateDuplicates(false);
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

    const selectedData = mockHCPs.filter(hcp => selectedRows.has(hcp.id));
    
    if (format === 'excel') {
      const exportData = selectedData.map(prepareHCPForExport);
      exportToExcel(exportData, 'HCP_Export');
    } else if (format === 'json') {
      exportToJSON(selectedData, 'HCP_Export');
    } else if (format === 'pdf') {
      selectedData.forEach(hcp => exportHCPToPDF(hcp));
    }

    toast({
      title: "Export successful",
      description: `Exported ${selectedRows.size} record(s) to ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-[1400px]">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Physician Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Healthcare professionals - Manage and view physician profiles, credentials, and affiliations
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
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
        <Card className="mt-6">
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
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
...
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Physician Accounts Table */}
      <div className="max-w-[1400px]">
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg">Physician Accounts</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, NPI, or specialty..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                  const preparedData = activeRecords.map((record, index) => ({
                    'L4QTR Rank': index + 1,
                    'Physician Name': `Dr. ${record.firstName} ${record.lastName}`,
                    NPI: `12345${6789 + index}0`,
                    County: ["Kings County", "Los Angeles County", "Cook County", "Harris County", "Maricopa County"][index % 5],
                    City: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                    State: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                    Speciality: record.speciality[0],
                    'ONE ID': record.mdmId,
                    'Annual Patient Count (FFS)': Math.floor(Math.random() * 2000) + 500,
                    'L4QTR HH Patient / HOS Patients Count': Math.floor(Math.random() * 500) + 100,
                    'L4QTR Growth %': Math.floor(Math.random() * 20) + 1,
                  }));
                  exportToExcel(preparedData, 'Market_Analysis_Physicians');
                  toast({
                    title: "Export successful",
                    description: "Data exported to Excel",
                  });
                }}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" disabled={selectedRows.size === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected ({selectedRows.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    <FileJson className="mr-2 h-4 w-4" />
                    Download JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export to Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export to PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="min-w-max">
              <table className="w-full min-w-[2000px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12 sticky left-0 bg-background z-10">
                      <Checkbox 
                        checked={selectedRows.size > 0 && selectedRows.size === mockHCPs.filter(r => r.status === "Active").length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("rank")}>
                      L4QTR Rank
                      <SortIcon column="rank" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("name")}>
                      Physician Name
                      <SortIcon column="name" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("npi")}>
                      NPI
                      <SortIcon column="npi" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("county")}>
                      County
                      <SortIcon column="county" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("city")}>
                      City
                      <SortIcon column="city" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("state")}>
                      State
                      <SortIcon column="state" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("speciality")}>
                      Speciality
                      <SortIcon column="speciality" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("mdmId")}>
                      ONE ID
                      <SortIcon column="mdmId" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("annualPatientCount")}>
                      Annual Patient Count (FFS)
                      <SortIcon column="annualPatientCount" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("l4qtrPatientCount")}>
                      L4QTR HH Patient / HOS Patients Count
                      <SortIcon column="l4qtrPatientCount" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("growth")}>
                      L4QTR Growth %
                      <SortIcon column="growth" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("medicalDirector")}>
                      Medical Director
                      <SortIcon column="medicalDirector" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("mdAgency")}>
                      MD - Agency
                      <SortIcon column="mdAgency" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("referralAgency1")}>
                      L4QTR Top Referring Agency
                      <SortIcon column="referralAgency1" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("patientCount1")}>
                      L4QTR Patient Count_1
                      <SortIcon column="patientCount1" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("percentTotal1")}>
                      % of Total Patients_1
                      <SortIcon column="percentTotal1" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("referralAgency2")}>
                      L4QTR Second Highest Referring Agency
                      <SortIcon column="referralAgency2" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("patientCount2")}>
                      L4QTR Patient Count_2
                      <SortIcon column="patientCount2" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("percentTotal2")}>
                      % of Total Patients_2
                      <SortIcon column="percentTotal2" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("referralAgency3")}>
                      L4QTR Third Referring Agency
                      <SortIcon column="referralAgency3" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("patientCount3")}>
                      L4QTR Patient Count_3
                      <SortIcon column="patientCount3" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("percentTotal3")}>
                      % of Total Patients_3
                      <SortIcon column="percentTotal3" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("referralAgency4")}>
                      L4QTR Forth Highest Referring Agency
                      <SortIcon column="referralAgency4" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("patientCount4")}>
                      L4QTR Patient Count_4
                      <SortIcon column="patientCount4" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("percentTotal4")}>
                      % of Total Patients_4
                      <SortIcon column="percentTotal4" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("referralAgency5")}>
                      L4QTR Fifth Referring Agency
                      <SortIcon column="referralAgency5" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("patientCount5")}>
                      L4QTR Patient Count_5
                      <SortIcon column="patientCount5" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-accent/50" onClick={() => handleSort("percentTotal5")}>
                      % of Total Patients_5
                      <SortIcon column="percentTotal5" currentColumn={sortColumn} direction={sortDirection} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                    
                    const preparedData = activeRecords.map((record, index) => ({
                      id: record.id,
                      rank: index + 1,
                      name: `Dr. ${record.firstName} ${record.lastName}`,
                      npi: `12345${6789 + index}0`,
                      county: ["Kings County", "Los Angeles County", "Cook County", "Harris County", "Maricopa County"][index % 5],
                      city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                      state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                      speciality: record.speciality,
                      mdmId: record.mdmId,
                      annualPatientCount: Math.floor(Math.random() * 2000) + 500,
                      l4qtrPatientCount: Math.floor(Math.random() * 500) + 100,
                      growth: Math.floor(Math.random() * 20) + 1,
                      medicalDirector: ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis"][index % 5],
                      mdAgency: ["Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare"][index % 5],
                      topReferralAgency: ["Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare"][index % 5],
                      patientCount1: Math.floor(Math.random() * 200) + 50,
                      percentTotal1: (Math.random() * 30 + 10).toFixed(1),
                      referralAgency2: ["OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare", "Skyra Medical"][index % 5],
                      patientCount2: Math.floor(Math.random() * 150) + 40,
                      percentTotal2: (Math.random() * 20 + 8).toFixed(1),
                      referralAgency3: ["JetHealth Agency", "OpusCare Services", "Choice Healthcare", "Skyra Medical", "OneSky Home Health"][index % 5],
                      patientCount3: Math.floor(Math.random() * 100) + 30,
                      percentTotal3: (Math.random() * 15 + 5).toFixed(1),
                      referralAgency4: ["OpusCare Services", "Choice Healthcare", "Skyra Medical", "OneSky Home Health", "JetHealth Agency"][index % 5],
                      patientCount4: Math.floor(Math.random() * 80) + 20,
                      percentTotal4: (Math.random() * 10 + 3).toFixed(1),
                      referralAgency5: ["Choice Healthcare", "Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services"][index % 5],
                      patientCount5: Math.floor(Math.random() * 60) + 15,
                      percentTotal5: (Math.random() * 8 + 2).toFixed(1),
                    }));

                    // Apply search filter
                    const filteredData = preparedData.filter((record) => {
                      if (!searchTerm) return true;
                      const search = searchTerm.toLowerCase();
                      return (
                        record.name.toLowerCase().includes(search) ||
                        record.npi.toLowerCase().includes(search) ||
                        record.speciality[0].toLowerCase().includes(search)
                      );
                    });

                    // Apply sorting
                    const sortedData = [...filteredData].sort((a, b) => {
                      if (!sortColumn || !sortDirection) return 0;

                      let aValue: any = a[sortColumn as keyof typeof a];
                      let bValue: any = b[sortColumn as keyof typeof b];

                      // Handle speciality array
                      if (sortColumn === 'speciality') {
                        aValue = a.speciality[0];
                        bValue = b.speciality[0];
                      }

                      // Handle numeric sorting
                      if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                      }

                      // Handle string sorting
                      const aStr = String(aValue).toLowerCase();
                      const bStr = String(bValue).toLowerCase();
                      
                      if (sortDirection === 'asc') {
                        return aStr.localeCompare(bStr);
                      } else {
                        return bStr.localeCompare(aStr);
                      }
                    });

                    // Apply pagination
                    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedData = sortedData.slice(startIndex, endIndex);

                    return paginatedData.map((record, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4 sticky left-0 bg-background">
                          <Checkbox
                            checked={selectedRows.has(record.id)}
                            onCheckedChange={(checked) => handleSelectRow(record.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm">{record.rank}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Link 
                            to={`/hcp/${record.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {record.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm">{record.npi}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.county}</td>
                        <td className="py-3 px-4 text-sm">{record.city}</td>
                        <td className="py-3 px-4 text-sm">{record.state}</td>
                        <td className="py-3 px-4 text-sm">
                          {record.speciality.map((spec, i) => (
                            <Badge key={i} variant="secondary" className="mr-1 mb-1">
                              {spec}
                            </Badge>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                        <td className="py-3 px-4 text-sm">{record.annualPatientCount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm">{record.l4qtrPatientCount}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant={record.growth > 10 ? "default" : "secondary"}>
                            {record.growth}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.medicalDirector}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.mdAgency}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.topReferralAgency}</td>
                        <td className="py-3 px-4 text-sm font-medium">{record.patientCount1}</td>
                        <td className="py-3 px-4 text-sm">{record.percentTotal1}%</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.referralAgency2}</td>
                        <td className="py-3 px-4 text-sm font-medium">{record.patientCount2}</td>
                        <td className="py-3 px-4 text-sm">{record.percentTotal2}%</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.referralAgency3}</td>
                        <td className="py-3 px-4 text-sm font-medium">{record.patientCount3}</td>
                        <td className="py-3 px-4 text-sm">{record.percentTotal3}%</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.referralAgency4}</td>
                        <td className="py-3 px-4 text-sm font-medium">{record.patientCount4}</td>
                        <td className="py-3 px-4 text-sm">{record.percentTotal4}%</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{record.referralAgency5}</td>
                        <td className="py-3 px-4 text-sm font-medium">{record.patientCount5}</td>
                        <td className="py-3 px-4 text-sm">{record.percentTotal5}%</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination */}
          {(() => {
            const activeRecords = mockHCPs.filter((record) => record.status === "Active");
            const filteredData = activeRecords.filter((record) => {
              if (!searchTerm) return true;
              const search = searchTerm.toLowerCase();
              const name = `Dr. ${record.firstName} ${record.lastName}`.toLowerCase();
              const npi = `12345${activeRecords.indexOf(record) + 6789}0`;
              return (
                name.includes(search) ||
                npi.includes(search) ||
                record.speciality[0].toLowerCase().includes(search)
              );
            });
            
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);

            if (totalPages <= 1) return null;

            const getPageNumbers = () => {
              const pages: (number | string)[] = [];
              
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                if (currentPage <= 3) {
                  pages.push(1, 2, 3, 4, '...', totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                }
              }
              
              return pages;
            };

            return (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            );
          })()}
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HCPList;
