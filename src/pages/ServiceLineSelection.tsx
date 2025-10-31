import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Heart } from "lucide-react";

const ServiceLineSelection = () => {
  const navigate = useNavigate();

  const handleServiceLineSelect = (serviceLine: string) => {
    localStorage.setItem("selectedServiceLine", serviceLine);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Welcome to OneSky</h1>
          <p className="text-muted-foreground text-lg">Please select your service line to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Home Health</CardTitle>
              <CardDescription className="text-base">
                Access home health services and patient management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handleServiceLineSelect("Home Health")}
              >
                Select Home Health
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Hospice</CardTitle>
              <CardDescription className="text-base">
                Access hospice care services and patient management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handleServiceLineSelect("Hospice")}
              >
                Select Hospice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceLineSelection;
