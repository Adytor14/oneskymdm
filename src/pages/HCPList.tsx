import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { mockHCPs } from "@/lib/mockData";
import { HCPProfile } from "@/types/mdm";

const HCPList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const filteredData = mockHCPs.filter((item) => {
    const matchesSearch =
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSpecialty = selectedSpecialty === "all" || item.speciality.includes(selectedSpecialty);

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Healthcare Professionals</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view HCP profiles, credentials, and affiliations
          </p>
        </div>
      </div>

      <FilterPanel
        entityType="HCP"
        onEntityTypeChange={() => {}}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={selectedStatus}
        onStatusFilterChange={setSelectedStatus}
      />

      <DataTable data={filteredData} title="Healthcare Professionals" />
    </div>
  );
};

export default HCPList;
