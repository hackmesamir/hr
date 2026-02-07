<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use DateTime;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));
        $search = $request->get('search', '');
        $status = $request->get('status', 'all');
        
        $attendances = Attendance::with('user')
            ->whereDate('attendance_date', $date)
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('staff_id', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', function ($query, $status) {
                if ($status === 'present') {
                    $query->whereNotNull('check_in_time');
                } elseif ($status === 'absent') {
                    $query->whereNull('check_in_time');
                } elseif ($status === 'late') {
                    $query->whereNotNull('check_in_time')
                          ->whereTime('check_in_time', '>', '09:00:00');
                }
            })
            ->orderBy('check_in_time', 'asc')
            ->get();
        
        // Get all users for the selected date to show absent ones
        $allUsers = User::whereNull('deleted_at')
            ->where('status', 'active')
            ->get();
        
        // Mark users who are present
        $presentUserIds = $attendances->pluck('user_id')->toArray();
        $absentUsers = $allUsers->whereNotIn('id', $presentUserIds);
        
        // Calculate statistics
        $totalEmployees = $allUsers->count();
        $presentCount = $attendances->whereNotNull('check_in_time')->count();
        $absentCount = $absentUsers->count();
        $lateCount = $attendances->filter(function ($attendance) {
            return $attendance->check_in_time && 
                   new DateTime($attendance->check_in_time) > new DateTime('09:00:00');
        })->count();
        
        return Inertia::render('admin/attendance/Index', [
            'attendances' => $attendances,
            'absentUsers' => $absentUsers,
            'stats' => [
                'total' => $totalEmployees,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
            ],
            'filters' => [
                'date' => $date,
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Display the specified attendance record.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $attendance = Attendance::with('user')->findOrFail($id);
        
        return Inertia::render('admin/attendance/Show', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Show attendance statistics.
     *
     * @return \Inertia\Response
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));
        
        // Get attendance data for the date range
        $attendanceData = Attendance::with('user')
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->get();
        
        // Calculate daily statistics
        $dailyStats = [];
        $period = Carbon::parse($startDate)->daysUntil(Carbon::parse($endDate));
        
        foreach ($period as $date) {
            $dateStr = $date->format('Y-m-d');
            $dayAttendances = $attendanceData->where('attendance_date', $dateStr);
            
            $dailyStats[] = [
                'date' => $dateStr,
                'day_name' => $date->format('l'),
                'present' => $dayAttendances->whereNotNull('check_in_time')->count(),
                'absent' => $dayAttendances->whereNull('check_in_time')->count(),
                'late' => $dayAttendances->filter(function ($attendance) {
                    return $attendance->check_in_time && 
                           new DateTime($attendance->check_in_time) > new DateTime('09:00:00');
                })->count(),
            ];
        }
        
        // Get employee-wise statistics
        $employeeStats = User::whereNull('deleted_at')
            ->where('status', 'active')
            ->with(['attendances' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('attendance_date', [$startDate, $endDate]);
            }])
            ->get()
            ->map(function ($user) use ($startDate, $endDate) {
                $totalDays = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;
                $presentDays = $user->attendances->whereNotNull('check_in_time')->count();
                $absentDays = $user->attendances->whereNull('check_in_time')->count();
                $lateDays = $user->attendances->filter(function ($attendance) {
                    return $attendance->check_in_time && 
                           new DateTime($attendance->check_in_time) > new DateTime('09:00:00');
                })->count();
                
                return [
                    'user' => $user,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'late_days' => $lateDays,
                    'attendance_rate' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 2) : 0,
                ];
            });
        
        return Inertia::render('admin/attendance/Statistics', [
            'dailyStats' => $dailyStats,
            'employeeStats' => $employeeStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
