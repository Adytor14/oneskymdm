import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Activity } from "lucide-react";

const TopAgencies = () => {
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
      value: agencies.length.toString(),
      icon: Building2,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Physician Accounts",
      value: agencies.reduce((sum, a) => sum + a.physicianAccounts, 0).toLocaleString(),
      icon: Users,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Total Patients",
      value: agencies.reduce((sum, a) => sum + a.distinctPatients, 0).toLocaleString(),
      icon: Activity,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Avg Growth Rate",
      value: `${(agencies.reduce((sum, a) => sum + a.growth, 0) / agencies.length).toFixed(1)}%`,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Top Agencies</h1>
      </div>

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
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Agencies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Agencies Overview</CardTitle>
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
                {agencies.map((agency, index) => (
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
  );
};

export default TopAgencies;
