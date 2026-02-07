<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\LeaveController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ProfileController;
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
    
    // Leave management routes
    Route::get('leaves', [LeaveController::class, 'index'])->name('admin.leaves.index');
    Route::get('leaves/create', [LeaveController::class, 'create'])->name('admin.leaves.create');
    Route::post('leaves', [LeaveController::class, 'store'])->name('admin.leaves.store');
    Route::get('leaves/{id}', [LeaveController::class, 'show'])->name('admin.leaves.show');
    Route::get('leaves/{id}/edit', [LeaveController::class, 'edit'])->name('admin.leaves.edit');
    Route::put('leaves/{id}', [LeaveController::class, 'update'])->name('admin.leaves.update');
    Route::delete('leaves/{id}', [LeaveController::class, 'destroy'])->name('admin.leaves.destroy');
    Route::post('leaves/{id}/approve', [LeaveController::class, 'approve'])->name('admin.leaves.approve');
    Route::post('leaves/{id}/reject', [LeaveController::class, 'reject'])->name('admin.leaves.reject');
    Route::post('leaves/{id}/cancel', [LeaveController::class, 'cancel'])->name('admin.leaves.cancel');
    
    // Admin user management routes
    Route::get('admin-users', [AdminUserController::class, 'index'])->name('admin.admin-users.index');
    Route::get('admin-users/create', [AdminUserController::class, 'create'])->name('admin.admin-users.create');
    Route::post('admin-users', [AdminUserController::class, 'store'])->name('admin.admin-users.store');
    Route::get('admin-users/{id}', [AdminUserController::class, 'show'])->name('admin.admin-users.show');
    Route::get('admin-users/{id}/edit', [AdminUserController::class, 'edit'])->name('admin.admin-users.edit');
    Route::put('admin-users/{id}', [AdminUserController::class, 'update'])->name('admin.admin-users.update');
    Route::delete('admin-users/{id}', [AdminUserController::class, 'destroy'])->name('admin.admin-users.destroy');
    
    // Profile management routes
    Route::get('profile', [ProfileController::class, 'show'])->name('admin.profile.show');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::put('profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::get('profile/change-password', [ProfileController::class, 'changePassword'])->name('admin.profile.change-password');
    Route::put('profile/change-password', [ProfileController::class, 'updatePassword'])->name('admin.profile.update-password');
});
