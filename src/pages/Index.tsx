import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MapPin, FileText, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToJSON } from "@/lib/exportUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Index = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Healthcare Professionals",
      description: "Manage HCP profiles, credentials, and affiliations",
      icon: Users,
      count: "2,547",
      route: "/hcp",
      color: "bg-medical-500",
    },
    {
      title: "Healthcare Organizations",
      description: "Manage HCO profiles, facilities, and departments",
      icon: Building2,
      count: "342",
      route: "/hco",
      color: "bg-medical-600",
    },
    {
      title: "Address Records",
      description: "Manage address information and locations",
      icon: MapPin,
      count: "1,823",
      route: "/address",
      color: "bg-medical-700",
    },
    {
      title: "Doctor Call Reports",
      description: "Manage DCR records, visit details, and outcomes",
      icon: FileText,
      count: "5,129",
      route: "/dcr",
      color: "bg-medical-800",
    },
  ];

  const marketShareData = [
    { name: "Product A", value: 35, fill: "hsl(var(--chart-1))" },
    { name: "Product B", value: 25, fill: "hsl(var(--chart-2))" },
    { name: "Product C", value: 20, fill: "hsl(var(--chart-3))" },
    { name: "Product D", value: 15, fill: "hsl(var(--chart-4))" },
    { name: "Others", value: 5, fill: "hsl(var(--chart-5))" },
  ];

  const geographyData = [
    { region: "North", patients: 1200 },
    { region: "South", patients: 950 },
    { region: "East", patients: 1450 },
    { region: "West", patients: 800 },
    { region: "Central", patients: 1100 },
  ];

  const referralNetworkData = [
    { network: "Network A", referrals: 450 },
    { network: "Network B", referrals: 380 },
    { network: "Network C", referrals: 320 },
    { network: "Network D", referrals: 280 },
    { network: "Network E", referrals: 210 },
  ];

  const totalPopulationData = [
    { category: "HCP", count: 2547 },
    { category: "HCO", count: 342 },
    { category: "Addresses", count: 1823 },
    { category: "DCR", count: 5129 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
    patients: {
      label: "Patients",
      color: "hsl(var(--chart-2))",
    },
    referrals: {
      label: "Referrals",
      color: "hsl(var(--chart-3))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-4))",
    },
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text("Master Data Management Dashboard", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary Report", 14, 30);
    
    // Total Population
    autoTable(doc, {
      startY: 40,
      head: [["Category", "Count"]],
      body: totalPopulationData.map(d => [d.category, d.count.toString()]),
      theme: "striped",
      headStyles: { fillColor: [33, 150, 243] },
    });
    
    // Market Share
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Market Share", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Product", "Share (%)"]],
      body: marketShareData.map(d => [d.name, d.value.toString() + "%"]),
      theme: "striped",
      headStyles: { fillColor: [33, 150, 243] },
    });
    
    // Patients by Geography
    finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Patients by Geography", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Region", "Patients"]],
      body: geographyData.map(d => [d.region, d.patients.toString()]),
      theme: "striped",
      headStyles: { fillColor: [33, 150, 243] },
    });
    
    // Top Referral Networks
    finalY = (doc as any).lastAutoTable.finalY + 10;
    if (finalY > 250) {
      doc.addPage();
      finalY = 20;
    }
    doc.text("Top Referral Networks", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Network", "Referrals"]],
      body: referralNetworkData.map(d => [d.network, d.referrals.toString()]),
      theme: "striped",
      headStyles: { fillColor: [33, 150, 243] },
    });
    
    doc.save("Dashboard_Report.pdf");
  };

  const handleExportExcel = () => {
    const exportData = {
      "Total Population": totalPopulationData,
      "Market Share": marketShareData.map(d => ({ Product: d.name, "Share (%)": d.value })),
      "Patients by Geography": geographyData,
      "Top Referral Networks": referralNetworkData,
    };
    exportToExcel(exportData, "Dashboard_Report");
  };

  const handleExportJSON = () => {
    const exportData = {
      totalPopulation: totalPopulationData,
      marketShare: marketShareData,
      patientsByGeography: geographyData,
      topReferralNetworks: referralNetworkData,
      generatedAt: new Date().toISOString(),
    };
    exportToJSON(exportData, "Dashboard_Report");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Master Data Management</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive Healthcare Data Management Portal
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportExcel}>
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
              Export to PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON}>
              Export to JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.route}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(card.route)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                <Button variant="ghost" className="w-full mt-4" size="sm">
                  View All
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Share</CardTitle>
            <CardDescription>Product distribution across market segments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients by Geography</CardTitle>
            <CardDescription>Regional patient distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={geographyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="patients" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referral Networks</CardTitle>
            <CardDescription>Leading referral network performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={referralNetworkData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="network" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="referrals" fill="hsl(var(--chart-3))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Population</CardTitle>
            <CardDescription>Records by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={totalPopulationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
