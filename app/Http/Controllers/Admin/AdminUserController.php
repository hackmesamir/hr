<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminUserController extends Controller
{
    /**
     * Display a listing of admin users.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $admins = Admin::select('id', 'name', 'email', 'created_at')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('admin/admin-users/Index', [
            'admins' => $admins,
        ]);
    }

    /**
     * Show the form for creating a new admin user.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/admin-users/Create');
    }

    /**
     * Store a newly created admin user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        Admin::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.admin-users.index')
            ->with('success', 'Admin user created successfully');
    }

    /**
     * Display the specified admin user.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $admin = Admin::select('id', 'name', 'email', 'created_at', 'updated_at')
            ->findOrFail($id);

        return Inertia::render('admin/admin-users/Show', [
            'admin' => $admin,
        ]);
    }

    /**
     * Show the form for editing the specified admin user.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $admin = Admin::select('id', 'name', 'email')
            ->findOrFail($id);

        return Inertia::render('admin/admin-users/Edit', [
            'admin' => $admin,
        ]);
    }

    /**
     * Update the specified admin user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins,email,' . $id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $admin->update($updateData);

        return redirect()->route('admin.admin-users.index')
            ->with('success', 'Admin user updated successfully');
    }

    /**
     * Remove the specified admin user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        // Prevent deletion of the current admin user
        if ($id == auth()->guard('admin')->id()) {
            return redirect()->back()
                ->with('error', 'You cannot delete your own account');
        }

        $admin = Admin::findOrFail($id);
        $admin->delete();

        return redirect()->route('admin.admin-users.index')
            ->with('success', 'Admin user deleted successfully');
    }
}
