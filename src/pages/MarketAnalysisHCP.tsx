import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
      <div className="max-w-[1400px]">
        <h1 className="text-3xl font-bold text-foreground">Market Analysis - Physician Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Analyze physician market data and trends
        </p>
      </div>

      {/* HCP Metrics */}
      <div className="max-w-[1400px] grid gap-4 md:grid-cols-3">
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
      <div className="max-w-[1400px]">
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
              <label className="text-sm font-medium">Counties</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  <SelectItem value="kings">Kings County</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles County</SelectItem>
                  <SelectItem value="cook">Cook County</SelectItem>
                  <SelectItem value="harris">Harris County</SelectItem>
                  <SelectItem value="maricopa">Maricopa County</SelectItem>
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
      </div>

      {/* Physician Accounts Table */}
      <Card className="max-w-[1400px]">
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
                    'Medical Director': ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis"][index % 5],
                    'MD - Agency': ["Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare"][index % 5],
                    'L4QTR Top Referring Agency': ["Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare"][index % 5],
                    'L4QTR Patient Count_1': Math.floor(Math.random() * 200) + 50,
                    '% of Total Patients_1': (Math.random() * 30 + 10).toFixed(1) + '%',
                    'L4QTR Second Highest Referring Agency': ["OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare", "Skyra Medical"][index % 5],
                    'L4QTR Patient Count_2': Math.floor(Math.random() * 150) + 40,
                    '% of Total Patients_2': (Math.random() * 20 + 8).toFixed(1) + '%',
                    'L4QTR Third Referring Agency': ["JetHealth Agency", "OpusCare Services", "Choice Healthcare", "Skyra Medical", "OneSky Home Health"][index % 5],
                    'L4QTR Patient Count_3': Math.floor(Math.random() * 100) + 30,
                    '% of Total Patients_3': (Math.random() * 15 + 5).toFixed(1) + '%',
                    'L4QTR Forth Highest Referring Agency': ["OpusCare Services", "Choice Healthcare", "Skyra Medical", "OneSky Home Health", "JetHealth Agency"][index % 5],
                    'L4QTR Patient Count_4': Math.floor(Math.random() * 80) + 20,
                    '% of Total Patients_4': (Math.random() * 10 + 3).toFixed(1) + '%',
                    'L4QTR Fifth Referring Agency': ["Choice Healthcare", "Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services"][index % 5],
                    'L4QTR Patient Count_5': Math.floor(Math.random() * 60) + 15,
                    '% of Total Patients_5': (Math.random() * 8 + 2).toFixed(1) + '%',
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
                    rank: index + 1,
                    name: `Dr. ${record.firstName} ${record.lastName}`,
                    npi: `12345${6789 + index}0`,
                    county: ["Kings County", "Los Angeles County", "Cook County", "Harris County", "Maricopa County"][index % 5],
                    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                    state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
                    speciality: record.speciality[0],
                    mdmId: record.mdmId,
                    annualPatientCount: Math.floor(Math.random() * 2000) + 500,
                    l4qtrPatientCount: Math.floor(Math.random() * 500) + 100,
                    growth: Math.floor(Math.random() * 20) + 1,
                    medicalDirector: ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis"][index % 5],
                    mdAgency: ["Skyra Medical", "OneSky Home Health", "JetHealth Agency", "OpusCare Services", "Choice Healthcare"][index % 5],
                  }));

                  const doc = new jsPDF('landscape');
                  doc.setFontSize(16);
                  doc.text('Market Analysis - Physician Accounts', 14, 15);
                  
                  autoTable(doc, {
                    startY: 25,
                    head: [['Rank', 'Name', 'NPI', 'County', 'City', 'State', 'Specialty', 'ONE ID', 'Annual Patient Count', 'L4QTR Patient Count', 'Growth %']],
                    body: preparedData.map(d => [
                      d.rank,
                      d.name,
                      d.npi,
                      d.county,
                      d.city,
                      d.state,
                      d.speciality,
                      d.mdmId,
                      d.annualPatientCount,
                      d.l4qtrPatientCount,
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
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="p-6">
                <table className="w-full"  style={{ minWidth: 'max-content' }}>
              <thead>
                <tr className="border-b">
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
                  
                  // Prepare data with computed columns
                  const preparedData = activeRecords.map((record, index) => ({
                    ...record,
                    rank: index + 1 + (currentPage - 1) * itemsPerPage,
                    name: `Dr. ${record.firstName} ${record.lastName}`,
                    npi: `12345${6789 + index}0`,
                    county: ["Kings County", "Los Angeles County", "Cook County", "Harris County", "Maricopa County"][index % 5],
                    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
                    state: ["NY", "CA", "IL", "TX", "AZ"][index % 5],
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
                      <td className="py-3 px-4 text-sm">{record.speciality[0]}</td>
                      <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                      <td className="py-3 px-4 text-sm font-medium">{record.annualPatientCount}</td>
                      <td className="py-3 px-4 text-sm font-medium">{record.l4qtrPatientCount}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{record.growth}%</td>
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
          </div>
          
          {/* Pagination */}
          <div className="p-6 pt-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysisHCP;
