<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Leave;
use Carbon\Carbon;

class LeaveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to assign leave requests to
        $users = User::where('type', 'employee')->take(5)->get();
        
        if ($users->isEmpty()) {
            // Create some test users first if none exist
            $users = collect([
                User::create([
                    'staff_id' => 'STAFF001',
                    'name' => 'John Doe',
                    'type' => 'employee',
                    'password' => bcrypt('password'),
                    'status' => 'active',
                ]),
                User::create([
                    'staff_id' => 'STAFF002',
                    'name' => 'Jane Smith',
                    'type' => 'employee',
                    'password' => bcrypt('password'),
                    'status' => 'active',
                ]),
                User::create([
                    'staff_id' => 'STAFF003',
                    'name' => 'Mike Johnson',
                    'type' => 'employee',
                    'password' => bcrypt('password'),
                    'status' => 'active',
                ]),
            ]);
        }

        $leaveTypes = ['vacation', 'sick', 'personal', 'unpaid'];
        $statuses = ['pending', 'approved', 'rejected'];
        
        $sampleLeaves = [
            [
                'user_id' => $users[0]->id,
                'start_date' => Carbon::now()->addDays(5)->toDateString(),
                'end_date' => Carbon::now()->addDays(7)->toDateString(),
                'type' => 'vacation',
                'reason' => 'Annual vacation trip with family to visit relatives in another city.',
                'status' => 'pending',
                'notes' => 'Emergency contact available during vacation.',
            ],
            [
                'user_id' => $users[1]->id,
                'start_date' => Carbon::now()->subDays(10)->toDateString(),
                'end_date' => Carbon::now()->subDays(8)->toDateString(),
                'type' => 'sick',
                'reason' => 'Medical appointment and recovery from flu symptoms.',
                'status' => 'approved',
                'notes' => 'Medical certificate attached.',
            ],
            [
                'user_id' => $users[2]->id,
                'start_date' => Carbon::now()->addDays(15)->toDateString(),
                'end_date' => Carbon::now()->addDays(16)->toDateString(),
                'type' => 'personal',
                'reason' => 'Personal family event - wedding ceremony.',
                'status' => 'approved',
                'notes' => 'Will be available for urgent matters via phone.',
            ],
            [
                'user_id' => $users[0]->id,
                'start_date' => Carbon::now()->subDays(5)->toDateString(),
                'end_date' => Carbon::now()->subDays(4)->toDateString(),
                'type' => 'unpaid',
                'reason' => 'Personal emergency requiring immediate attention.',
                'status' => 'rejected',
                'notes' => 'Insufficient notice period provided.',
            ],
            [
                'user_id' => $users[1]->id,
                'start_date' => Carbon::now()->addDays(20)->toDateString(),
                'end_date' => Carbon::now()->addDays(22)->toDateString(),
                'type' => 'vacation',
                'reason' => 'Summer vacation planned for family relaxation.',
                'status' => 'pending',
                'notes' => 'All project work will be completed before leave.',
            ],
            [
                'user_id' => $users[2]->id,
                'start_date' => Carbon::now()->subDays(20)->toDateString(),
                'end_date' => Carbon::now()->subDays(19)->toDateString(),
                'type' => 'sick',
                'reason' => 'Food poisoning and medical treatment.',
                'status' => 'approved',
                'notes' => 'Doctor\'s note submitted to HR.',
            ],
            [
                'user_id' => $users[0]->id,
                'start_date' => Carbon::now()->addDays(30)->toDateString(),
                'end_date' => Carbon::now()->addDays(31)->toDateString(),
                'type' => 'personal',
                'reason' => 'Attending professional development conference.',
                'status' => 'pending',
                'notes' => 'Conference registration confirmed.',
            ],
            [
                'user_id' => $users[1]->id,
                'start_date' => Carbon::now()->subDays(30)->toDateString(),
                'end_date' => Carbon::now()->subDays(28)->toDateString(),
                'type' => 'vacation',
                'reason' => 'Extended vacation for mental health and relaxation.',
                'status' => 'approved',
                'notes' => 'All responsibilities delegated to team members.',
            ],
        ];

        foreach ($sampleLeaves as $leaveData) {
            // Calculate days
            $startDate = Carbon::parse($leaveData['start_date']);
            $endDate = Carbon::parse($leaveData['end_date']);
            $days = $startDate->diffInDays($endDate) + 1;
            
            $leaveData['days'] = $days;
            
            // Set approver info for approved/rejected leaves
            if ($leaveData['status'] === 'approved' || $leaveData['status'] === 'rejected') {
                $leaveData['approver_id'] = 1; // Assuming admin has ID 1
                $leaveData['approved_at'] = Carbon::now()->subDays(rand(1, 10));
            }
            
            Leave::create($leaveData);
        }
    }
}
