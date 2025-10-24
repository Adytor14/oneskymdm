import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockHCOs } from "@/lib/mockData";
import { Search, Eye, Building2, TrendingUp, AlertCircle, Clock, Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToJSON, exportHCOToPDF, prepareHCOForExport } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const HCOList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFacilityType, setSelectedFacilityType] = useState("all");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const [selectedServiceLine, setSelectedServiceLine] = useState("all");
  const [affiliationsSearch, setAffiliationsSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredData = mockHCOs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const isActive = item.status === "Active";

    return matchesSearch && matchesStatus && isActive;
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

    const selectedData = mockHCOs.filter(hco => selectedRows.includes(hco.id));
    
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
      description: `Exported ${selectedRows.length} record(s) to ${format.toUpperCase()}`,
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
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
              <label className="text-sm font-medium">Geography</label>
              <Select value={selectedGeography} onValueChange={setSelectedGeography}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facility Type</label>
              <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Facility Types" />
                </SelectTrigger>
                <SelectContent>
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
              <label className="text-sm font-medium">Service Line</label>
              <Select value={selectedServiceLine} onValueChange={setSelectedServiceLine}>
                <SelectTrigger>
                  <SelectValue placeholder="All Service Lines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service Lines</SelectItem>
                  <SelectItem value="Home Health">Home Health</SelectItem>
                  <SelectItem value="Hospice">Hospice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Input placeholder="e.g., NPPES, CMS, Provider Database" />
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

      {/* Master Data Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Master Data</CardTitle>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Showing {filteredData.length} of {mockHCOs.length} records</p>
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
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Org ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Skyra MDM ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Identifiers</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record, index) => (
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
                    <td className="py-3 px-4">{record.name}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Facility Account</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{record.orgId}</td>
                    <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                    <td className="py-3 px-4 text-sm">{record.identifiers.join(", ")}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        record.status === "Active" 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "bg-gray-400 text-white hover:bg-gray-500"
                      }>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{record.source}</td>
                    <td className="py-3 px-4 text-sm">{new Date(record.lastUpdated).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4">
                      <Eye 
                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                        onClick={() => navigate(`/hco/${record.id}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HCOList;
