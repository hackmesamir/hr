<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;

class StaffController extends Controller
{
    /**
     * Display a listing of staff members.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $staff = User::select('id', 'staff_id', 'name', 'type', 'status', 'mobile_number', 'nid_number')
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();
            
        $deletedStaff = User::select('id', 'staff_id', 'name', 'type', 'status', 'mobile_number', 'nid_number')
            ->onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();
            
        return Inertia::render('admin/staff/Index', [
            'staff' => $staff,
            'deletedStaff' => $deletedStaff,
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/staff/Create', [
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Store a newly created staff member in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_id' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string',
            'current_address' => 'nullable|string',
            'nid_number' => 'nullable|string|max:255|unique:users,nid_number,NULL,id,deleted_at,NULL',
            'mobile_number' => 'nullable|string|max:20',
            'parent_number' => 'nullable|string|max:20',
            'cv_upload' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'type' => 'required|string|in:employee,student',
            'status' => 'required|string|in:active,inactive',
        ]);

        $cvPath = null;
        if ($request->hasFile('cv_upload')) {
            $cvFile = $request->file('cv_upload');
            $cvName = time() . '_' . $validated['staff_id'] . '.' . $cvFile->getClientOriginalExtension();
            $cvPath = 'uploads/cvs/' . $cvName;
            
            // Create directory if it doesn't exist
            $directory = public_path('uploads/cvs');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            
            $cvFile->move($directory, $cvName);
        }

        User::create([
            'staff_id' => $validated['staff_id'],
            'name' => $validated['name'],
            'password' => bcrypt($validated['password']),
            'father_name' => $validated['father_name'] ?? null,
            'mother_name' => $validated['mother_name'] ?? null,
            'permanent_address' => $validated['permanent_address'] ?? null,
            'current_address' => $validated['current_address'] ?? null,
            'nid_number' => $validated['nid_number'] ?? null,
            'mobile_number' => $validated['mobile_number'] ?? null,
            'parent_number' => $validated['parent_number'] ?? null,
            'cv_upload' => $cvPath,
            'type' => $validated['type'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member created successfully');
    }

    /**
     * Display the specified staff member.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $staff = User::findOrFail($id);
        
        return Inertia::render('admin/staff/Show', [
            'staff' => $staff
        ]);
    }

    /**
     * Show the form for editing the specified staff member.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $staff = User::findOrFail($id);
        
        return Inertia::render('admin/staff/Edit', [
            'staff' => $staff,
            'pendingLeavesCount' => \App\Models\Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Update the specified staff member in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $staff = User::findOrFail($id);
        
        $validated = $request->validate([
            'staff_id' => 'required|string|max:255|unique:users,staff_id,' . $id,
            'name' => 'required|string|max:255',
            'type' => 'required|in:employee,student',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string',
            'current_address' => 'nullable|string',
            'nid_number' => 'nullable|string|max:255|unique:users,nid_number,' . $id,
            'mobile_number' => 'nullable|string|max:20',
            'parent_number' => 'nullable|string|max:20',
            'cv_upload' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle CV upload
        if ($request->hasFile('cv_upload')) {
            // Delete old CV if exists
            if ($staff->cv_upload) {
                $oldPath = public_path($staff->cv_upload);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
            
            $cvFile = $request->file('cv_upload');
            $cvName = time() . '_' . $staff->staff_id . '.' . $cvFile->getClientOriginalExtension();
            $cvPath = 'uploads/cvs/' . $cvName;
            
            // Create directory if it doesn't exist
            $directory = public_path('uploads/cvs');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            
            $cvFile->move($directory, $cvName);
            $validated['cv_upload'] = $cvPath;
        } else {
            // Keep existing CV if no new file uploaded
            unset($validated['cv_upload']);
        }

        $staff->update($validated);

        if ($request->filled('password')) {
            $request->validate([
                'password' => 'string|min:8',
            ]);
            
            $staff->update([
                'password' => bcrypt($request->password)
            ]);
        }

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member updated successfully');
    }

    /**
     * Restore the specified staff member.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore($id)
    {
        $staff = User::withTrashed()->findOrFail($id);
        $staff->restore();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member restored successfully');
    }

    /**
     * Permanently delete the specified staff member.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete($id)
    {
        $staff = User::withTrashed()->findOrFail($id);
        $staff->forceDelete();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member deleted permanently');
    }

    /**
     * Remove the specified staff member from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $staff = User::findOrFail($id);
        $staff->delete();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member deactivated successfully');
    }
}
