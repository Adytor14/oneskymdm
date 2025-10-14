import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { mockHCOs } from "@/lib/mockData";
import { HCOProfile } from "@/types/mdm";

const HCOList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = mockHCOs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Healthcare Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view HCO profiles, facilities, and departments
          </p>
        </div>
      </div>

      <FilterPanel
        entityType="HCO"
        onEntityTypeChange={() => {}}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={selectedStatus}
        onStatusFilterChange={setSelectedStatus}
      />

      <DataTable data={filteredData} title="Healthcare Organizations" />
    </div>
  );
};

export default HCOList;
