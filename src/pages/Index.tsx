import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MapPin, FileText } from "lucide-react";

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Master Data Management</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive Healthcare Data Management Portal
          </p>
        </div>
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
    </div>
  );
};

export default Index;
