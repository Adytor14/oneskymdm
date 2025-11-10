import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MDMEntity } from "@/types/mdm";
import { ChangeRequestDialog } from "./ChangeRequestDialog";
import { ArrowUpDown, ChevronUp, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { exportToExcel } from "@/lib/exportUtils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps {
  data: MDMEntity[];
  title: string;
}

export function DataTable({ data, title }: DataTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Sort icon component
  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-3 w-3 ml-1 inline" /> : 
      <ChevronDown className="h-3 w-3 ml-1 inline" />;
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = data.map((entity) => [
      entity.type,
      entity.orgId,
      entity.mdmId,
      entity.identifiers.join(", "),
      entity.status,
      entity.lastUpdated,
    ]);

    autoTable(doc, {
      head: [["Type", "Org ID", "MDM ID", "Identifiers", "Status", "Last Updated"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    toast({
      title: "Export successful",
      description: "Data has been exported to PDF",
    });
  };

  // Export to Excel
  const handleExportExcel = () => {
    const excelData = data.map((entity) => ({
      "Entity Type": entity.type,
      "Org ID": entity.orgId,
      "Skyra MDM ID": entity.mdmId,
      "Identifiers": entity.identifiers.join(", "),
      "Status": entity.status,
      "Last Updated": entity.lastUpdated,
    }));

    exportToExcel(excelData, `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`);
    toast({
      title: "Export successful",
      description: "Data has been exported to Excel",
    });
  };

  // Sort data
  let sortedData = [...data];
  if (sortColumn) {
    sortedData.sort((a: any, b: any) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (sortColumn === 'identifiers') {
        aVal = a.identifiers.join(", ");
        bVal = b.identifiers.join(", ");
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (bVal > aVal ? 1 : -1);
    });
  }

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Inactive":
        return "bg-muted text-muted-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const handleRowClick = (entity: MDMEntity) => {
    const type = entity.type.toLowerCase();
    navigate(`/${type}/${entity.id}`);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export to PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('type')}
                >
                  Entity Type
                  <SortIcon column="type" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('orgId')}
                >
                  Org ID
                  <SortIcon column="orgId" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('mdmId')}
                >
                  Skyra MDM ID
                  <SortIcon column="mdmId" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('identifiers')}
                >
                  Identifiers
                  <SortIcon column="identifiers" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <SortIcon column="status" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('lastUpdated')}
                >
                  Last Updated
                  <SortIcon column="lastUpdated" />
                </TableHead>
                <TableHead className="w-[100px]">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((entity) => (
                  <TableRow
                    key={entity.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(entity)}>
                      {entity.type}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleRowClick(entity)}>
                      {entity.orgId}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleRowClick(entity)}>
                      {entity.mdmId}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleRowClick(entity)}>
                      <div className="flex gap-1 flex-wrap">
                        {entity.identifiers.slice(0, 2).map((id, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {id}
                          </Badge>
                        ))}
                        {entity.identifiers.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{entity.identifiers.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleRowClick(entity)}>
                      <Badge className={getStatusColor(entity.status)}>
                        {entity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleRowClick(entity)}>
                      {entity.lastUpdated}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <ChangeRequestDialog 
                        entityType={entity.type} 
                        entityId={entity.mdmId} 
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, idx) => (
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
