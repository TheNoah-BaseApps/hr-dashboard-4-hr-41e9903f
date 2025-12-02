'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PayrollForm from '@/components/PayrollForm';
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

export default function PayrollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [record, setRecord] = useState<PayrollRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === '0') {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        const res = await fetch(`/api/payroll/${id}`);
        if (!res.ok) throw new Error('Failed to fetch payroll record');
        const data = await res.json();
        setRecord(data);
      } catch (err) {
        setError('Failed to load payroll record');
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
          { label: 'Payroll Management', href: '/payroll' },
          { label: record ? 'Edit Record' : 'New Record', href: `/payroll/${id}` }
        ]} 
      />
      <h1 className="text-3xl font-bold">
        {record ? 'Edit Payroll Record' : 'Create Payroll Record'}
      </h1>
      
      <PayrollForm 
        record={record} 
        onSuccess={() => router.push('/payroll')} 
      />
    </div>
  );
}