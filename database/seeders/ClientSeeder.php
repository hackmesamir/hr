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
                'parent_name' => 'Acme Holdings Inc.',
                'client_name' => 'Acme Corporation',
                'client_address' => '123 Business St, New York, NY 10001',
                'responsible_person' => 'John Smith',
                'contact_person' => 'Jane Doe',
                'financial_year' => '2024-2025',
                'audit_type' => 'statutory',
                'status' => 'active',
            ],
            [
                'parent_name' => 'Global Technologies Group',
                'client_name' => 'Global Tech Solutions',
                'client_address' => '456 Innovation Ave, San Francisco, CA 94102',
                'responsible_person' => 'Michael Johnson',
                'contact_person' => 'Sarah Wilson',
                'financial_year' => '2024-2025',
                'audit_type' => 'external',
                'status' => 'active',
            ],
            [
                'parent_name' => 'Premier Marketing Holdings',
                'client_name' => 'Premier Marketing Group',
                'client_address' => '789 Marketing Blvd, Los Angeles, CA 90001',
                'responsible_person' => 'Robert Brown',
                'contact_person' => 'Emily Davis',
                'financial_year' => '2023-2024',
                'audit_type' => 'statutory',
                'status' => 'active',
            ],
            [
                'parent_name' => 'Financial Services Ltd',
                'client_name' => 'Finance Plus Corp',
                'client_address' => '321 Financial District, Chicago, IL 60601',
                'responsible_person' => 'David Miller',
                'contact_person' => 'Lisa Anderson',
                'financial_year' => '2024-2025',
                'audit_type' => 'external',
                'status' => 'inactive',
            ],
            [
                'parent_name' => 'Healthcare Systems Inc',
                'client_name' => 'MedCare Solutions',
                'client_address' => '555 Medical Park Dr, Boston, MA 02101',
                'responsible_person' => 'James Taylor',
                'contact_person' => 'Patricia Moore',
                'financial_year' => '2024-2025',
                'audit_type' => 'statutory',
                'status' => 'active',
            ],
        ];

        foreach ($testClients as $client) {
            Client::create($client);
        }
    }
}

