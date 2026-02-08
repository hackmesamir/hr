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
  Clock,
  MapPin,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface Staff {
  id: number;
  staff_id: string;
  name: string;
  type: string;
  mobile_number?: string;
}

interface Attendance {
  id: number;
  attendance_date: string;
  check_in_time: string;
  check_out_time?: string;
  check_in_address?: string;
  check_out_address?: string;
  total_hours?: string;
}

interface AttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  total_hours: string;
  average_hours: string;
}

interface Props {
  staff: Staff;
  attendances: Attendance[];
  stats: AttendanceStats;
  startDate?: string;
  endDate?: string;
}

export default function StaffAttendance({ staff, attendances, stats, startDate = '', endDate = '' }: Props) {
  const [filterStartDate, setFilterStartDate] = useState(startDate);
  const [filterEndDate, setFilterEndDate] = useState(endDate);

  const handleFilter = () => {
    router.get(`/admin/staff/${staff.id}/attendance`, {
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
    router.get(`/admin/staff/${staff.id}/attendance`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isLate = (checkInTime: string) => {
    const checkIn = new Date(`2000-01-01 ${checkInTime}`);
    const standardTime = new Date('2000-01-01 09:00:00');
    return checkIn > standardTime;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Attendance - ${staff.name}`} />
      
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
                Attendance Records
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {staff.name} ({staff.staff_id}) - {staff.type}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Days</CardDescription>
              <CardTitle className="text-3xl">{stats.total_days}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Present</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.present_days}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Absent</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.absent_days}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Late Days</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.late_days}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Hours</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.total_hours}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Hours/Day</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{stats.average_hours}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Date Range
            </CardTitle>
            <CardDescription>
              Select a custom period to view attendance records
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

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  {filterStartDate && filterEndDate 
                    ? `Showing attendance from ${formatDate(filterStartDate)} to ${formatDate(filterEndDate)}`
                    : 'Showing all attendance records'
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
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Work Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.length > 0 ? (
                    attendances.map((attendance) => (
                      <TableRow key={attendance.id}>
                        <TableCell className="font-medium">
                          {formatDate(attendance.attendance_date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className={isLate(attendance.check_in_time) ? 'text-red-600 font-semibold' : ''}>
                              {formatTime(attendance.check_in_time)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {attendance.check_out_time ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-600" />
                              {formatTime(attendance.check_out_time)}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Not Checked Out
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {attendance.total_hours || '-'}
                        </TableCell>
                        <TableCell>
                          {isLate(attendance.check_in_time) ? (
                            <Badge variant="default" className="bg-yellow-500 text-white">
                              Late
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-500 text-white">
                              On Time
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {attendance.check_in_address ? (
                            <div className="flex items-start gap-1 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="truncate">{attendance.check_in_address}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No attendance records found for the selected period
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
