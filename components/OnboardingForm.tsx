'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type OnboardingTask = {
  id: number;
  task: string;
  type: string;
  document_name: string | null;
  assigned_to: string;
  name_of_employee: string;
  due_date: string;
};

export default function OnboardingForm({ 
  task, 
  onSuccess 
}: { 
  task: OnboardingTask | null; 
  onSuccess: () => void; 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    task: task?.task || '',
    type: task?.type || '',
    document_name: task?.document_name || '',
    assigned_to: task?.assigned_to || '',
    name_of_employee: task?.name_of_employee || '',
    due_date: task?.due_date || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = task ? `/api/onboarding/${task.id}` : '/api/onboarding';
      const method = task ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${task ? 'update' : 'create'} onboarding task`);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="task">Task</Label>
          <Input
            id="task"
            name="task"
            value={formData.task}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="document_name">Document Name</Label>
          <Input
            id="document_name"
            name="document_name"
            value={formData.document_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="assigned_to">Assigned To</Label>
          <Input
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="name_of_employee">Employee Name</Label>
          <Input
            id="name_of_employee"
            name="name_of_employee"
            value={formData.name_of_employee}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/onboarding')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
}