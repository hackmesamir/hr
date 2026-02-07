<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUsers = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@hr.test',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'John Administrator',
                'email' => 'john.admin@hr.test',
                'password' => Hash::make('admin123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Manager',
                'email' => 'sarah.manager@hr.test',
                'password' => Hash::make('manager123'),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
        ];

        foreach ($adminUsers as $adminUser) {
            Admin::updateOrCreate(
                ['email' => $adminUser['email']],
                $adminUser
            );
        }
    }
}
