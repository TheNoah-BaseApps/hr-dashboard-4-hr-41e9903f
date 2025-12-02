'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';
import Breadcrumb from '@/components/Breadcrumb';

type PayrollRecord = {
  id: number;
  name: string;
  ssn: string;
  address: string;
  occupation: string;
  gender: string;
  hire_date: string;
  salary: number;
  regular_hourly_rate: number | null;
  overtime_hourly_rate: number | null;
  exempt_from_overtime: boolean;
  federal_allowances: number;
  retirement_contribution: number;
  insurance_deduction: number;
  other_deductions: number;
};

export default function PayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/payroll');
        if (!res.ok) throw new Error('Failed to fetch payroll records');
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        setError('Failed to load payroll records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'SSN', accessor: 'ssn' },
    { header: 'Occupation', accessor: 'occupation' },
    { header: 'Salary', accessor: 'salary' },
    { header: 'Hire Date', accessor: 'hire_date' },
  ];

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Payroll Management', href: '/payroll' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payroll Management</h1>
        <Button asChild>
          <Link href="/payroll/0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      {records.length > 0 ? (
        <DataTable 
          data={records} 
          columns={columns} 
          basePath="/payroll" 
        />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No payroll records found.</p>
        </div>
      )}
    </div>
  );
}