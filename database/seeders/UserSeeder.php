<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users
        $testUsers = [
            [
                'name' => 'John Doe',
                'staff_id' => 'user1',
                'password' => bcrypt('12345678'),
            ],
            [
                'name' => 'Jane Smith',
                'staff_id' => 'user2',
                'password' => bcrypt('12345678'),
            ],
            [
                'name' => 'Mike Johnson',
                'staff_id' => 'user3',
                'password' => bcrypt('12345678'),
            ],
            [
                'name' => 'Sarah Williams',
                'staff_id' => 'user4',
                'password' => bcrypt('12345678'),
            ],
            [
                'name' => 'David Brown',
                'staff_id' => 'user5',
                'password' => bcrypt('12345678'),
            ],
        ];

        foreach ($testUsers as $userData) {
            User::firstOrCreate(
                ['staff_id' => $userData['staff_id']],
                $userData
            );
        }

        // Generate 10 additional random users using factory
        User::factory(10)->create();
    }
}
