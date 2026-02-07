<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Show the leave application form.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $user = auth()->guard('web')->user();
        
        return Inertia::render('user/leave/Create', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'staff_id' => $user->staff_id,
            ],
        ]);
    }

    /**
     * Store a newly created leave application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $user = auth()->guard('web')->user();
        
        $validated = $request->validate([
            'type' => 'required|in:vacation,sick,personal,unpaid',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|min:10|max:1000',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        // Calculate leave days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $leaveDays = $startDate->diffInDays($endDate) + 1;

        // Handle file upload
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $attachmentPath = $file->storeAs('leave_attachments', $fileName, 'public');
        }

        // Create leave application
        $leave = $user->leaves()->create([
            'type' => $validated['type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'days' => $leaveDays,
            'reason' => $validated['reason'],
            'notes' => $attachmentPath, // Use notes field for attachment path
            'status' => 'pending',
        ]);

        return redirect()->route('user.leave.create')
            ->with('success', 'Leave application submitted successfully. Your application is now pending approval.');
    }

    /**
     * Display the leave history.
     *
     * @return \Inertia\Response
     */
    public function history()
    {
        $user = auth()->guard('web')->user();
        
        $leaves = $user->leaves()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'type' => $leave->type,
                    'start_date' => $leave->start_date,
                    'end_date' => $leave->end_date,
                    'days' => $leave->days,
                    'reason' => $leave->reason,
                    'status' => $leave->status,
                    'attachment' => $leave->notes, // Use notes field for attachment
                    'created_at' => $leave->created_at,
                    'updated_at' => $leave->updated_at,
                ];
            });

        return Inertia::render('user/leave/History', [
            'leaves' => $leaves,
            'stats' => [
                'total_leaves' => $leaves->count(),
                'pending_leaves' => $leaves->where('status', 'pending')->count(),
                'approved_leaves' => $leaves->where('status', 'approved')->count(),
                'rejected_leaves' => $leaves->where('status', 'rejected')->count(),
            ],
        ]);
    }

    /**
     * Display the specified leave application.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = auth()->guard('web')->user();
        
        $leave = $user->leaves()->findOrFail($id);

        return Inertia::render('user/leave/Show', [
            'leave' => [
                'id' => $leave->id,
                'type' => $leave->type,
                'start_date' => $leave->start_date,
                'end_date' => $leave->end_date,
                'days' => $leave->days,
                'reason' => $leave->reason,
                'status' => $leave->status,
                'attachment' => $leave->notes, // Use notes field for attachment
                'created_at' => $leave->created_at,
                'updated_at' => $leave->updated_at,
            ],
        ]);
    }

    /**
     * Remove the specified leave application.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $user = auth()->guard('web')->user();
        
        $leave = $user->leaves()->findOrFail($id);

        // Only allow deletion of pending leave applications
        if ($leave->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Cannot delete leave application that has already been processed.');
        }

        // Delete attachment if exists
        if ($leave->notes) {
            Storage::disk('public')->delete($leave->notes);
        }

        $leave->delete();

        return redirect()->route('user.leave.history')
            ->with('success', 'Leave application deleted successfully.');
    }
}
