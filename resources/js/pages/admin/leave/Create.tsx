import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import InputError from '@/components/input-error';

interface User {
  id: number;
  name: string;
  staff_id: string;
}

interface Props {
  users: User[];
  leaveTypes: string[];
  statuses: string[];
  pendingLeavesCount?: number;
}

export default function CreateLeave({ users, leaveTypes, statuses, pendingLeavesCount = 0 }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    start_date: '',
    end_date: '',
    type: 'vacation',
    reason: '',
    status: 'pending',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/leaves');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Create Leave Request" />
      
      <Sidebar currentRoute="/admin/leaves" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Leave Request</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new leave request</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leave Requests
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Leave Information</CardTitle>
            <CardDescription>Enter the leave request details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Selection */}
                <div>
                  <Label htmlFor="user_id">Employee <span className="text-red-500">*</span></Label>
                  <Select 
                    value={data.user_id} 
                    onValueChange={value => setData('user_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.staff_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.user_id && <InputError message={errors.user_id} />}
                </div>

                {/* Leave Type */}
                <div>
                  <Label htmlFor="type">Leave Type <span className="text-red-500">*</span></Label>
                  <Select 
                    value={data.type} 
                    onValueChange={value => setData('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <InputError message={errors.type} />}
                </div>

                {/* Date Range */}
                <div>
                  <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                  <Input 
                    id="start_date" 
                    type="date" 
                    value={data.start_date} 
                    onChange={e => setData('start_date', e.target.value)} 
                    required
                  />
                  {errors.start_date && <InputError message={errors.start_date} />}
                </div>

                <div>
                  <Label htmlFor="end_date">End Date <span className="text-red-500">*</span></Label>
                  <Input 
                    id="end_date" 
                    type="date" 
                    value={data.end_date} 
                    onChange={e => setData('end_date', e.target.value)} 
                    min={data.start_date}
                    required
                  />
                  {errors.end_date && <InputError message={errors.end_date} />}
                </div>

                {/* Status */}
                <div>
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <Select 
                    value={data.status} 
                    onValueChange={value => setData('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <InputError message={errors.status} />}
                </div>
              </div>

              {/* Reason */}
              <div>
                <Label htmlFor="reason">Reason <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="reason" 
                  value={data.reason} 
                  onChange={e => setData('reason', e.target.value)} 
                  rows={4}
                  placeholder="Enter the reason for leave..."
                  required
                />
                {errors.reason && <InputError message={errors.reason} />}
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={data.notes} 
                  onChange={e => setData('notes', e.target.value)} 
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
                {errors.notes && <InputError message={errors.notes} />}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={processing}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Leave Request
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
