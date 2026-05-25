import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ResponsiveCRMTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (item: T) => ReactNode;
};

type ResponsiveCRMTableProps<T> = {
  title: string;
  description?: string;
  data: T[];
  columns: ResponsiveCRMTableColumn<T>[];
  mobileCards: (item: T) => ReactNode;
  emptyState?: ReactNode;
};

export function ResponsiveCRMTable<T>({
  title,
  description,
  data,
  columns,
  mobileCards,
  emptyState = <p className="text-sm text-zinc-500">No records available.</p>,
}: ResponsiveCRMTableProps<T>) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm leading-6 text-zinc-400">{description}</p> : null}
      </CardHeader>
      <CardContent>
        {data.length ? (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.key} className={column.className}>
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.key} className={column.className}>
                          {column.cell(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="space-y-3 md:hidden">
              {data.map((item, index) => (
                <div key={index}>{mobileCards(item)}</div>
              ))}
            </div>
          </>
        ) : (
          emptyState
        )}
      </CardContent>
    </Card>
  );
}
