import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Users,
  Clock,
  Timer,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  AlertTriangle
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
  attendance: Attendance;
}

export default function AttendanceShow({ attendance }: Props) {
  const getStatusColor = () => {
    if (!attendance.check_in_time) return 'bg-red-100 text-red-800 border-red-200';
    if (attendance.check_in_time && new Date(`2000-01-01T${attendance.check_in_time}`) > new Date('2000-01-01T09:00:00')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = () => {
    if (!attendance.check_in_time) return 'Absent';
    if (attendance.check_in_time && new Date(`2000-01-01T${attendance.check_in_time}`) > new Date('2000-01-01T09:00:00')) {
      return 'Late';
    }
    return 'Present';
  };

  const getStatusIcon = () => {
    if (!attendance.check_in_time) return UserX;
    if (attendance.check_in_time && new Date(`2000-01-01T${attendance.check_in_time}`) > new Date('2000-01-01T09:00:00')) {
      return AlertTriangle;
    }
    return UserCheck;
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Attendance - ${attendance.user.name}`} />
      
      <Sidebar currentRoute="/admin/attendance" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attendance Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View detailed attendance information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Attendance
            </Button>
            <Button asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href="/admin/attendance/statistics">
                <Calendar className="mr-2 h-4 w-4" />
                View Statistics
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Employee Information
              </CardTitle>
              <CardDescription>
                Employee details and attendance status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Name</h3>
                    <p className="mt-1 text-base font-medium">{attendance.user.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff ID</h3>
                    <p className="mt-1 text-base font-mono">{attendance.user.staff_id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Date</h3>
                    <p className="mt-1 text-base">{formatDate(attendance.attendance_date)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <div className="mt-1">
                      <Badge className={getStatusColor()}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {getStatusText()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Record ID</h3>
                    <p className="mt-1 text-base font-mono">#{attendance.id}</p>
                  </div>
                </div>
              </div>
              
              {/* Check-in Details */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-4 flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Check-in Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-blue-700">Check-in Time</h5>
                    <p className="text-sm text-blue-900">
                      {attendance.check_in_time ? formatTime(attendance.check_in_time) : 'Not checked in'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-blue-700">Check-in Location</h5>
                    <p className="text-sm text-blue-900">
                      {attendance.check_in_address || 'No location data'}
                    </p>
                  </div>
                  {attendance.check_in_latitude && attendance.check_in_longitude && (
                    <div>
                      <h5 className="text-xs font-medium text-blue-700">Coordinates</h5>
                      <p className="text-sm text-blue-900 font-mono">
                        {attendance.check_in_latitude.toFixed(6)}, {attendance.check_in_longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Check-out Details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-4 flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  Check-out Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-green-700">Check-out Time</h5>
                    <p className="text-sm text-green-900">
                      {attendance.check_out_time ? formatTime(attendance.check_out_time) : 'Not checked out'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-green-700">Check-out Location</h5>
                    <p className="text-sm text-green-900">
                      {attendance.check_out_address || 'No location data'}
                    </p>
                  </div>
                  {attendance.check_out_latitude && attendance.check_out_longitude && (
                    <div>
                      <h5 className="text-xs font-medium text-green-700">Coordinates</h5>
                      <p className="text-sm text-green-900 font-mono">
                        {attendance.check_out_latitude.toFixed(6)}, {attendance.check_out_longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>
                Attendance record timestamps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Record Created</h3>
                <p className="mt-1 text-base">{formatDateTime(attendance.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                <p className="mt-1 text-base">{formatDateTime(attendance.updated_at)}</p>
              </div>
              
              {attendance.check_in_time && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Check-in Recorded</h3>
                  <p className="mt-1 text-base">
                    {formatDate(attendance.attendance_date)} at {formatTime(attendance.check_in_time)}
                  </p>
                </div>
              )}
              
              {attendance.check_out_time && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Check-out Recorded</h3>
                  <p className="mt-1 text-base">
                    {formatDate(attendance.attendance_date)} at {formatTime(attendance.check_out_time)}
                  </p>
                </div>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Work Duration</h4>
                {attendance.check_in_time && attendance.check_out_time ? (
                  <div className="text-sm text-amber-900">
                    {(() => {
                      const checkIn = new Date(`2000-01-01T${attendance.check_in_time}`);
                      const checkOut = new Date(`2000-01-01T${attendance.check_out_time}`);
                      const diffMs = checkOut.getTime() - checkIn.getTime();
                      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      return `${diffHours}h ${diffMins}m`;
                    })()}
                  </div>
                ) : (
                  <p className="text-sm text-amber-900">Incomplete attendance record</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
