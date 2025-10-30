import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopAgencies = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Top Agencies</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Top Agencies data will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopAgencies;
