import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { 
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  Filter
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface Staff {
  id: number;
  staff_id: string;
  name: string;
  type: string;
  mobile_number?: string;
}

interface Leave {
  id: number;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  approved_at?: string;
  created_at: string;
}

interface LeaveStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  total_days: number;
}

interface Props {
  staff: Staff;
  leaves: Leave[];
  stats: LeaveStats;
  startDate?: string;
  endDate?: string;
}

export default function LeaveReport({ staff, leaves, stats, startDate = '', endDate = '' }: Props) {
  const [filterStartDate, setFilterStartDate] = useState(startDate);
  const [filterEndDate, setFilterEndDate] = useState(endDate);

  const handleFilter = () => {
    router.get(`/admin/staff/${staff.id}/leave-report`, {
      start_date: filterStartDate,
      end_date: filterEndDate,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleReset = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    router.get(`/admin/staff/${staff.id}/leave-report`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vacation':
        return 'bg-blue-500 text-white';
      case 'sick':
        return 'bg-orange-500 text-white';
      case 'personal':
        return 'bg-purple-500 text-white';
      case 'unpaid':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Leave Report - ${staff.name}`} />
      
      <Sidebar currentRoute="/admin/staff" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/staff" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Staff List
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Leave Report
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {staff.name} ({staff.staff_id}) - {staff.type}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Leaves</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Days</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.total_days}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Date Range
            </CardTitle>
            <CardDescription>
              Select a custom period to view leave records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Records Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Leave Records</CardTitle>
                <CardDescription>
                  {filterStartDate && filterEndDate 
                    ? `Showing leaves from ${formatDate(filterStartDate)} to ${formatDate(filterEndDate)}`
                    : 'Showing all leave records'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <Badge 
                            variant="default"
                            className={`${getTypeColor(leave.type)} text-xs font-medium px-2 py-0.5 rounded capitalize`}
                          >
                            {leave.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(leave.start_date)}</TableCell>
                        <TableCell>{formatDate(leave.end_date)}</TableCell>
                        <TableCell className="text-center font-semibold">{leave.days}</TableCell>
                        <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="default"
                            className={`${getStatusColor(leave.status)} text-xs font-medium px-2 py-0.5 rounded capitalize`}
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(leave.created_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No leave records found for the selected period
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
