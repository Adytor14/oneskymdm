import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { getAllEntities } from "@/lib/mockData";
import { MDMEntity } from "@/types/mdm";

const Index = () => {
  const [entityType, setEntityType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const allEntities = getAllEntities();

  const filteredData = allEntities.filter((entity: MDMEntity) => {
    const matchesType = entityType === "All" || entity.type === entityType;
    const matchesStatus = statusFilter === "All" || entity.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      entity.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.orgId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.identifiers.some((id) =>
        id.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Master Data Management
          </h1>
          <p className="text-muted-foreground">
            Centralized healthcare entity management and data governance
          </p>
        </div>

        <FilterPanel
          entityType={entityType}
          onEntityTypeChange={setEntityType}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <DataTable data={filteredData} title="Master Data Records" />
      </div>
    </div>
  );
};

export default Index;
