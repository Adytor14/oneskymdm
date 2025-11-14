import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockHCOs } from "@/lib/mockData";
import { Database, Building2, Eye, Search, FileSpreadsheet, FileText, Check, ChevronsUpDown, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel } from "@/lib/exportUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MarketAnalysisHCO = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedPayers, setSelectedPayers] = useState<string[]>([]);
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([]);
  const [serviceLine, setServiceLine] = useState<"HH" | "HOS">("HH");
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [zipCode, setZipCode] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const maxScroll = target.scrollWidth - target.clientWidth;
    
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < maxScroll - 1);
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

  const states = ["California", "Texas", "Florida", "New York", "Illinois"];
  const counties = ["Los Angeles", "Harris", "Miami-Dade", "Kings", "Cook"];
  const payers = ["Medicare", "Medicaid", "Private Insurance", "Uninsured"];
  const quarters = ["Q4 2024", "Q3 2024", "Q2 2024", "Q1 2024", "Q4 2023", "Q3 2023"];

  const clearFilters = () => {
    setSelectedStates([]);
    setSelectedCounties([]);
    setSelectedPayers([]);
    setSelectedQuarters([]);
    setZipCode("");
    setSearchTerm("");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = mockHCOs.filter(r => r.status === "Active").map(r => r.mdmId);
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

  const hcoMetrics = [
    { title: "Total Facility Accounts", value: "468", bgColor: "bg-blue-50" },
    { title: "Total Patients Count", value: "441", label: serviceLine, bgColor: "bg-green-50" },
    { title: "Growth", value: "8.3%", bgColor: "bg-gray-50" },
  ];

  return (
    <div className="w-full space-y-6 p-6">
      <div className="max-w-[1400px] space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Analysis - Facility Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Analyze facility market data and trends
          </p>
        </div>

        {/* Filters for Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Filters for Analysis
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedStates.length > 0 ? `${selectedStates.length} selected` : "Select states"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search states..." />
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {states.map((state) => (
                        <CommandItem
                          key={state}
                          onSelect={() => {
                            setSelectedStates(
                              selectedStates.includes(state)
                                ? selectedStates.filter((s) => s !== state)
                                : [...selectedStates, state]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStates.includes(state) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {state}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Counties</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedCounties.length > 0 ? `${selectedCounties.length} selected` : "Select counties"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search counties..." />
                    <CommandEmpty>No county found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {counties.map((county) => (
                        <CommandItem
                          key={county}
                          onSelect={() => {
                            setSelectedCounties(
                              selectedCounties.includes(county)
                                ? selectedCounties.filter((c) => c !== county)
                                : [...selectedCounties, county]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCounties.includes(county) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {county}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP</label>
              <Input 
                placeholder="Enter ZIP code" 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time (Quarters)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedQuarters.length > 0 ? `${selectedQuarters.length} selected` : "Select quarters"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search quarters..." />
                    <CommandEmpty>No quarter found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {quarters.map((quarter) => (
                        <CommandItem
                          key={quarter}
                          onSelect={() => {
                            setSelectedQuarters(
                              selectedQuarters.includes(quarter)
                                ? selectedQuarters.filter((q) => q !== quarter)
                                : [...selectedQuarters, quarter]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedQuarters.includes(quarter) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {quarter}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payer Type</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedPayers.length > 0 ? `${selectedPayers.length} selected` : "Select payers"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search payers..." />
                    <CommandEmpty>No payer found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {payers.map((payer) => (
                        <CommandItem
                          key={payer}
                          onSelect={() => {
                            setSelectedPayers(
                              selectedPayers.includes(payer)
                                ? selectedPayers.filter((p) => p !== payer)
                                : [...selectedPayers, payer]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPayers.includes(payer) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {payer}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* HCO Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          {hcoMetrics.map((metric, index) => (
            <Card key={index} className={metric.bgColor}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-blue-600">
                    {metric.value}
                  </CardTitle>
                  {metric.label && (
                    <Badge variant="secondary" className="text-xs">
                      {metric.label}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Facility Accounts Table - Full Width */}
      <div className="max-w-[1400px]">
        <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                  const preparedData = activeRecords.map((record, index) => {
                    const agencies = [
                      { name: "Healthcare Partners", count: Math.floor(Math.random() * 200) + 50 },
                      { name: "Medical Associates", count: Math.floor(Math.random() * 180) + 40 },
                      { name: "Premier Health Group", count: Math.floor(Math.random() * 150) + 30 },
                      { name: "Unity Medical", count: Math.floor(Math.random() * 120) + 25 },
                      { name: "Community Health Network", count: Math.floor(Math.random() * 100) + 20 },
                    ];
                    const totalAgencyPatients = agencies.reduce((sum, a) => sum + a.count, 0);
                    
                    return {
                      'L4QTR Rank': index + 1,
                      'Facility Name': record.name,
                      'NPI': `NPI${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                      'County': ["Los Angeles", "Harris", "Miami-Dade"][Math.floor(Math.random() * 3)],
                      'City': ["Los Angeles", "Houston", "Miami"][Math.floor(Math.random() * 3)],
                      'State': ["CA", "TX", "FL"][Math.floor(Math.random() * 3)],
                      'Parent Facility': `Parent ${record.name.split(" ")[0]}`,
                      'ONE ID': `ONE-${Math.floor(Math.random() * 90000) + 10000}`,
                      'Annual Patient Count (FFS)': Math.floor(Math.random() * 5000) + 1000,
                      [`L4QTR ${serviceLine} Patient Count`]: Math.floor(Math.random() * 1500) + 300,
                      'L4QTR Growth %': (Math.random() * 25 + 5).toFixed(1),
                      'Addressable Count': Math.floor(Math.random() * 500) + 100,
                      'Facility Type': ["Acute Care", "SNF", "IRF"][Math.floor(Math.random() * 3)],
                      'MD - Agency': `MD Agency ${Math.floor(Math.random() * 100) + 1}`,
                      'L4QTR Top Referring Agency': agencies[0].name,
                      'L4QTR Patient Count_1': agencies[0].count,
                      '% of Total Patients_1': ((agencies[0].count / totalAgencyPatients) * 100).toFixed(1),
                      'L4QTR Second Highest Referring Agency': agencies[1].name,
                      'L4QTR Patient Count_2': agencies[1].count,
                      '% of Total Patients_2': ((agencies[1].count / totalAgencyPatients) * 100).toFixed(1),
                      'L4QTR Third Referring Agency': agencies[2].name,
                      'L4QTR Patient Count_3': agencies[2].count,
                      '% of Total Patients_3': ((agencies[2].count / totalAgencyPatients) * 100).toFixed(1),
                      'L4QTR Fourth Highest Referring Agency': agencies[3].name,
                      'L4QTR Patient Count_4': agencies[3].count,
                      '% of Total Patients_4': ((agencies[3].count / totalAgencyPatients) * 100).toFixed(1),
                      'L4QTR Fifth Referring Agency': agencies[4].name,
                      'L4QTR Patient Count_5': agencies[4].count,
                      '% of Total Patients_5': ((agencies[4].count / totalAgencyPatients) * 100).toFixed(1),
                    };
                  });
                  exportToExcel(preparedData, 'Market_Analysis_Facilities');
                  toast({
                    title: "Export successful",
                    description: "Data exported to Excel",
                  });
                }}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const activeRecords = mockHCOs.filter((record) => record.status === "Active");
                  const preparedData = activeRecords.map((record, index) => {
                    const agencies = [
                      { name: "Healthcare Partners", count: Math.floor(Math.random() * 200) + 50 },
                      { name: "Medical Associates", count: Math.floor(Math.random() * 180) + 40 },
                      { name: "Premier Health Group", count: Math.floor(Math.random() * 150) + 30 },
                      { name: "Unity Medical", count: Math.floor(Math.random() * 120) + 25 },
                      { name: "Community Health Network", count: Math.floor(Math.random() * 100) + 20 },
                    ];
                    
                    return {
                      rank: index + 1,
                      name: record.name,
                      npi: `NPI${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                      county: ["Los Angeles", "Harris", "Miami-Dade"][Math.floor(Math.random() * 3)],
                      city: ["Los Angeles", "Houston", "Miami"][Math.floor(Math.random() * 3)],
                      state: ["CA", "TX", "FL"][Math.floor(Math.random() * 3)],
                      parentFacility: `Parent ${record.name.split(" ")[0]}`,
                      oneId: `ONE-${Math.floor(Math.random() * 90000) + 10000}`,
                      annualPatientCount: Math.floor(Math.random() * 5000) + 1000,
                      l4qtrPatientCount: Math.floor(Math.random() * 1500) + 300,
                      growth: (Math.random() * 25 + 5).toFixed(1),
                      addressableCount: Math.floor(Math.random() * 500) + 100,
                      facilityType: ["Acute Care", "SNF", "IRF"][Math.floor(Math.random() * 3)],
                      topAgency: agencies[0].name,
                      topAgencyCount: agencies[0].count,
                    };
                  });

                  const doc = new jsPDF('landscape');
                  doc.setFontSize(16);
                  doc.text('Market Analysis - Facility Accounts', 14, 15);
                  
                  autoTable(doc, {
                    startY: 25,
                    head: [['Rank', 'Facility Name', 'NPI', 'County', 'City', 'State', 'Parent', 'ONE ID', 'Annual Count', 'L4QTR Count', 'Growth %', 'Addressable Count', 'Type', 'Top Agency', 'Agency Count']],
                    body: preparedData.map(d => [
                      d.rank,
                      d.name,
                      d.npi,
                      d.county,
                      d.city,
                      d.state,
                      d.parentFacility,
                      d.oneId,
                      d.annualPatientCount,
                      d.l4qtrPatientCount,
                      `${d.growth}%`,
                      d.addressableCount,
                      d.facilityType,
                      d.topAgency,
                      d.topAgencyCount
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: [33, 150, 243], fontSize: 8 },
                    bodyStyles: { fontSize: 7 },
                    styles: { cellPadding: 1 },
                  });
                  
                  doc.save('Market_Analysis_Facilities.pdf');
                  toast({
                    title: "Export successful",
                    description: "Data exported to PDF",
                  });
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="relative">
            <div 
              className="overflow-x-auto"
              onScroll={handleScroll}
            >
              {showLeftShadow && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              )}
              {showRightShadow && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
              )}
              <table className="w-full min-w-max">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <Checkbox
                      checked={selectedRows.size > 0 && selectedRows.size === mockHCOs.filter(r => r.status === "Active").length}
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
                    <button onClick={() => handleSort("addressableCount")} className="flex items-center hover:text-foreground">
                      Addressable Count
                      <SortIcon column="addressableCount" />
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
                      L4QTR Patient Count_1
                      <SortIcon column="agency1Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients_1</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Second Highest Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency2Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count_2
                      <SortIcon column="agency2Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients_2</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Third Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency3Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count_3
                      <SortIcon column="agency3Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients_3</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Fourth Highest Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency4Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count_4
                      <SortIcon column="agency4Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients_4</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">L4QTR Fifth Referring Agency</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">
                    <button onClick={() => handleSort("agency5Count")} className="flex items-center hover:text-foreground">
                      L4QTR Patient Count_5
                      <SortIcon column="agency5Count" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap">% of Total Patients_5</th>
                </tr>
              </thead>
              <tbody>
                {mockHCOs
                  .filter((record) => {
                    if (record.status !== "Active") return false;
                    if (!searchTerm) return true;
                    const search = searchTerm.toLowerCase();
                    return (
                      record.name.toLowerCase().includes(search) ||
                      record.orgId.toLowerCase().includes(search) ||
                      record.mdmId.toLowerCase().includes(search)
                    );
                  })
                  .map((record, index) => {
                    // Mock data for all columns
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
                    
                    // Referring agencies data
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
                      addressableCount: Math.floor(Math.random() * 500) + 100,
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
                  .slice(0, 20)
                  .map((data, index) => {
                    return (
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
                        <td className="py-3 px-4 text-sm font-medium">{data.addressableCount}</td>
                        <td className="py-3 px-4 text-sm">{data.facilityType}</td>
                        <td className="py-3 px-4 text-sm">{data.mdAgency}</td>
                        {data.agencies.map((agency, agencyIndex) => (
                          <>
                            <td key={`agency-${agencyIndex}`} className="py-3 px-4 text-sm">{agency.name}</td>
                            <td key={`count-${agencyIndex}`} className="py-3 px-4 text-sm font-medium">{agency.count}</td>
                            <td key={`percent-${agencyIndex}`} className="py-3 px-4 text-sm">{((agency.count / data.totalAgencyPatients) * 100).toFixed(1)}%</td>
                          </>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default MarketAnalysisHCO;
