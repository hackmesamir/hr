<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;

class StaffController extends Controller
{
    /**
     * Display a listing of staff members.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $staff = User::select('id', 'staff_id', 'name', 'type', 'status', 'mobile_number', 'nid_number')
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();
            
        $deletedStaff = User::select('id', 'staff_id', 'name', 'type', 'status', 'mobile_number', 'nid_number')
            ->onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();
            
        return Inertia::render('admin/staff/Index', [
            'staff' => $staff,
            'deletedStaff' => $deletedStaff,
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/staff/Create', [
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Store a newly created staff member in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_id' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string',
            'current_address' => 'nullable|string',
            'nid_number' => 'nullable|string|max:255|unique:users,nid_number,NULL,id,deleted_at,NULL',
            'mobile_number' => 'nullable|string|max:20',
            'parent_number' => 'nullable|string|max:20',
            'cv_upload' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'type' => 'required|string|in:employee,student',
            'status' => 'required|string|in:active,inactive',
        ]);

        $cvPath = null;
        if ($request->hasFile('cv_upload')) {
            $cvFile = $request->file('cv_upload');
            $cvName = time() . '_' . $validated['staff_id'] . '.' . $cvFile->getClientOriginalExtension();
            $cvPath = 'uploads/cvs/' . $cvName;
            
            // Create directory if it doesn't exist
            $directory = public_path('uploads/cvs');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            
            $cvFile->move($directory, $cvName);
        }

        User::create([
            'staff_id' => $validated['staff_id'],
            'name' => $validated['name'],
            'password' => bcrypt($validated['password']),
            'father_name' => $validated['father_name'] ?? null,
            'mother_name' => $validated['mother_name'] ?? null,
            'permanent_address' => $validated['permanent_address'] ?? null,
            'current_address' => $validated['current_address'] ?? null,
            'nid_number' => $validated['nid_number'] ?? null,
            'mobile_number' => $validated['mobile_number'] ?? null,
            'parent_number' => $validated['parent_number'] ?? null,
            'cv_upload' => $cvPath,
            'type' => $validated['type'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member created successfully');
    }

    /**
     * Display the specified staff member.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $staff = User::findOrFail($id);
        
        return Inertia::render('admin/staff/Show', [
            'staff' => $staff
        ]);
    }

    /**
     * Show the form for editing the specified staff member.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $staff = User::findOrFail($id);
        
        return Inertia::render('admin/staff/Edit', [
            'staff' => $staff,
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Update the specified staff member in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $staff = User::findOrFail($id);
        
        $validated = $request->validate([
            'staff_id' => 'required|string|max:255|unique:users,staff_id,' . $id,
            'name' => 'required|string|max:255',
            'type' => 'required|in:employee,student',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string',
            'current_address' => 'nullable|string',
            'nid_number' => 'nullable|string|max:255|unique:users,nid_number,' . $id,
            'mobile_number' => 'nullable|string|max:20',
            'parent_number' => 'nullable|string|max:20',
            'cv_upload' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle CV upload
        if ($request->hasFile('cv_upload')) {
            // Delete old CV if exists
            if ($staff->cv_upload) {
                $oldPath = public_path($staff->cv_upload);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
            
            $cvFile = $request->file('cv_upload');
            $cvName = time() . '_' . $staff->staff_id . '.' . $cvFile->getClientOriginalExtension();
            $cvPath = 'uploads/cvs/' . $cvName;
            
            // Create directory if it doesn't exist
            $directory = public_path('uploads/cvs');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            
            $cvFile->move($directory, $cvName);
            $validated['cv_upload'] = $cvPath;
        } else {
            // Keep existing CV if no new file uploaded
            unset($validated['cv_upload']);
        }

        $staff->update($validated);

        if ($request->filled('password')) {
            $request->validate([
                'password' => 'string|min:8',
            ]);
            
            $staff->update([
                'password' => bcrypt($request->password)
            ]);
        }

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member updated successfully');
    }

    /**
     * Restore the specified staff member.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore($id)
    {
        $staff = User::withTrashed()->findOrFail($id);
        $staff->restore();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member restored successfully');
    }

    /**
     * Permanently delete the specified staff member.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete($id)
    {
        $staff = User::withTrashed()->findOrFail($id);
        $staff->forceDelete();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member deleted permanently');
    }

    /**
     * Remove the specified staff member from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $staff = User::findOrFail($id);
        $staff->delete();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member deactivated successfully');
    }

    /**
     * Display leave report for a specific staff member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function leaveReport(Request $request, $id)
    {
        $staff = User::select('id', 'staff_id', 'name', 'type', 'mobile_number')
            ->findOrFail($id);

        $query = \App\Models\Leave::where('user_id', $id);

        // Apply date filters if provided
        if ($request->has('start_date') && $request->start_date) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('end_date', '<=', $request->end_date);
        }

        $leaves = $query->orderBy('created_at', 'desc')->get()->map(function ($leave) {
            return [
                'id' => $leave->id,
                'type' => $leave->type,
                'start_date' => $leave->start_date,
                'end_date' => $leave->end_date,
                'days' => $leave->days,
                'reason' => $leave->reason,
                'status' => $leave->status,
                'approved_at' => $leave->approved_at,
                'created_at' => $leave->created_at,
            ];
        });

        // Calculate statistics
        $stats = [
            'total' => $leaves->count(),
            'approved' => $leaves->where('status', 'approved')->count(),
            'pending' => $leaves->where('status', 'pending')->count(),
            'rejected' => $leaves->where('status', 'rejected')->count(),
            'total_days' => $leaves->where('status', 'approved')->sum('days'),
        ];

        return Inertia::render('admin/staff/LeaveReport', [
            'staff' => $staff,
            'leaves' => $leaves,
            'stats' => $stats,
            'startDate' => $request->start_date ?? '',
            'endDate' => $request->end_date ?? '',
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Display attendance records for a specific staff member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function attendance(Request $request, $id)
    {
        $staff = User::select('id', 'staff_id', 'name', 'type', 'mobile_number')
            ->findOrFail($id);

        $query = \App\Models\Attendance::where('user_id', $id);

        // Apply date filters if provided
        if ($request->has('start_date') && $request->start_date) {
            $query->where('attendance_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('attendance_date', '<=', $request->end_date);
        }

        $attendances = $query->orderBy('attendance_date', 'desc')->get()->map(function ($attendance) {
            // Calculate work hours
            $totalHours = '-';
            if ($attendance->check_in_time && $attendance->check_out_time) {
                $checkIn = \Carbon\Carbon::parse($attendance->check_in_time);
                $checkOut = \Carbon\Carbon::parse($attendance->check_out_time);
                $diff = $checkIn->diff($checkOut);
                $totalHours = sprintf('%dh %dm', $diff->h, $diff->i);
            }

            return [
                'id' => $attendance->id,
                'attendance_date' => $attendance->attendance_date,
                'check_in_time' => $attendance->check_in_time,
                'check_out_time' => $attendance->check_out_time,
                'check_in_address' => $attendance->check_in_address,
                'check_out_address' => $attendance->check_out_address,
                'total_hours' => $totalHours,
            ];
        });

        // Calculate statistics
        $totalDays = $attendances->count();
        $presentDays = $attendances->count();
        
        // Count late days (after 9:00 AM)
        $lateDays = $attendances->filter(function ($attendance) {
            $checkIn = \Carbon\Carbon::parse($attendance['check_in_time']);
            $standardTime = \Carbon\Carbon::parse('09:00:00');
            return $checkIn->gt($standardTime);
        })->count();

        // Calculate total hours worked
        $totalMinutes = 0;
        foreach ($attendances as $attendance) {
            if ($attendance['check_in_time'] && $attendance['check_out_time']) {
                $checkIn = \Carbon\Carbon::parse($attendance['check_in_time']);
                $checkOut = \Carbon\Carbon::parse($attendance['check_out_time']);
                $totalMinutes += $checkIn->diffInMinutes($checkOut);
            }
        }
        
        $totalHoursWorked = floor($totalMinutes / 60);
        $totalMinutesRemaining = $totalMinutes % 60;
        $totalHoursFormatted = sprintf('%dh %dm', $totalHoursWorked, $totalMinutesRemaining);
        
        $averageHours = $presentDays > 0 ? round($totalMinutes / $presentDays / 60, 1) : 0;
        $averageHoursFormatted = sprintf('%.1fh', $averageHours);

        // Calculate date range for absent days
        $startDate = $request->start_date ?? $attendances->last()['attendance_date'] ?? now()->subMonth()->format('Y-m-d');
        $endDate = $request->end_date ?? now()->format('Y-m-d');
        
        $start = \Carbon\Carbon::parse($startDate);
        $end = \Carbon\Carbon::parse($endDate);
        $totalPossibleDays = $start->diffInDays($end) + 1;
        $absentDays = max(0, $totalPossibleDays - $presentDays);

        $stats = [
            'total_days' => $totalPossibleDays,
            'present_days' => $presentDays,
            'absent_days' => $absentDays,
            'late_days' => $lateDays,
            'total_hours' => $totalHoursFormatted,
            'average_hours' => $averageHoursFormatted,
        ];

        return Inertia::render('admin/staff/Attendance', [
            'staff' => $staff,
            'attendances' => $attendances,
            'stats' => $stats,
            'startDate' => $request->start_date ?? '',
            'endDate' => $request->end_date ?? '',
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }
}
