<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Http\Requests\CheckInRequest;
use App\Http\Requests\CheckOutRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{
    /**
     * Get today's attendance for the authenticated user.
     */
    public function today(): JsonResponse
    {
        $attendance = Attendance::where('user_id', auth()->id())
            ->where('attendance_date', today())
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'No attendance record found for today.'], 404);
        }

        return response()->json($attendance);
    }

    /**
     * Check in the user at the current location.
     */
    public function checkIn(CheckInRequest $request): JsonResponse
    {
        $user = auth()->user();
        $today = today();

        // Check if already checked in today
        $attendance = Attendance::where('user_id', $user->id)
            ->where('attendance_date', $today)
            ->first();

        if (!$attendance) {
            $attendance = new Attendance([
                'user_id' => $user->id,
                'attendance_date' => $today,
            ]);
        }

        if ($attendance->check_in_time) {
            return response()->json(['message' => 'Already checked in today.'], 409);
        }

        $attendance->fill([
            'check_in_time' => now(),
            'check_in_latitude' => $request->latitude,
            'check_in_longitude' => $request->longitude,
            'check_in_address' => $request->address,
        ]);

        $attendance->save();

        return response()->json([
            'message' => 'Check-in successful.',
            'attendance' => $attendance,
        ], 201);
    }

    /**
     * Check out the user at the current location.
     */
    public function checkOut(CheckOutRequest $request): JsonResponse
    {
        $user = auth()->user();
        $today = today();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('attendance_date', $today)
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'No check-in record found for today.'], 404);
        }

        if (!$attendance->check_in_time) {
            return response()->json(['message' => 'Please check in first.'], 409);
        }

        if ($attendance->check_out_time) {
            return response()->json(['message' => 'Already checked out today.'], 409);
        }

        $attendance->fill([
            'check_out_time' => now(),
            'check_out_latitude' => $request->latitude,
            'check_out_longitude' => $request->longitude,
            'check_out_address' => $request->address,
        ]);

        if ($request->filled('notes')) {
            $attendance->notes = $request->notes;
        }

        $attendance->save();

        return response()->json([
            'message' => 'Check-out successful.',
            'attendance' => $attendance,
            'duration' => $attendance->getDurationInHours() . ' hours',
        ], 200);
    }

    /**
     * Get user's attendance history.
     */
    public function history(): JsonResponse
    {
        $attendances = Attendance::where('user_id', auth()->id())
            ->orderBy('attendance_date', 'desc')
            ->paginate(15);

        return response()->json($attendances);
    }
}
