<?php

use App\Http\Controllers\Admin\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest:admin'])->group(function () {
    Route::get('admin/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('admin/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', [AuthController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('logout', [AuthController::class, 'logout'])->name('admin.logout');
    
    // Add more admin routes here as needed
});
