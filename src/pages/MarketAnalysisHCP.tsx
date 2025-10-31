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
import { Database, Users, Eye, ArrowUpRight, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MarketAnalysisHCP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search physicians..." className="pl-9" />
              </div>
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
    </div>
  );
};

export default MarketAnalysisHCP;
