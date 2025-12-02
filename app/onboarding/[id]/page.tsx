'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OnboardingForm from '@/components/OnboardingForm';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';
import Breadcrumb from '@/components/Breadcrumb';

type OnboardingTask = {
  id: number;
  task: string;
  type: string;
  document_name: string | null;
  assigned_to: string;
  name_of_employee: string;
  due_date: string;
};

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [task, setTask] = useState<OnboardingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === '0') {
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/onboarding/${id}`);
        if (!res.ok) throw new Error('Failed to fetch onboarding task');
        const data = await res.json();
        setTask(data);
      } catch (err) {
        setError('Failed to load onboarding task');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: 'Employee Onboarding', href: '/onboarding' },
          { label: task ? 'Edit Task' : 'New Task', href: `/onboarding/${id}` }
        ]} 
      />
      <h1 className="text-3xl font-bold">
        {task ? 'Edit Onboarding Task' : 'Create Onboarding Task'}
      </h1>
      
      <OnboardingForm 
        task={task} 
        onSuccess={() => router.push('/onboarding')} 
      />
    </div>
  );
}