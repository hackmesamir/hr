import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Briefcase,
  Clock,
  Timer,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  LogOut,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  staff_id: string;
  mobile_number: string;
  type: string;
  status: string;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  website: string;
  status: string;
  created_at: string;
  updated_at: string;
  users_count: number;
}

interface Attendance {
  id: number;
  attendance_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_address: string | null;
  check_out_address: string | null;
}

interface Props {
  user: User;
  clients: Client[];
  todayAttendance: Attendance | null;
  recentAttendances: Attendance[];
  stats: {
    totalClients: number;
    presentToday: boolean;
    checkedOut: boolean;
  };
}

export default function Dashboard({ user, clients, todayAttendance, recentAttendances, stats }: Props) {
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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
      <Head title="User Dashboard" />
      
      <Sidebar currentRoute="/dashboard" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user.name}!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Here's what's happening with your work today.</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
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
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                  <Link href="/attendance">
                    <Clock className="mr-2 h-4 w-4" />
                    Check In Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Status</p>
                  <p className="text-lg font-bold text-green-600">
                    {stats.presentToday ? 'Present' : 'Not Checked In'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  {stats.presentToday ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-out Status</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {stats.checkedOut ? 'Completed' : 'Pending'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Timer className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Time</p>
                  <p className="text-lg font-bold text-purple-600">{getCurrentTime()}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Attendance Management
                </CardTitle>
                <CardDescription>
                  Mark your daily attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAttendance ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3">Today's Attendance</h4>
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
                          <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href="/attendance">
                              <Clock className="mr-2 h-4 w-4" />
                              Check In
                            </Link>
                          </Button>
                        )}
                        {todayAttendance.check_in_time && !todayAttendance.check_out_time && (
                          <Button asChild className="bg-red-600 hover:bg-red-700">
                            <Link href="/attendance">
                              <Timer className="mr-2 h-4 w-4" />
                              Check Out
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <Link href="/attendance">
                            <Calendar className="mr-2 h-4 w-4" />
                            View History
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">No Attendance Record Today</h4>
                      <p className="text-sm text-yellow-700 mb-4">You haven't checked in today. Mark your attendance to get started.</p>
                      <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/attendance">
                          <Clock className="mr-2 h-4 w-4" />
                          Check In Now
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Recent Attendance
                </CardTitle>
                <CardDescription>
                  Your attendance history for the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAttendances.length > 0 ? (
                    recentAttendances.map((attendance) => (
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
          </div>

          {/* Assigned Clients */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                    Assigned Clients
                  </span>
                  <Badge variant="outline">{clients.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Clients you are working with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.length > 0 ? (
                    clients.slice(0, 5).map((client) => (
                      <div key={client.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.industry}</p>
                          </div>
                          <Badge className={
                            client.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                          }>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No assigned clients</p>
                  )}
                </div>
                
                {clients.length > 5 && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/clients">
                      View All Clients
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
