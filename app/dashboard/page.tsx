'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/MetricCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';

type Metrics = {
  onboarding: number;
  leave: number;
  payroll: number;
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [onboardingRes, leaveRes, payrollRes] = await Promise.all([
          fetch('/api/onboarding'),
          fetch('/api/leave-attendance'),
          fetch('/api/payroll'),
        ]);

        if (!onboardingRes.ok || !leaveRes.ok || !payrollRes.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const onboardingData = await onboardingRes.json();
        const leaveData = await leaveRes.json();
        const payrollData = await payrollRes.json();

        setMetrics({
          onboarding: onboardingData.length,
          leave: leaveData.length,
          payroll: payrollData.length,
        });
      } catch (err) {
        setError('Failed to load dashboard metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard 
          title="Onboarding Tasks" 
          value={metrics?.onboarding || 0} 
          description="Total onboarding tasks" 
        />
        <MetricCard 
          title="Leave Requests" 
          value={metrics?.leave || 0} 
          description="Pending/approved leave requests" 
        />
        <MetricCard 
          title="Payroll Records" 
          value={metrics?.payroll || 0} 
          description="Active employee payroll records" 
        />
      </div>
    </div>
  );
}