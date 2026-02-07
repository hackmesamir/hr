<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $clients = Client::all();

        if ($users->isEmpty() || $clients->isEmpty()) {
            $this->command->warn('No users or clients found. Please run UserSeeder and ClientSeeder first.');
            return;
        }

        // Assign each user to 1-3 random clients
        foreach ($users as $user) {
            $randomClients = $clients->random(rand(1, 3))->pluck('id');
            $user->clients()->attach($randomClients);
        }

        $this->command->info('Successfully associated users with clients.');
    }
}
