import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Users,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  TrendingUp,
  MapPin,
  Timer
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface User {
  id: number;
  name: string;
  staff_id: string;
}

interface Attendance {
  id: number;
  user_id: number;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  check_in_address: string | null;
  check_out_latitude: number | null;
  check_out_longitude: number | null;
  check_out_address: string | null;
  created_at: string;
  updated_at: string;
  user: User;
}

interface Props {
  attendances: Attendance[];
  absentUsers: User[];
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
  };
  filters: {
    date: string;
    search: string;
    status: string;
  };
}

export default function AttendanceIndex({ attendances, absentUsers, stats, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [selectedDate, setSelectedDate] = useState(filters.date || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (selectedDate) params.append('date', selectedDate);
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    
    router.get('/admin/attendance', Object.fromEntries(params));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const params = new URLSearchParams();
    params.append('date', date);
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    
    router.get('/admin/attendance', Object.fromEntries(params));
  };

  const getStatusColor = (attendance: Attendance) => {
    if (!attendance.check_in_time) return 'bg-red-100 text-red-800 border-red-200';
    if (attendance.check_in_time && new Date(`2000-01-01T${attendance.check_in_time}`) > new Date('2000-01-01T09:00:00')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = (attendance: Attendance) => {
    if (!attendance.check_in_time) return 'Absent';
    if (attendance.check_in_time && new Date(`2000-01-01T${attendance.check_in_time}`) > new Date('2000-01-01T09:00:00')) {
      return 'Late';
    }
    return 'Present';
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Attendance Management" />
      
      <Sidebar currentRoute="/admin/attendance" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Attendance Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Track and monitor employee attendance</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/attendance/statistics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Statistics
              </Link>
            </Button>
          </div>

          {/* Date Selection */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="date">Date:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-auto"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(selectedDate)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <UserX className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by name or staff ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="w-full lg:w-48">
                  <Label htmlFor="status-filter" className="sr-only">Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleFilter}>
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Present Employees */}
        {attendances.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-green-600" />
                Present Employees
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                  {attendances.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Employees who have checked in today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Check In</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Check Out</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((attendance) => (
                      <tr key={attendance.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{attendance.user.name}</div>
                              <div className="text-sm text-gray-500">ID: {attendance.user.staff_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">{attendance.check_in_time ? formatTime(attendance.check_in_time) : '-'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Timer className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">{attendance.check_out_time ? formatTime(attendance.check_out_time) : '-'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(attendance)}>
                            {getStatusText(attendance)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {attendance.check_in_address ? (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-xs">{attendance.check_in_address}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/attendance/${attendance.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Absent Employees */}
        {absentUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserX className="mr-2 h-5 w-5 text-red-600" />
                Absent Employees
                <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                  {absentUsers.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Employees who have not checked in today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {absentUsers.map((user) => (
                  <div key={user.id} className="flex items-center p-4 border rounded-lg bg-red-50">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <UserX className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.staff_id}</div>
                      <Badge className="mt-1 bg-red-100 text-red-800 border-red-200">
                        Absent
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Records State */}
        {attendances.length === 0 && absentUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No attendance records for the selected date'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
