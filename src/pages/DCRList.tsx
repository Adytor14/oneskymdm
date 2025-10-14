import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { mockDCRs } from "@/lib/mockData";
import { DCRProfile } from "@/types/mdm";
import { ChangeRequestDialog } from "@/components/ChangeRequestDialog";

const DCRList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = mockDCRs.filter((item) => {
    const matchesSearch =
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Call Reports</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view DCR records, visit details, and outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <ChangeRequestDialog dcrId={filteredData[0]?.mdmId || "DCR-001"} />
        </div>
      </div>

      <FilterPanel
        entityType="DCR"
        onEntityTypeChange={() => {}}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={selectedStatus}
        onStatusFilterChange={setSelectedStatus}
      />

      <DataTable data={filteredData} title="Doctor Call Reports" />
    </div>
  );
};

export default DCRList;
