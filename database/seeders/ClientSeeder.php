<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test clients
        $testClients = [
            [
                'name' => 'Acme Corporation',   
                'client_name' => 'Acme Corporation',
                'email' => 'contact@acme.com',  
                'phone' => '+1-555-0100',
                'address' => '123 Business St, New York, NY 10001',
            ],
            [
                'name' => 'Global Tech Solutions',
                'email' => 'info@globaltech.com',
                'phone' => '+1-555-0101',
                'address' => '456 Innovation Ave, San Francisco, CA 94102',
            ],
            [
                'name' => 'Premier Marketing Group',
                'email' => 'hello@premier.com',
                'phone' => '+1-555-0102',
                'address' => '789 Commerce Blvd, Chicago, IL 60601',
            ],
            [
                'name' => 'Future Enterprises Ltd',
                'email' => 'support@future.com',
                'phone' => '+1-555-0103',
                'address' => '321 Growth Lane, Austin, TX 78701',
            ],
            [
                'name' => 'Innovation Hub Inc',
                'email' => 'team@innovationhub.com',
                'phone' => '+1-555-0104',
                'address' => '654 Startup Rd, Seattle, WA 98101',
            ],
            [
                'name' => 'Digital Dynamics',
                'email' => 'contact@dynamicsdigital.com',
                'phone' => '+1-555-0105',
                'address' => '987 Tech Park, Boston, MA 02101',
            ],
            [
                'name' => 'Strategic Partnerships Co',
                'email' => 'partnerships@strategic.com',
                'phone' => '+1-555-0106',
                'address' => '135 Partnership Way, Denver, CO 80202',
            ],
            [
                'name' => 'NextGen Consulting',
                'email' => 'consult@nextgen.com',
                'phone' => '+1-555-0107',
                'address' => '246 Future Blvd, Atlanta, GA 30303',
            ],
        ];

        foreach ($testClients as $clientData) {
            Client::firstOrCreate(
                ['email' => $clientData['email']],
                $clientData
            );
        }
    }
}
