<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the user login form.
     *
     * @return \Inertia\Response
     */
    public function showLoginForm()
    {
        if (Auth::guard('web')->check()) {
            return redirect()->route('user.dashboard');
        }

        return Inertia::render('user/auth/Login');
    }

    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'staff_id' => ['required'],
            'password' => ['required'],
        ]);

        // Use staff_id instead of email for authentication
        if (Auth::guard('web')->attempt(['staff_id' => $credentials['staff_id'], 'password' => $credentials['password']], $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'staff_id' => 'The provided credentials do not match our records.',
        ])->onlyInput('staff_id');
    }

    /**
     * Show the user dashboard.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        $user = Auth::guard('web')->user();
        
        // Get user's assigned clients
        $clients = $user->clients()->withCount('users')->get();
        
        // Get today's attendance
        $todayAttendance = $user->attendances()
            ->whereDate('attendance_date', now()->format('Y-m-d'))
            ->first();
            
        // Get recent attendance history (last 7 days)
        $recentAttendances = $user->attendances()
            ->whereDate('attendance_date', '>=', now()->subDays(7))
            ->orderBy('attendance_date', 'desc')
            ->get();

        return Inertia::render('user/dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'staff_id' => $user->staff_id,
                'mobile_number' => $user->mobile_number,
                'type' => $user->type,
                'status' => $user->status,
                'created_at' => $user->created_at,
            ],
            'clients' => $clients,
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
            'stats' => [
                'totalClients' => $clients->count(),
                'presentToday' => $todayAttendance && $todayAttendance->check_in_time ? true : false,
                'checkedOut' => $todayAttendance && $todayAttendance->check_out_time ? true : false,
            ],
        ]);
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
