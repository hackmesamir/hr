<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Display a listing of leave requests.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $leaves = Leave::with(['user', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        $pendingLeaves = Leave::with(['user'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
            
        $approvedLeaves = Leave::with(['user', 'approver'])
            ->where('status', 'approved')
            ->orderBy('approved_at', 'desc')
            ->get();
            
        $rejectedLeaves = Leave::with(['user', 'approver'])
            ->where('status', 'rejected')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('admin/leave/Index', [
            'leaves' => $leaves,
            'pendingLeaves' => $pendingLeaves,
            'approvedLeaves' => $approvedLeaves,
            'rejectedLeaves' => $rejectedLeaves,
            'stats' => [
                'total' => $leaves->count(),
                'pending' => $pendingLeaves->count(),
                'approved' => $approvedLeaves->count(),
                'rejected' => $rejectedLeaves->count(),
            ],
            'pendingLeavesCount' => $pendingLeaves->count(),
        ]);
    }

    /**
     * Show the form for creating a new leave request.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $users = User::whereNull('deleted_at')
            ->where('status', 'active')
            ->select('id', 'name', 'staff_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/leave/Create', [
            'users' => $users,
            'leaveTypes' => Leave::TYPES,
            'statuses' => Leave::STATUSES,
            'pendingLeavesCount' => Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Store a newly created leave request in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:vacation,sick,personal,unpaid',
            'reason' => 'required|string|max:1000',
            'status' => 'required|in:pending,approved,rejected,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Calculate days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1;

        $leave = Leave::create([
            'user_id' => $validated['user_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'days' => $days,
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        // If approved, set approver info
        if ($validated['status'] === 'approved') {
            $leave->update([
                'approver_id' => auth()->guard('admin')->id(),
                'approved_at' => now(),
            ]);
        }

        return redirect()->route('admin.leaves.index')
            ->with('success', 'Leave request created successfully');
    }

    /**
     * Display the specified leave request.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $leave = Leave::with(['user', 'approver'])->findOrFail($id);

        return Inertia::render('admin/leave/Show', [
            'leave' => $leave,
            'pendingLeavesCount' => Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Show the form for editing the specified leave request.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $leave = Leave::with(['user'])->findOrFail($id);
        $users = User::whereNull('deleted_at')
            ->where('status', 'active')
            ->select('id', 'name', 'staff_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/leave/Edit', [
            'leave' => $leave,
            'users' => $users,
            'leaveTypes' => Leave::TYPES,
            'statuses' => Leave::STATUSES,
            'pendingLeavesCount' => Leave::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Update the specified leave request in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:vacation,sick,personal,unpaid',
            'reason' => 'required|string|max:1000',
            'status' => 'required|in:pending,approved,rejected,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Calculate days
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1;

        $updateData = [
            'user_id' => $validated['user_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'days' => $days,
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ];

        // Handle approver info
        if ($validated['status'] === 'approved' && $leave->status !== 'approved') {
            $updateData['approver_id'] = auth()->guard('admin')->id();
            $updateData['approved_at'] = now();
        } elseif ($validated['status'] !== 'approved') {
            $updateData['approver_id'] = null;
            $updateData['approved_at'] = null;
        }

        $leave->update($updateData);

        return redirect()->route('admin.leaves.index')
            ->with('success', 'Leave request updated successfully');
    }

    /**
     * Remove the specified leave request from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();

        return redirect()->route('admin.leaves.index')
            ->with('success', 'Leave request deleted successfully');
    }

    /**
     * Approve a leave request.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve($id)
    {
        $leave = Leave::findOrFail($id);
        
        $leave->update([
            'status' => 'approved',
            'approver_id' => auth()->guard('admin')->id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Leave request approved successfully');
    }

    /**
     * Reject a leave request.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject($id)
    {
        $leave = Leave::findOrFail($id);
        
        $leave->update([
            'status' => 'rejected',
            'approver_id' => auth()->guard('admin')->id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Leave request rejected successfully');
    }

    /**
     * Cancel a leave request.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel($id)
    {
        $leave = Leave::findOrFail($id);
        
        $leave->update([
            'status' => 'cancelled',
            'approver_id' => null,
            'approved_at' => null,
        ]);

        return redirect()->back()
            ->with('success', 'Leave request cancelled successfully');
    }
}
