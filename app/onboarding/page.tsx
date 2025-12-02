'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';
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

export default function OnboardingPage() {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/onboarding');
        if (!res.ok) throw new Error('Failed to fetch onboarding tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError('Failed to load onboarding tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const columns = [
    { header: 'Task', accessor: 'task' },
    { header: 'Type', accessor: 'type' },
    { header: 'Assigned To', accessor: 'assigned_to' },
    { header: 'Employee', accessor: 'name_of_employee' },
    { header: 'Due Date', accessor: 'due_date' },
  ];

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Employee Onboarding', href: '/onboarding' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employee Onboarding</h1>
        <Button asChild>
          <Link href="/onboarding/0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </div>

      {tasks.length > 0 ? (
        <DataTable 
          data={tasks} 
          columns={columns} 
          basePath="/onboarding" 
        />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No onboarding tasks found.</p>
        </div>
      )}
    </div>
  );
}