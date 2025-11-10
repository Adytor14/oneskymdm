import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, Activity, Database, Search, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const TopAgencies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedPayers, setSelectedPayers] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState("");

  const states = ["California", "Texas", "Florida", "New York", "Illinois"];
  const counties = ["Los Angeles", "Harris", "Miami-Dade", "Kings", "Cook"];
  const payers = ["Medicare", "Medicaid", "Private Insurance", "Uninsured"];

  const agencies = [
    {
      name: "Reliant Medical Group",
      type: "Healthcare Network",
      physicianAccounts: 2847,
      facilityAccounts: 468,
      distinctPatients: 45621,
      growth: 12.5,
      status: "Active",
      logo: "/src/assets/reliant-logo.png"
    },
    {
      name: "Opuscare",
      type: "Healthcare Solutions",
      physicianAccounts: 1923,
      facilityAccounts: 312,
      distinctPatients: 32145,
      growth: 8.3,
      status: "Active",
      logo: "/src/assets/opuscare-logo.png"
    },
    {
      name: "Choice Medical",
      type: "Primary Care Network",
      physicianAccounts: 2156,
      facilityAccounts: 389,
      distinctPatients: 38942,
      growth: 15.7,
      status: "Active",
      logo: "/src/assets/choice-logo.png"
    },
    {
      name: "JetHealth",
      type: "Urgent Care Provider",
      physicianAccounts: 1534,
      facilityAccounts: 256,
      distinctPatients: 28634,
      growth: 10.2,
      status: "Active",
      logo: "/src/assets/jethealth-logo.png"
    },
    {
      name: "Skyra Medical",
      type: "Specialty Care",
      physicianAccounts: 1789,
      facilityAccounts: 298,
      distinctPatients: 31247,
      growth: 9.8,
      status: "Active",
      logo: "/src/assets/skyra-logo.png"
    },
    {
      name: "OneSky Health",
      type: "Integrated Health System",
      physicianAccounts: 3214,
      facilityAccounts: 542,
      distinctPatients: 52389,
      growth: 18.4,
      status: "Active",
      logo: "/src/assets/OneSky-logo.png"
    },
    {
      name: "Pfizer Healthcare Partners",
      type: "Pharmaceutical Network",
      physicianAccounts: 4521,
      facilityAccounts: 687,
      distinctPatients: 68234,
      growth: 14.2,
      status: "Active",
      logo: null
    },
    {
      name: "Johnson & Johnson Medical",
      type: "Healthcare Provider",
      physicianAccounts: 3876,
      facilityAccounts: 598,
      distinctPatients: 59421,
      growth: 11.6,
      status: "Active",
      logo: null
    },
    {
      name: "Novartis Care Network",
      type: "Specialty Pharmacy",
      physicianAccounts: 2943,
      facilityAccounts: 423,
      distinctPatients: 42156,
      growth: 13.9,
      status: "Active",
      logo: null
    },
    {
      name: "Merck Medical Solutions",
      type: "Clinical Network",
      physicianAccounts: 2654,
      facilityAccounts: 378,
      distinctPatients: 38765,
      growth: 7.4,
      status: "Active",
      logo: null
    }
  ];

  const topMetrics = [
    {
      title: "Total Agencies",
      value: "10",
      icon: Building2,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Facility Account",
      value: "300",
      icon: Building2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Total Patients",
      value: "437,554",
      subtitle: "Physicians",
      secondaryValue: "~20,000",
      secondarySubtitle: "Facilities",
      icon: Activity,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "L4QTR Growth Rate",
      value: "12.2%",
      subtitle: "Physicians",
      secondaryValue: "8%",
      secondarySubtitle: "Facilities",
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="w-full space-y-6 p-6">
      <div className="max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Top Agencies</h1>
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

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {topMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  {metric.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                  )}
                  {metric.secondaryValue && (
                    <>
                      <div className="text-2xl font-bold mt-2">{metric.secondaryValue}</div>
                      <p className="text-xs text-muted-foreground mt-1">{metric.secondarySubtitle}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Agencies Table */}
      <div className="max-w-[1400px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Healthcare Agencies Overview</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search agencies..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Agency Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Physician Accounts</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Facility Accounts</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Distinct Patients</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Growth %</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {agencies
                  .filter((agency) => {
                    if (!searchTerm) return true;
                    const search = searchTerm.toLowerCase();
                    return (
                      agency.name.toLowerCase().includes(search) ||
                      agency.type.toLowerCase().includes(search)
                    );
                  })
                  .map((agency, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {agency.logo && (
                          <img 
                            src={agency.logo} 
                            alt={agency.name}
                            className="h-8 w-8 object-contain"
                          />
                        )}
                        <span className="font-medium">{agency.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{agency.type}</td>
                    <td className="py-3 px-4 text-sm font-medium">{agency.physicianAccounts.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-medium">{agency.facilityAccounts.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-medium">{agency.distinctPatients.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-green-600 font-medium">
                        {agency.growth}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {agency.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default TopAgencies;
