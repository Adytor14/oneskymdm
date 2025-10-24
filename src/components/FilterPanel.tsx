import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterPanelProps {
  entityType: string;
  onEntityTypeChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function FilterPanel({
  entityType,
  onEntityTypeChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FilterPanelProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Filter Master Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entity-type">Entity Type</Label>
            <Select value={entityType} onValueChange={onEntityTypeChange}>
              <SelectTrigger id="entity-type">
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="HCP">Physician Accounts</SelectItem>
                <SelectItem value="HCO">Facility Accounts</SelectItem>
                <SelectItem value="Address">Addresses</SelectItem>
                <SelectItem value="DCR">Data Change Requests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search MDM ID, Org ID..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
