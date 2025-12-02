import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface DataTableProps {
  data: any[];
  columns: { header: string; accessor: string }[];
  basePath: string;
}

export default function DataTable({ data, columns, basePath }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessor}>{column.header}</TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.accessor}>
                  {column.accessor === 'date' || column.accessor === 'due_date' || column.accessor === 'hire_date'
                    ? new Date(row[column.accessor]).toLocaleDateString()
                    : row[column.accessor]}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`${basePath}/${row.id}`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}