import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockDCRs } from "@/lib/mockData";
import { Search, Eye, FileText, TrendingUp, AlertCircle, Clock } from "lucide-react";

const DCRList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = mockDCRs.filter((item) => {
    const matchesSearch =
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const activeCount = mockDCRs.filter(dcr => dcr.status === "Active").length;
  const inactiveCount = mockDCRs.filter(dcr => dcr.status === "Inactive").length;
  const pendingCount = 0;

  const metrics = [
    { title: "Total DCR Records", value: mockDCRs.length.toString(), icon: FileText, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Active DCRs", value: activeCount.toString(), icon: TrendingUp, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Inactive DCRs", value: inactiveCount.toString(), icon: AlertCircle, bgColor: "bg-gray-50", iconColor: "text-gray-600" },
    { title: "Pending DCRs", value: pendingCount.toString(), icon: Clock, bgColor: "bg-orange-50", iconColor: "text-orange-600" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">DCR Profiles</h1>
        <p className="text-muted-foreground mt-1">
          Data collection reports - Manage and view DCR records, visit details, and outcomes
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by ID or identifier..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Type</label>
              <Select defaultValue="dcr">
                <SelectTrigger>
                  <SelectValue placeholder="DCR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dcr">DCR</SelectItem>
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
              <Input placeholder="e.g., Field Reports, CRM" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Master Data Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Master Data Records</CardTitle>
            <p className="text-sm text-muted-foreground">Showing {filteredData.length} of {mockDCRs.length} records</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Report ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Org ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">MDM ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Visit Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record, index) => (
                  <tr 
                    key={index} 
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/dcr/${record.mdmId}`)}
                  >
                    <td className="py-3 px-4">DCR-{record.mdmId.slice(-6)}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">DCR</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{record.orgId}</td>
                    <td className="py-3 px-4 text-sm">{record.mdmId}</td>
                    <td className="py-3 px-4 text-sm">Field Visit</td>
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
                      <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
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

export default DCRList;
