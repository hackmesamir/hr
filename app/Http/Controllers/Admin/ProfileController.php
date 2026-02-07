<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Display the admin user's profile.
     *
     * @return \Inertia\Response
     */
    public function show()
    {
        $admin = auth()->guard('admin')->user();
        
        return Inertia::render('admin/profile/Show', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'email_verified_at' => $admin->email_verified_at,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the admin user's profile.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        $admin = auth()->guard('admin')->user();
        
        return Inertia::render('admin/profile/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }

    /**
     * Update the admin user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $admin = auth()->guard('admin')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins,email,' . $admin->id,
        ]);

        $admin->update($validated);

        return redirect()->route('admin.profile.show')
            ->with('success', 'Profile updated successfully');
    }

    /**
     * Show the form for changing the admin user's password.
     *
     * @return \Inertia\Response
     */
    public function changePassword()
    {
        return Inertia::render('admin/profile/ChangePassword');
    }

    /**
     * Update the admin user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePassword(Request $request)
    {
        $admin = auth()->guard('admin')->user();
        
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $admin->password)) {
            return back()->withErrors([
                'current_password' => 'The current password is incorrect.',
            ]);
        }

        // Update password
        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.profile.show')
            ->with('success', 'Password changed successfully');
    }
}
