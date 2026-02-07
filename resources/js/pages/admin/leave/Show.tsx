import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Calendar, User, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface User {
  id: number;
  name: string;
  staff_id: string;
}

interface Leave {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  days: number;
  type: string;
  reason: string;
  status: string;
  approver_id: number | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  approver?: User | null;
}

interface Props {
  leave: Leave;
  pendingLeavesCount?: number;
}

export default function ShowLeave({ leave, pendingLeavesCount = 0 }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sick':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'personal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'unpaid':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'cancelled':
        return <RotateCcw className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Leave Request - ${leave.user.name}`} />
      
      <Sidebar currentRoute="/admin/leaves" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leave Request Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View leave request information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leave Requests
            </Button>
            <Button asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href={`/admin/leaves/${leave.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Leave Request
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                {getStatusIcon(leave.status)}
                <span className="ml-2">Leave Information</span>
              </CardTitle>
              <CardDescription>
                Details of the leave request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee</h3>
                    <p className="mt-1 text-base">{leave.user.name}</p>
                    <p className="text-sm text-gray-500">ID: {leave.user.staff_id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Leave Type</h3>
                    <div className="mt-1">
                      <Badge className={getTypeColor(leave.type)}>
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <div className="mt-1">
                      <Badge className={getStatusColor(leave.status)}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</h3>
                    <p className="mt-1 text-base">{formatDate(leave.start_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</h3>
                    <p className="mt-1 text-base">{formatDate(leave.end_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h3>
                    <p className="mt-1 text-base">{leave.days} day(s)</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</h3>
                <p className="mt-1 text-base whitespace-pre-wrap">{leave.reason}</p>
              </div>
              
              {leave.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
                  <p className="mt-1 text-base whitespace-pre-wrap">{leave.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Approval Information */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Information</CardTitle>
              <CardDescription>
                Details about the approval process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Requested On</h3>
                <p className="mt-1 text-base">{formatDateTime(leave.created_at)}</p>
              </div>
              
              {leave.approver && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved/Rejected By</h3>
                  <p className="mt-1 text-base">{leave.approver.name}</p>
                </div>
              )}
              
              {leave.approved_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approval Date</h3>
                  <p className="mt-1 text-base">{formatDateTime(leave.approved_at)}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                <p className="mt-1 text-base">{formatDateTime(leave.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
