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

interface DataTableProps {
  data: MDMEntity[];
  title: string;
}

export function DataTable({ data, title }: DataTableProps) {
  const navigate = useNavigate();

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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Type</TableHead>
                <TableHead>Org ID</TableHead>
                <TableHead>MDM ID</TableHead>
                <TableHead>Identifiers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((entity) => (
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
                      {entity.source}
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
      </CardContent>
    </Card>
  );
}
