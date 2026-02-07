<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a super admin user
        Admin::firstOrCreate([
            'email' => 'admin@gmail.com',
            'name' => 'Super Admin',
            'password' => bcrypt('12345678'),
        ]);
    }
}
