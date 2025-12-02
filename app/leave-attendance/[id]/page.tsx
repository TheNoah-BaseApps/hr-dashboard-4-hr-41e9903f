'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeaveAttendanceForm from '@/components/LeaveAttendanceForm';
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

export default function LeaveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [record, setRecord] = useState<LeaveRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === '0') {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        const res = await fetch(`/api/leave-attendance/${id}`);
        if (!res.ok) throw new Error('Failed to fetch leave record');
        const data = await res.json();
        setRecord(data);
      } catch (err) {
        setError('Failed to load leave record');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: 'Leave & Attendance', href: '/leave-attendance' },
          { label: record ? 'Edit Record' : 'New Record', href: `/leave-attendance/${id}` }
        ]} 
      />
      <h1 className="text-3xl font-bold">
        {record ? 'Edit Leave Record' : 'Create Leave Record'}
      </h1>
      
      <LeaveAttendanceForm 
        record={record} 
        onSuccess={() => router.push('/leave-attendance')} 
      />
    </div>
  );
}