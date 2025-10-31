import { useState, useEffect } from "react";
import { Building2, Heart, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const serviceLines = [
  {
    name: "Home Health",
    icon: Building2,
    value: "home-health",
  },
  {
    name: "Hospice",
    icon: Heart,
    value: "hospice",
  },
];

export function ServiceLineSwitcher() {
  const [selectedServiceLine, setSelectedServiceLine] = useState(() => {
    return localStorage.getItem("selectedServiceLine") || "home-health";
  });

  useEffect(() => {
    localStorage.setItem("selectedServiceLine", selectedServiceLine);
  }, [selectedServiceLine]);

  const currentServiceLine = serviceLines.find((sl) => sl.value === selectedServiceLine) || serviceLines[0];
  const CurrentIcon = currentServiceLine.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentServiceLine.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background z-50">
        {serviceLines.map((serviceLine) => {
          const Icon = serviceLine.icon;
          return (
            <DropdownMenuItem
              key={serviceLine.value}
              onClick={() => setSelectedServiceLine(serviceLine.value)}
              className={`gap-2 cursor-pointer ${
                selectedServiceLine === serviceLine.value
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{serviceLine.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
