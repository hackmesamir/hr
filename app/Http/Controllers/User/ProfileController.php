<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     *
     * @return \Inertia\Response
     */
    public function show()
    {
        $user = auth()->guard('web')->user();
        
        return Inertia::render('user/profile/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'staff_id' => $user->staff_id,
                'mobile_number' => $user->mobile_number,
                'type' => $user->type,
                'status' => $user->status,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the user's profile.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        $user = auth()->guard('web')->user();
        
        return Inertia::render('user/profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'mobile_number' => $user->mobile_number,
            ],
        ]);
    }

    /**
     * Update the user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $user = auth()->guard('web')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'mobile_number' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return redirect()->route('user.profile.show')
            ->with('success', 'Profile updated successfully');
    }

    /**
     * Show the form for changing the user's password.
     *
     * @return \Inertia\Response
     */
    public function changePassword()
    {
        return Inertia::render('user/profile/ChangePassword');
    }

    /**
     * Update the user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePassword(Request $request)
    {
        $user = auth()->guard('web')->user();
        
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'The current password is incorrect.',
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('user.profile.show')
            ->with('success', 'Password changed successfully');
    }
}
