<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all active users
        $users = User::whereNull('deleted_at')
            ->where('status', 'active')
            ->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        // Generate attendance data for the last 30 days
        $endDate = Carbon::today();
        $startDate = Carbon::today()->subDays(29);
        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            // Skip weekends (Saturday and Sunday)
            if ($date->isWeekend()) {
                continue;
            }

            foreach ($users as $user) {
                // Randomly determine if user is present (85% attendance rate)
                $isPresent = rand(1, 100) <= 85;

                if ($isPresent) {
                    // Generate random check-in time (7:30 AM to 10:00 AM)
                    $checkInHour = rand(7, 9);
                    $checkInMinute = $checkInHour === 9 ? rand(0, 59) : rand(0, 59);
                    $checkInTime = Carbon::createFromTime($checkInHour, $checkInMinute, rand(0, 59));

                    // Generate check-out time (4:00 PM to 8:00 PM) - 70% of the time
                    $hasCheckOut = rand(1, 100) <= 70;
                    $checkOutTime = null;
                    $checkOutLatitude = null;
                    $checkOutLongitude = null;
                    $checkOutAddress = null;

                    if ($hasCheckOut) {
                        $checkOutHour = rand(16, 20);
                        $checkOutMinute = rand(0, 59);
                        $checkOutSecond = rand(0, 59);
                        $checkOutTime = Carbon::createFromTime($checkOutHour, $checkOutMinute, $checkOutSecond);

                        // Generate random coordinates for check-out (different from check-in)
                        $checkOutLatitude = $this->generateRandomLatitude();
                        $checkOutLongitude = $this->generateRandomLongitude();
                        $checkOutAddress = $this->generateRandomAddress();
                    }

                    // Create attendance record
                    Attendance::create([
                        'user_id' => $user->id,
                        'attendance_date' => $date->format('Y-m-d'),
                        'check_in_time' => $checkInTime->format('H:i:s'),
                        'check_out_time' => $checkOutTime ? $checkOutTime->format('H:i:s') : null,
                        'check_in_latitude' => $this->generateRandomLatitude(),
                        'check_in_longitude' => $this->generateRandomLongitude(),
                        'check_in_address' => $this->generateRandomAddress(),
                        'check_out_latitude' => $checkOutLatitude,
                        'check_out_longitude' => $checkOutLongitude,
                        'check_out_address' => $checkOutAddress,
                        'created_at' => $date->copy()->setTime($checkInHour, $checkInMinute, rand(0, 59)),
                        'updated_at' => $hasCheckOut ? 
                            $date->copy()->setTime($checkOutHour, $checkOutMinute, $checkOutSecond ?? 0) : 
                            $date->copy()->setTime($checkInHour, $checkInMinute, rand(0, 59)),
                    ]);
                } else {
                    // Create absent record (no check-in time)
                    Attendance::create([
                        'user_id' => $user->id,
                        'attendance_date' => $date->format('Y-m-d'),
                        'check_in_time' => null,
                        'check_out_time' => null,
                        'check_in_latitude' => null,
                        'check_in_longitude' => null,
                        'check_in_address' => null,
                        'check_out_latitude' => null,
                        'check_out_longitude' => null,
                        'check_out_address' => null,
                        'created_at' => $date->copy()->setTime(9, 0, 0),
                        'updated_at' => $date->copy()->setTime(9, 0, 0),
                    ]);
                }
            }
        }

        $this->command->info('AttendanceSeeder completed successfully!');
        $this->command->info('Generated attendance records for ' . $users->count() . ' users over the last 30 days.');
    }

    /**
     * Generate random latitude around Dhaka, Bangladesh
     */
    private function generateRandomLatitude(): float
    {
        // Dhaka coordinates: 23.8103° N, 90.4125° E
        // Generate coordinates within ~10km radius
        $baseLatitude = 23.8103;
        $variation = 0.09; // Approximately 10km variation
        
        return round($baseLatitude + (rand(-1000, 1000) / 10000) * $variation, 8);
    }

    /**
     * Generate random longitude around Dhaka, Bangladesh
     */
    private function generateRandomLongitude(): float
    {
        // Dhaka coordinates: 23.8103° N, 90.4125° E
        // Generate coordinates within ~10km radius
        $baseLongitude = 90.4125;
        $variation = 0.09; // Approximately 10km variation
        
        return round($baseLongitude + (rand(-1000, 1000) / 10000) * $variation, 8);
    }

    /**
     * Generate random address in Dhaka area
     */
    private function generateRandomAddress(): string
    {
        $areas = [
            'Gulshan-1, Dhaka',
            'Gulshan-2, Dhaka',
            'Banani, Dhaka',
            'Dhanmondi, Dhaka',
            'Mirpur, Dhaka',
            'Uttara, Dhaka',
            'Mohammadpur, Dhaka',
            'Tejgaon, Dhaka',
            'Bashundhara, Dhaka',
            'Baridhara, Dhaka',
            'Shahbag, Dhaka',
            'Farmgate, Dhaka',
            'Kawran Bazar, Dhaka',
            'Motijheel, Dhaka',
            'Paltan, Dhaka',
            'Khilgaon, Dhaka',
            'Jatrabari, Dhaka',
            'Kamrangirchar, Dhaka',
            'Sutrapur, Dhaka',
            'Lalbagh, Dhaka',
            'Hazrat Shahjalal International Airport, Dhaka',
            'Kurmitola, Dhaka',
            'Khilkhet, Dhaka',
            'Vashantek, Dhaka',
            'Badda, Dhaka',
            'Rampura, Dhaka',
            'Malibagh, Dhaka',
            'Moghbazar, Dhaka',
            'Wari, Dhaka',
            'Azimpur, Dhaka',
            'New Market, Dhaka',
            'Shahbagh, Dhaka',
            'Elephant Road, Dhaka',
            'Dhanmondi-27, Dhaka',
            'Mirpur-10, Dhaka',
            'Uttara-6, Dhaka',
        ];

        $streetNumbers = [123, 456, 789, 321, 654, 987, 246, 135, 579, 864];
        $buildingNames = [
            'ABC Tower', 'XYZ Plaza', 'Business Center', 'Tech Hub', 
            'Corporate Office', 'Trade Center', 'Shopping Mall', 'Residential Complex',
            'Office Building', 'Commercial Tower'
        ];

        $area = $areas[array_rand($areas)];
        $streetNumber = $streetNumbers[array_rand($streetNumbers)];
        $buildingName = $buildingNames[array_rand($buildingNames)];

        return "House #{$streetNumber}, {$buildingName}, {$area}";
    }
}
