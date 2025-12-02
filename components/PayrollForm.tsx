'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function PayrollForm({ 
  record, 
  onSuccess 
}: { 
  record: PayrollRecord | null; 
  onSuccess: () => void; 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: record?.name || '',
    ssn: record?.ssn || '',
    address: record?.address || '',
    occupation: record?.occupation || '',
    gender: record?.gender || 'male',
    hire_date: record?.hire_date || '',
    salary: record?.salary || 0,
    regular_hourly_rate: record?.regular_hourly_rate || 0,
    overtime_hourly_rate: record?.overtime_hourly_rate || 0,
    exempt_from_overtime: record?.exempt_from_overtime || false,
    federal_allowances: record?.federal_allowances || 0,
    retirement_contribution: record?.retirement_contribution || 0,
    insurance_deduction: record?.insurance_deduction || 0,
    other_deductions: record?.other_deductions || 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = record ? `/api/payroll/${record.id}` : '/api/payroll';
      const method = record ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${record ? 'update' : 'create'} payroll record`);
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="ssn">SSN</Label>
            <Input
              id="ssn"
              name="ssn"
              value={formData.ssn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select 
              name="gender" 
              value={formData.gender} 
              onValueChange={(value) => handleSelectChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hire_date">Hire Date</Label>
            <Input
              id="hire_date"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="salary">Annual Salary ($)</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              step="0.01"
              min="0"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium">Rate Information</h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="regular_hourly_rate">Regular Hourly Rate ($)</Label>
              <Input
                id="regular_hourly_rate"
                name="regular_hourly_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.regular_hourly_rate}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="overtime_hourly_rate">Overtime Hourly Rate ($)</Label>
              <Input
                id="overtime_hourly_rate"
                name="overtime_hourly_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.overtime_hourly_rate}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <input
                  id="exempt_from_overtime"
                  name="exempt_from_overtime"
                  type="checkbox"
                  checked={formData.exempt_from_overtime}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="exempt_from_overtime">Exempt from Overtime</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium">Deductions</h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="federal_allowances">Federal Allowances</Label>
              <Input
                id="federal_allowances"
                name="federal_allowances"
                type="number"
                min="0"
                value={formData.federal_allowances}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="retirement_contribution">Retirement ($)</Label>
              <Input
                id="retirement_contribution"
                name="retirement_contribution"
                type="number"
                step="0.01"
                min="0"
                value={formData.retirement_contribution}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="insurance_deduction">Insurance ($)</Label>
              <Input
                id="insurance_deduction"
                name="insurance_deduction"
                type="number"
                step="0.01"
                min="0"
                value={formData.insurance_deduction}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="other_deductions">Other ($)</Label>
              <Input
                id="other_deductions"
                name="other_deductions"
                type="number"
                step="0.01"
                min="0"
                value={formData.other_deductions}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/payroll')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : record ? 'Update Record' : 'Create Record'}
          </Button>
        </div>
      </form>
    </div>
  );
}