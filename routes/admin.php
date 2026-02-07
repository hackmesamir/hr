<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\ClientController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest:admin'])->group(function () {
    Route::get('admin/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('admin/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', [AuthController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('logout', [AuthController::class, 'logout'])->name('admin.logout');
    
    // Staff management routes
    Route::get('staff', [StaffController::class, 'index'])->name('admin.staff.index');
    Route::get('staff/create', [StaffController::class, 'create'])->name('admin.staff.create');
    Route::post('staff', [StaffController::class, 'store'])->name('admin.staff.store');
    Route::get('staff/{id}', [StaffController::class, 'show'])->name('admin.staff.show');
    Route::get('staff/{id}/edit', [StaffController::class, 'edit'])->name('admin.staff.edit');
    Route::put('staff/{id}', [StaffController::class, 'update'])->name('admin.staff.update');
    Route::delete('staff/{id}', [StaffController::class, 'destroy'])->name('admin.staff.destroy');
    Route::post('staff/{id}/restore', [StaffController::class, 'restore'])->name('admin.staff.restore');
    Route::delete('staff/{id}/force-delete', [StaffController::class, 'forceDelete'])->name('admin.staff.forceDelete');
    
    // Client management routes
    Route::get('clients', [ClientController::class, 'index'])->name('admin.clients.index');
    Route::get('clients/create', [ClientController::class, 'create'])->name('admin.clients.create');
    Route::post('clients', [ClientController::class, 'store'])->name('admin.clients.store');
    Route::get('clients/{id}', [ClientController::class, 'show'])->name('admin.clients.show');
    Route::get('clients/{id}/edit', [ClientController::class, 'edit'])->name('admin.clients.edit');
    Route::put('clients/{id}', [ClientController::class, 'update'])->name('admin.clients.update');
    Route::delete('clients/{id}', [ClientController::class, 'destroy'])->name('admin.clients.destroy');
    Route::post('clients/{id}/restore', [ClientController::class, 'restore'])->name('admin.clients.restore');
    Route::delete('clients/{id}/force-delete', [ClientController::class, 'forceDelete'])->name('admin.clients.forceDelete');
    Route::get('clients/{id}/assign-users', [ClientController::class, 'assignUsers'])->name('admin.clients.assignUsers');
    Route::post('clients/{id}/store-assignments', [ClientController::class, 'storeAssignments'])->name('admin.clients.storeAssignments');
    Route::delete('clients/{clientId}/users/{userId}', [ClientController::class, 'removeAssignment'])->name('admin.clients.removeAssignment');
});
