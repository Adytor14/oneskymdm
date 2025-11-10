import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mockHCPs } from "@/lib/mockData";
import { Database, Users, Eye, ArrowUpRight, Search, ArrowUpDown, ArrowUp, ArrowDown, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel } from "@/lib/exportUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const MarketAnalysisHCP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const hcpMetrics = [
    { title: "Total Physician Accounts", value: "2,847", bgColor: "bg-blue-50" },
    { title: "Distinct Patients", value: "2,683", bgColor: "bg-green-50" },
    { title: "Growth", value: "6.1%", bgColor: "bg-gray-50" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Market Analysis - Physician Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Analyze physician market data and trends
        </p>
      </div>

      {/* HCP Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {hcpMetrics.map((metric, index) => (
          <Card key={index} className={metric.bgColor}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-blue-600">
                {metric.value}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
            </CardHeader>
          </Card>
        ))}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Countries</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="il">Illinois</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="az">Arizona</SelectItem>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Specialty</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Sub Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub Specialties</SelectItem>
                  <SelectItem value="interventional">Interventional</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="pediatric">Pediatric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Affiliations</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Affiliations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Affiliations</SelectItem>
                  <SelectItem value="hospital-a">Hospital A</SelectItem>
                  <SelectItem value="hospital-b">Hospital B</SelectItem>
                  <SelectItem value="clinic-network">Clinic Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Volume</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Volumes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Volumes</SelectItem>
                  <SelectItem value="0-100">0 - 100</SelectItem>
                  <SelectItem value="100-300">100 - 300</SelectItem>
                  <SelectItem value="300-500">300 - 500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Star Rating</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox id="deliberate-duplicates" />
              <Label 
                htmlFor="deliberate-duplicates" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Deliberate Duplicates
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physician Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Physician Accounts</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                  const preparedData = activeRecords.map((record, index) => ({
                    Name: `Dr. ${record.firstName} ${record.lastName}`,
                    NPI: `12345${6789 + index}0`,
                    City: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                    State: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                    'One ID': record.mdmId,
                    Speciality: record.speciality[0],
                    'Sub Speciality': record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                    'Assigned Accounts': `EMR-${Math.floor(Math.random() * 9000) + 1000}, EMR-${Math.floor(Math.random() * 9000) + 1000}`,
                    'Distinct Patients': Math.floor(Math.random() * 500) + 100,
                    'Growth %': Math.floor(Math.random() * 20) + 1,
                    'Addressable Count': Math.floor(Math.random() * 300) + 50,
                  }));
                  exportToExcel(preparedData, 'Market_Analysis_Physicians');
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
                  const activeRecords = mockHCPs.filter((record) => record.status === "Active");
                  const preparedData = activeRecords.map((record, index) => ({
                    name: `Dr. ${record.firstName} ${record.lastName}`,
                    npi: `12345${6789 + index}0`,
                    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                    state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                    mdmId: record.mdmId,
                    speciality: record.speciality[0],
                    subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                    assignedAccounts: `EMR-${Math.floor(Math.random() * 9000) + 1000}, EMR-${Math.floor(Math.random() * 9000) + 1000}`,
                    distinctPatients: Math.floor(Math.random() * 500) + 100,
                    growth: Math.floor(Math.random() * 20) + 1,
                    addressableCount: Math.floor(Math.random() * 300) + 50,
                  }));

                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text('Market Analysis - Physician Accounts', 14, 15);
                  
                  autoTable(doc, {
                    startY: 25,
                    head: [['Name', 'NPI', 'City', 'State', 'One ID', 'Specialty', 'Distinct Patients', 'Growth %']],
                    body: preparedData.map(d => [
                      d.name,
                      d.npi,
                      d.city,
                      d.state,
                      d.mdmId,
                      d.speciality,
                      d.distinctPatients,
                      `${d.growth}%`
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: [33, 150, 243] },
                  });
                  
                  doc.save('Market_Analysis_Physicians.pdf');
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
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <SortIcon column="name" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('npi')}
                  >
                    NPI
                    <SortIcon column="npi" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('city')}
                  >
                    City
                    <SortIcon column="city" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('state')}
                  >
                    State
                    <SortIcon column="state" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('mdmId')}
                  >
                    One ID
                    <SortIcon column="mdmId" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('speciality')}
                  >
                    Speciality
                    <SortIcon column="speciality" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('subSpeciality')}
                  >
                    Sub Speciality
                    <SortIcon column="subSpeciality" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('assignedAccounts')}
                  >
                    Assigned Accounts
                    <SortIcon column="assignedAccounts" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('distinctPatients')}
                  >
                    Distinct Patients count
                    <SortIcon column="distinctPatients" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('growth')}
                  >
                    Growth %
                    <SortIcon column="growth" currentColumn={sortColumn} direction={sortDirection} />
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('addressableCount')}
                  >
                    Addressable count
                    <SortIcon column="addressableCount" currentColumn={sortColumn} direction={sortDirection} />
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
                    name: `Dr. ${record.firstName} ${record.lastName}`,
                    npi: `12345${6789 + index}0`,
                    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                    state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                    subSpeciality: record.speciality[0] === "Cardiology" ? "Interventional" : "General",
                    assignedAccounts: `EMR-${Math.floor(Math.random() * 9000) + 1000}, EMR-${Math.floor(Math.random() * 9000) + 1000}`,
                    distinctPatients: Math.floor(Math.random() * 500) + 100,
                    growth: Math.floor(Math.random() * 20) + 1,
                    addressableCount: Math.floor(Math.random() * 300) + 50,
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
                      <td className="py-3 px-4">{record.name}</td>
                      <td className="py-3 px-4 text-sm">{record.npi}</td>
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
                              description: `Pushing data for ${record.name}`,
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
          
          {/* Pagination */}
          {(() => {
            const activeRecords = mockHCPs.filter((record) => record.status === "Active");
            const preparedData = activeRecords.map((record, index) => ({
              ...record,
              name: `Dr. ${record.firstName} ${record.lastName}`,
              npi: `12345${6789 + index}0`,
              speciality: record.speciality,
            }));
            
            const filteredData = preparedData.filter((record) => {
              if (!searchTerm) return true;
              const search = searchTerm.toLowerCase();
              return (
                record.name.toLowerCase().includes(search) ||
                record.npi.toLowerCase().includes(search) ||
                record.speciality[0].toLowerCase().includes(search)
              );
            });
            
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            
            if (totalPages <= 1) return null;
            
            return (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
  );
};

export default MarketAnalysisHCP;
