<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\User\AuthController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\AttendanceController;
use App\Http\Controllers\User\ClientController;
use App\Http\Controllers\User\LeaveController;

Route::get('/', function () {
    return redirect('/login');
})->name('home');

// User authentication routes
Route::middleware(['guest'])->group(function () {
    Route::get('login', function () {
        return Inertia::render('auth/login');
    })->name('user.login');
    Route::post('login', [AuthController::class, 'login']);
});

// User dashboard and authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [AuthController::class, 'dashboard'])->name('user.dashboard');
    Route::post('logout', [AuthController::class, 'logout'])->name('user.logout');
    
    // Profile management
    Route::get('profile', [ProfileController::class, 'show'])->name('user.profile.show');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('user.profile.edit');
    Route::put('profile', [ProfileController::class, 'update'])->name('user.profile.update');
    Route::get('profile/change-password', [ProfileController::class, 'changePassword'])->name('user.profile.change-password');
    Route::put('profile/change-password', [ProfileController::class, 'updatePassword'])->name('user.profile.update-password');
    
    // Attendance management
    Route::get('attendance', [AttendanceController::class, 'index'])->name('user.attendance.index');
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn'])->name('user.attendance.check-in');
    Route::post('attendance/check-out', [AttendanceController::class, 'checkOut'])->name('user.attendance.check-out');
    
    // Client management
    Route::get('clients', [ClientController::class, 'index'])->name('user.clients.index');
    Route::get('clients/{id}', [ClientController::class, 'show'])->name('user.clients.show');
    Route::get('clients/{id}/edit', [ClientController::class, 'edit'])->name('user.clients.edit');
    Route::put('clients/{id}', [ClientController::class, 'update'])->name('user.clients.update');
    
    // Leave management
    Route::get('leave/apply', [LeaveController::class, 'create'])->name('user.leave.create');
    Route::post('leave', [LeaveController::class, 'store'])->name('user.leave.store');
    Route::get('leave/history', [LeaveController::class, 'history'])->name('user.leave.history');
    Route::get('leave/{id}', [LeaveController::class, 'show'])->name('user.leave.show');
    Route::delete('leave/{id}', [LeaveController::class, 'destroy'])->name('user.leave.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
