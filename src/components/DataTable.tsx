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
import { MDMEntity } from "@/types/mdm";

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
                data.map((entity) => (
                  <TableRow
                    key={entity.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(entity)}
                  >
                    <TableCell className="font-medium">{entity.type}</TableCell>
                    <TableCell>{entity.orgId}</TableCell>
                    <TableCell>{entity.mdmId}</TableCell>
                    <TableCell>
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
                    <TableCell>
                      <Badge className={getStatusColor(entity.status)}>
                        {entity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{entity.source}</TableCell>
                    <TableCell>{entity.lastUpdated}</TableCell>
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
