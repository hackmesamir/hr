import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  UserCheck,
  UserX,
  AlertTriangle,
  Activity
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface User {
  id: number;
  name: string;
  staff_id: string;
}

interface DailyStat {
  date: string;
  day_name: string;
  present: number;
  absent: number;
  late: number;
}

interface EmployeeStat {
  user: User;
  present_days: number;
  absent_days: number;
  late_days: number;
  attendance_rate: number;
}

interface Props {
  dailyStats: DailyStat[];
  employeeStats: EmployeeStat[];
  filters: {
    start_date: string;
    end_date: string;
  };
}

export default function AttendanceStatistics({ dailyStats, employeeStats, filters }: Props) {
  const handleDateFilter = (startDate: string, endDate: string) => {
    router.get('/admin/attendance/statistics', {
      start_date: startDate,
      end_date: endDate
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate overall statistics
  const totalDays = dailyStats.length;
  const totalPresent = dailyStats.reduce((sum, day) => sum + day.present, 0);
  const totalAbsent = dailyStats.reduce((sum, day) => sum + day.absent, 0);
  const totalLate = dailyStats.reduce((sum, day) => sum + day.late, 0);
  const avgAttendanceRate = totalDays > 0 ? ((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Attendance Statistics" />
      
      <Sidebar currentRoute="/admin/attendance" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Attendance Statistics</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Analyze attendance patterns and trends</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Attendance
          </Button>
        </div>

        {/* Date Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="start_date">From:</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleDateFilter(e.target.value, filters.end_date)}
                  className="w-auto"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="end_date">To:</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleDateFilter(filters.start_date, e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                Period: {formatFullDate(filters.start_date)} - {formatFullDate(filters.end_date)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Present</p>
                  <p className="text-2xl font-bold text-green-600">{totalPresent}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Absent</p>
                  <p className="text-2xl font-bold text-red-600">{totalAbsent}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold text-purple-600">{avgAttendanceRate}%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              Daily Attendance Overview
            </CardTitle>
            <CardDescription>
              Day-by-day attendance breakdown for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Day</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Present</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Absent</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Late</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((stat, index) => {
                    const total = stat.present + stat.absent;
                    const rate = total > 0 ? ((stat.present / total) * 100).toFixed(1) : '0';
                    
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{formatDate(stat.date)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{stat.day_name}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-medium text-green-600">{stat.present}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <UserX className="h-4 w-4 text-red-600 mr-1" />
                            <span className="font-medium text-red-600">{stat.absent}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                            <span className="font-medium text-yellow-600">{stat.late}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center">
                              {parseFloat(rate) >= 90 ? (
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                              ) : parseFloat(rate) >= 70 ? (
                                <Activity className="h-4 w-4 text-yellow-600 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                              )}
                              <span className={`font-medium ${
                                parseFloat(rate) >= 90 ? 'text-green-600' :
                                parseFloat(rate) >= 70 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {rate}%
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Employee Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Employee Performance
            </CardTitle>
            <CardDescription>
              Individual attendance records for all employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Present Days</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Absent Days</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Late Days</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Attendance Rate</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeStats
                    .sort((a, b) => b.attendance_rate - a.attendance_rate)
                    .map((stat, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stat.user.name}</div>
                            <div className="text-sm text-gray-500">ID: {stat.user.staff_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium text-green-600">{stat.present_days}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <UserX className="h-4 w-4 text-red-600 mr-1" />
                          <span className="font-medium text-red-600">{stat.absent_days}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                          <span className="font-medium text-yellow-600">{stat.late_days}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <span className={`font-bold ${
                            stat.attendance_rate >= 90 ? 'text-green-600' :
                            stat.attendance_rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {stat.attendance_rate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className={
                          stat.attendance_rate >= 90 ? 'bg-green-100 text-green-800 border-green-200' :
                          stat.attendance_rate >= 70 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }>
                          {stat.attendance_rate >= 90 ? 'Excellent' :
                           stat.attendance_rate >= 70 ? 'Good' : 'Poor'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
