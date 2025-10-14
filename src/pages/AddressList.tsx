import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { mockAddresses } from "@/lib/mockData";
import { Address } from "@/types/mdm";

const AddressList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = mockAddresses.filter((item) => {
    const matchesSearch =
      item.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mdmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Address Records</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view address information and locations
          </p>
        </div>
      </div>

      <FilterPanel
        entityType="Address"
        onEntityTypeChange={() => {}}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={selectedStatus}
        onStatusFilterChange={setSelectedStatus}
      />

      <DataTable data={filteredData} title="Address Records" />
    </div>
  );
};

export default AddressList;
