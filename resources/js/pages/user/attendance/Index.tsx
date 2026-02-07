import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  Timer,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';

interface Attendance {
  id: number;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_address: string | null;
  check_out_address: string | null;
}

interface Props {
  todayAttendance: Attendance | null;
  attendances: Attendance[];
  stats: {
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    attendance_rate: number;
  };
}

export default function AttendanceIndex({ todayAttendance, attendances, stats }: Props) {
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

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Head title="Attendance Management" />
      
      <Sidebar currentRoute="/attendance" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Attendance Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Mark and track your daily attendance</p>
          </div>
          <div className="text-sm text-gray-500">
            Current Time: {getCurrentTime()}
          </div>
        </div>

        {/* Today's Attendance Alert */}
        {!todayAttendance && (
          <Card className="mb-6 border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-red-800">
                      No Attendance Marked Today
                    </h3>
                    <p className="text-sm text-red-700">
                      You haven't checked in today. Please mark your attendance now.
                    </p>
                  </div>
                </div>
                <form method="post" action="/attendance/check-in">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                    <Clock className="mr-2 h-4 w-4" />
                    Check In Now
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_days}</p>
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
                  <p className="text-sm font-medium text-gray-600">Present Days</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present_days}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent Days</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent_days}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.attendance_rate}%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              Mark your attendance for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Today's Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Check-in Time</p>
                    <p className="font-medium text-blue-900">
                      {todayAttendance.check_in_time ? formatTime(todayAttendance.check_in_time) : 'Not checked in'}
                    </p>
                    {todayAttendance.check_in_address && (
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {todayAttendance.check_in_address}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Check-out Time</p>
                    <p className="font-medium text-blue-900">
                      {todayAttendance.check_out_time ? formatTime(todayAttendance.check_out_time) : 'Not checked out'}
                    </p>
                    {todayAttendance.check_out_address && (
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {todayAttendance.check_out_address}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  {!todayAttendance.check_in_time && (
                    <form method="post" action="/attendance/check-in">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <Clock className="mr-2 h-4 w-4" />
                        Check In
                      </Button>
                    </form>
                  )}
                  {todayAttendance.check_in_time && !todayAttendance.check_out_time && (
                    <form method="post" action="/attendance/check-out">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
                        <Timer className="mr-2 h-4 w-4" />
                        Check Out
                      </Button>
                    </form>
                  )}
                  {todayAttendance.check_in_time && todayAttendance.check_out_time && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed for today
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">No Attendance Record Today</h4>
                <p className="text-sm text-yellow-700 mb-4">You haven't checked in today. Mark your attendance to get started.</p>
                <form method="post" action="/attendance/check-in">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Clock className="mr-2 h-4 w-4" />
                    Check In Now
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Attendance History
            </CardTitle>
            <CardDescription>
              Your attendance records for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendances.length > 0 ? (
                attendances.map((attendance) => (
                  <div key={attendance.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        attendance.check_in_time ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{formatDate(attendance.attendance_date)}</p>
                        <p className="text-sm text-gray-500">
                          {attendance.check_in_time ? `In: ${formatTime(attendance.check_in_time)}` : 'Absent'}
                          {attendance.check_out_time && ` • Out: ${formatTime(attendance.check_out_time)}`}
                        </p>
                      </div>
                    </div>
                    <Badge className={
                      attendance.check_in_time ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                    }>
                      {attendance.check_in_time ? 'Present' : 'Absent'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No attendance records found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Calendar className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
