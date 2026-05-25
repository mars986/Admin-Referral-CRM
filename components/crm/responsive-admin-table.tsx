import type { ReactNode } from "react";
import { MobileDataCard } from "@/components/crm/mobile-data-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ResponsiveTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (item: T) => ReactNode;
};

type ResponsiveAdminTableProps<T> = {
  title: string;
  description?: string;
  data: T[];
  columns: ResponsiveTableColumn<T>[];
  mobileCard: (item: T) => {
    title: ReactNode;
    eyebrow?: ReactNode;
    meta?: ReactNode;
    content: ReactNode;
  };
  emptyState?: ReactNode;
};

export function ResponsiveAdminTable<T>({
  title,
  description,
  data,
  columns,
  mobileCard,
  emptyState = <p className="text-sm text-slate-400">No records available.</p>,
}: ResponsiveAdminTableProps<T>) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
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
              {data.map((item, index) => {
                const card = mobileCard(item);

                return (
                  <MobileDataCard
                    key={index}
                    title={card.title}
                    eyebrow={card.eyebrow}
                    meta={card.meta}
                  >
                    {card.content}
                  </MobileDataCard>
                );
              })}
            </div>
          </>
        ) : (
          emptyState
        )}
      </CardContent>
    </Card>
  );
}
