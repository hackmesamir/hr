import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Clock,
  FileText,
  User,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';
import InputError from '@/components/input-error';

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    staff_id: string;
  };
}

export default function LeaveCreate({ user }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    type: '',
    start_date: '',
    end_date: '',
    reason: '',
    attachment: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/leave', {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('attachment', e.target.files[0]);
    }
  };

  const calculateDays = () => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <Head title="Apply for Leave" />
      
      <Sidebar currentRoute="/leave" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
            <p className="mt-1 text-sm text-gray-500">Submit your leave application</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href="/leave/history">
                <FileText className="mr-2 h-4 w-4" />
                Leave History
              </Link>
            </Button>
          </div>
        </div>

        {/* User Information */}
        <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-blue-800">Applicant Information</h4>
                <p className="text-sm text-blue-700">
                  {user.name} • Staff ID: {user.staff_id} • {user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Application Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Leave Application Form
            </CardTitle>
            <CardDescription>
              Fill in the details below to apply for leave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type */}
              <div>
                <Label htmlFor="type">Leave Type <span className="text-red-500">*</span></Label>
                <Select value={data.type} onValueChange={value => setData('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <InputError message={errors.type} />}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={data.start_date}
                    onChange={e => setData('start_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
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
                    min={data.start_date || new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.end_date && <InputError message={errors.end_date} />}
                </div>
              </div>

              {/* Days Calculation */}
              {data.start_date && data.end_date && (
                <Card className="border-l-4 border-l-green-500 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-green-800">Leave Duration</h4>
                        <p className="text-sm text-green-700">
                          Total Days: {calculateDays()} day(s)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reason */}
              <div>
                <Label htmlFor="reason">Reason for Leave <span className="text-red-500">*</span></Label>
                <Textarea
                  id="reason"
                  value={data.reason}
                  onChange={e => setData('reason', e.target.value)}
                  placeholder="Please provide a detailed reason for your leave application..."
                  rows={4}
                  required
                />
                {errors.reason && <InputError message={errors.reason} />}
              </div>

              {/* Attachment */}
              <div>
                <Label htmlFor="attachment">Attachment (Optional)</Label>
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB)
                </p>
                {errors.attachment && <InputError message={errors.attachment} />}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>All fields marked with * are required</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
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
                    {processing && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Submit Application
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Alert */}
        <Card className="mt-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Submit leave applications at least 3 days in advance</li>
                  <li>• Medical certificates required for sick leave over 2 days</li>
                  <li>• Annual leave requires prior approval from manager</li>
                  <li>• Emergency leave may be submitted retrospectively</li>
                  <li>• Attach supporting documents when applicable</li>
                  <li>• You will receive email notification for approval status</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Policy Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Leave Policy Summary
            </CardTitle>
            <CardDescription>
              Quick reference for leave entitlements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">Vacation Leave</span>
                  </div>
                  <span className="text-sm text-gray-600">21 days/year</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">Sick Leave</span>
                  </div>
                  <span className="text-sm text-gray-600">10 days/year</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">Personal Leave</span>
                  </div>
                  <span className="text-sm text-gray-600">7 days/year</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">Unpaid Leave</span>
                  </div>
                  <span className="text-sm text-gray-600">As needed</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-500">Emergency Leave</span>
                  </div>
                  <span className="text-sm text-gray-400">3 days/year</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-500">Maternity Leave</span>
                  </div>
                  <span className="text-sm text-gray-400">90 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
