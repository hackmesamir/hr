<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the admin login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('admin/auth/Login');
    }

    /**
     * Handle an admin login request.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Log the admin out of the application.
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    /**
     * Show the admin dashboard.
     */
    public function dashboard()
    {
        // Get real statistics
        $totalUsers = \App\Models\User::whereNull('deleted_at')->count();
        $totalClients = \App\Models\Client::whereNull('deleted_at')->count();
        $pendingLeaves = \App\Models\Leave::where('status', 'pending')->count();
        $todayAttendance = \App\Models\Attendance::whereDate('created_at', today())->count();
        $totalStaff = \App\Models\User::where('type', 'employee')->whereNull('deleted_at')->count();
        
        // Get recent activities
        $recentUsers = \App\Models\User::whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->select('id', 'name', 'staff_id', 'created_at')
            ->get();
            
        $recentClients = \App\Models\Client::whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->select('id', 'client_name', 'parent_name', 'created_at')
            ->get();
            
        $pendingLeaveRequests = \App\Models\Leave::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalClients' => $totalClients,
                'pendingLeaves' => $pendingLeaves,
                'todayAttendance' => $todayAttendance,
                'totalStaff' => $totalStaff,
                'attendancePercentage' => $totalStaff > 0 ? round(($todayAttendance / $totalStaff) * 100, 1) : 0,
            ],
            'recentUsers' => $recentUsers,
            'recentClients' => $recentClients,
            'pendingLeaveRequests' => $pendingLeaveRequests,
            'pendingLeavesCount' => $pendingLeaves,
        ]);
    }
}
