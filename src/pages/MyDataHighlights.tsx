import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, User, Building2 } from "lucide-react";

const MyDataHighlights = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Highlights</h1>
        <p className="text-muted-foreground">
          Key insights and metrics from your physician and facility accounts
        </p>
      </div>

      {/* Physician Accounts Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Physician Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Top Specialty</p>
              <p className="text-lg font-semibold">Cardiology</p>
              <p className="text-xs text-muted-foreground">32% of total physicians</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Highest Growth Region</p>
              <p className="text-lg font-semibold">New York</p>
              <p className="text-xs text-muted-foreground">+12.5% quarter over quarter</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Patient Volume</p>
              <p className="text-lg font-semibold">287 patients</p>
              <p className="text-xs text-muted-foreground">Per physician account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facility Accounts Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Facility Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Top Facility Type</p>
              <p className="text-lg font-semibold">General Hospital</p>
              <p className="text-xs text-muted-foreground">58% of total facilities</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Highest Census Growth</p>
              <p className="text-lg font-semibold">California</p>
              <p className="text-xs text-muted-foreground">+15.3% quarter over quarter</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Patient Volume</p>
              <p className="text-lg font-semibold">1,243 patients</p>
              <p className="text-xs text-muted-foreground">Per facility account</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDataHighlights;
