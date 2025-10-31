import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockHCPs } from "@/lib/mockData";
import { Search, Eye, Users, TrendingUp, AlertCircle, Clock, Download, FileJson, FileSpreadsheet, FileText, ArrowUpRight } from "lucide-react";
import { exportToExcel, exportToJSON, exportHCPToPDF, prepareHCPForExport } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const HCPList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedZip, setSelectedZip] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("all");
  const [selectedPayerType, setSelectedPayerType] = useState("all");
  const [affiliationsSearch, setAffiliationsSearch] = useState("");
  const [selectedPatientVolume, setSelectedPatientVolume] = useState("all");
  const [selectedStarRating, setSelectedStarRating] = useState("all");
  const [deliberateDuplicates, setDeliberateDuplicates] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
      setSelectedRows(filteredData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleExport = (format: 'excel' | 'json' | 'pdf') => {
    if (selectedRows.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to export",
        variant: "destructive",
      });
      return;
    }

    const selectedData = mockHCPs.filter(hcp => selectedRows.includes(hcp.id));
    
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
      description: `Exported ${selectedRows.length} record(s) to ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Physician Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Healthcare professionals - Manage and view physician profiles, credentials, and affiliations
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, ID, or identifier..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <label className="text-sm font-medium">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Specialty</label>
              <Select value={selectedSubSpecialty} onValueChange={setSelectedSubSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sub Specialties" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Sub Specialties</SelectItem>
                  <SelectItem value="Interventional">Interventional</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Pediatric">Pediatric</SelectItem>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Volume</label>
              <Select value={selectedPatientVolume} onValueChange={setSelectedPatientVolume}>
                <SelectTrigger>
                  <SelectValue placeholder="All Volumes" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Volumes</SelectItem>
                  <SelectItem value="0-100">0-100</SelectItem>
                  <SelectItem value="101-500">101-500</SelectItem>
                  <SelectItem value=">500">&gt;500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Star Rating</label>
              <Select value={selectedStarRating} onValueChange={setSelectedStarRating}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Star</SelectItem>
                  <SelectItem value="3">3 Star</SelectItem>
                  <SelectItem value="4">4 Star</SelectItem>
                  <SelectItem value="5">5 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox 
                  id="deliberate-duplicates"
                  checked={deliberateDuplicates}
                  onCheckedChange={(checked) => setDeliberateDuplicates(checked as boolean)}
                />
                <label
                  htmlFor="deliberate-duplicates"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Deliberate Duplicates
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physician Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Physician Accounts</CardTitle>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Showing {filteredData.length} of {mockHCPs.length} records</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" disabled={selectedRows.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected ({selectedRows.length})
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground w-12">
                    <Checkbox 
                      checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">NPI</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">City</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">State</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">One ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Speciality</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Sub Speciality</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Assigned Identifiers</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Distinct Patients</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Growth</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Addressable Count</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Push</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record, index) => {
                  // Mock data for new columns
                  const npiId = `12345${6789 + index}0`;
                  const city = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5];
                  const state = ["NY", "CA", "IL", "TX", "AZ"][index % 5];
                  const subSpeciality = record.speciality[0] === "Cardiology" ? "Interventional" : "General";
                  const distinctPatients = Math.floor(Math.random() * 500) + 100;
                  const growth = `${Math.floor(Math.random() * 20) + 1}%`;
                  const addressableCount = Math.floor(Math.random() * 300) + 50;
                  
                  return (
                    <tr 
                      key={index} 
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <Checkbox 
                          checked={selectedRows.includes(record.id)}
                          onCheckedChange={(checked) => handleSelectRow(record.id, checked as boolean)}
                        />
                      </td>
                      <td className="py-3 px-4">Dr. {record.firstName} {record.lastName}</td>
                      <td className="py-3 px-4 text-sm">{npiId}</td>
                      <td className="py-3 px-4 text-sm">{city}</td>
                      <td className="py-3 px-4 text-sm">{state}</td>
                      <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                      <td className="py-3 px-4 text-sm">{record.speciality[0]}</td>
                      <td className="py-3 px-4 text-sm">{subSpeciality}</td>
                      <td className="py-3 px-4 text-sm">{record.identifiers.join(", ")}</td>
                      <td className="py-3 px-4 text-sm font-medium">{distinctPatients}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{growth}</td>
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
                          onClick={() => {
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
    </div>
  );
};

export default HCPList;
