<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AttendanceController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.checkIn');
    Route::post('attendance/check-out', [AttendanceController::class, 'checkOut'])->name('attendance.checkOut');
    Route::get('attendance/today', [AttendanceController::class, 'today'])->name('attendance.today');
    Route::get('attendance/history', [AttendanceController::class, 'history'])->name('attendance.history');
});

require __DIR__.'/settings.php';
