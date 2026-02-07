<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display the attendance page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = auth()->guard('web')->user();
        
        // Get today's attendance
        $todayAttendance = $user->attendances()
            ->whereDate('attendance_date', now()->format('Y-m-d'))
            ->first();
        
        // Get attendance history (last 30 days)
        $attendances = $user->attendances()
            ->whereDate('attendance_date', '>=', now()->subDays(30))
            ->orderBy('attendance_date', 'desc')
            ->get();
        
        // Calculate statistics
        $totalDays = $attendances->count();
        $presentDays = $attendances->whereNotNull('check_in_time')->count();
        $absentDays = $attendances->whereNull('check_in_time')->count();
        $lateDays = $attendances->filter(function ($attendance) {
            return $attendance->check_in_time && 
                   new \DateTime($attendance->check_in_time) > new \DateTime('09:00:00');
        })->count();
        
        $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 2) : 0;

        return Inertia::render('user/attendance/Index', [
            'todayAttendance' => $todayAttendance,
            'attendances' => $attendances,
            'stats' => [
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'late_days' => $lateDays,
                'attendance_rate' => $attendanceRate,
            ],
        ]);
    }

    /**
     * Check in the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function checkIn(Request $request)
    {
        $user = auth()->guard('web')->user();
        $today = now()->format('Y-m-d');
        
        // Check if already checked in today
        $existingAttendance = $user->attendances()
            ->whereDate('attendance_date', $today)
            ->first();
            
        if ($existingAttendance && $existingAttendance->check_in_time) {
            return back()->with('error', 'You have already checked in today.');
        }
        
        // Get location data
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $address = $request->input('address');
        
        // Create or update attendance record
        if ($existingAttendance) {
            $existingAttendance->update([
                'check_in_time' => now()->format('H:i:s'),
                'check_in_latitude' => $latitude,
                'check_in_longitude' => $longitude,
                'check_in_address' => $address,
            ]);
        } else {
            Attendance::create([
                'user_id' => $user->id,
                'attendance_date' => $today,
                'check_in_time' => now()->format('H:i:s'),
                'check_in_latitude' => $latitude,
                'check_in_longitude' => $longitude,
                'check_in_address' => $address,
            ]);
        }
        
        return back()->with('success', 'Checked in successfully at ' . now()->format('H:i:s'));
    }

    /**
     * Check out the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function checkOut(Request $request)
    {
        $user = auth()->guard('web')->user();
        $today = now()->format('Y-m-d');
        
        // Find today's attendance record
        $attendance = $user->attendances()
            ->whereDate('attendance_date', $today)
            ->first();
            
        if (!$attendance || !$attendance->check_in_time) {
            return back()->with('error', 'You must check in first before checking out.');
        }
        
        if ($attendance->check_out_time) {
            return back()->with('error', 'You have already checked out today.');
        }
        
        // Get location data
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $address = $request->input('address');
        
        // Update attendance record
        $attendance->update([
            'check_out_time' => now()->format('H:i:s'),
            'check_out_latitude' => $latitude,
            'check_out_longitude' => $longitude,
            'check_out_address' => $address,
        ]);
        
        return back()->with('success', 'Checked out successfully at ' . now()->format('H:i:s'));
    }
}
