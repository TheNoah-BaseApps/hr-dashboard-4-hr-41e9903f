'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';
import Breadcrumb from '@/components/Breadcrumb';

type LeaveRecord = {
  id: number;
  date: string;
  status: string;
  type: string;
  duration: number;
  assigned_to: string;
  comment: string | null;
};

export default function LeaveAttendancePage() {
  const [records, setRecords] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/leave-attendance');
        if (!res.ok) throw new Error('Failed to fetch leave records');
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        setError('Failed to load leave records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status' },
    { header: 'Type', accessor: 'type' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Assigned To', accessor: 'assigned_to' },
  ];

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Leave & Attendance', href: '/leave-attendance' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leave & Attendance</h1>
        <Button asChild>
          <Link href="/leave-attendance/0">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      {records.length > 0 ? (
        <DataTable 
          data={records} 
          columns={columns} 
          basePath="/leave-attendance" 
        />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No leave records found.</p>
        </div>
      )}
    </div>
  );
}