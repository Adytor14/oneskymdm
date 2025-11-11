import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type ServiceLine = "Home Health" | "Hospice";

export const ServiceLineSwitcher = () => {
  const [currentServiceLine, setCurrentServiceLine] = useState<ServiceLine | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedServiceLine = localStorage.getItem("selectedServiceLine") as ServiceLine;
    if (savedServiceLine) {
      setCurrentServiceLine(savedServiceLine);
    } else {
      setCurrentServiceLine("Home Health");
      localStorage.setItem("selectedServiceLine", "Home Health");
    }
  }, []);

  const handleServiceLineChange = (newServiceLine: ServiceLine) => {
    localStorage.setItem("selectedServiceLine", newServiceLine);
    setCurrentServiceLine(newServiceLine);
    toast({
      title: "Service Line Updated",
      description: `Switched to ${newServiceLine}`,
    });
  };

  if (!currentServiceLine) return null;

  return (
    <div className="flex items-center gap-2">
      <Select value={currentServiceLine} onValueChange={handleServiceLineChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Home Health">Home Health</SelectItem>
          <SelectItem value="Hospice">Hospice</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
