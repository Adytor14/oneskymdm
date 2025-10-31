import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockHCOs } from "@/lib/mockData";
import { Database, Building2, Eye } from "lucide-react";

const MarketAnalysisHCO = () => {
  const navigate = useNavigate();

  const hcoMetrics = [
    { title: "Total Facility Accounts", value: "468", bgColor: "bg-blue-50" },
    { title: "Active Facilities", value: "441", bgColor: "bg-green-50" },
    { title: "Growth", value: "8.3%", bgColor: "bg-gray-50" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Market Analysis - Facility Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Analyze facility market data and trends
        </p>
      </div>

      {/* HCO Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {hcoMetrics.map((metric, index) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Facility Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Facility Accounts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing 441 of 468 profiles
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Org ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Skyra MDM ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Identifiers</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Distinct Patients count</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Growth %</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Addressable count</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody>
                {mockHCOs
                  .filter((record) => record.status === "Active")
                  .slice(0, 10)
                  .map((record, index) => {
                    // Mock data for new columns
                    const distinctPatients = Math.floor(Math.random() * 2000) + 500;
                    const growth = Math.floor(Math.random() * 25) + 5;
                    const addressableCount = Math.floor(Math.random() * 1000) + 200;
                    
                    return (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/hco/${record.id}`)}
                      >
                        <td className="py-3 px-4">{record.name}</td>
                        <td className="py-3 px-4 text-sm">{record.orgId}</td>
                        <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                        <td className="py-3 px-4 text-sm">{record.identifiers.join(", ")}</td>
                        <td className="py-3 px-4 text-sm font-medium">{distinctPatients}</td>
                        <td className="py-3 px-4 text-sm text-green-600 font-medium">{growth}%</td>
                        <td className="py-3 px-4 text-sm font-medium">{addressableCount}</td>
                        <td className="py-3 px-4">
                          <Eye 
                            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/hco/${record.id}`);
                            }}
                          />
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

export default MarketAnalysisHCO;
