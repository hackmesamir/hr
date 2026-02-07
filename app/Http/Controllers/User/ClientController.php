<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the user's assigned clients.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = auth()->guard('web')->user();
        
        // Get user's assigned clients with their information
        $clients = $user->clients()
            ->withCount('users')
            ->get()
            ->map(function ($client) {
                return [
                    'id' => $client->id,
                    'parent_name' => $client->parent_name,
                    'client_name' => $client->client_name,
                    'client_address' => $client->client_address,
                    'responsible_person' => $client->responsible_person,
                    'contact_person' => $client->contact_person,
                    'financial_year' => $client->financial_year,
                    'audit_type' => $client->audit_type,
                    'status' => $client->status,
                    'created_at' => $client->created_at,
                    'updated_at' => $client->updated_at,
                    'users_count' => $client->users_count,
                ];
            });

        return Inertia::render('user/clients/Index', [
            'clients' => $clients,
            'stats' => [
                'total_clients' => $clients->count(),
                'active_clients' => $clients->where('status', 'active')->count(),
                'inactive_clients' => $clients->where('status', 'inactive')->count(),
            ],
        ]);
    }

    /**
     * Display the specified client.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = auth()->guard('web')->user();
        
        // Check if user is assigned to this client
        $client = $user->clients()->findOrFail($id);
        
        // Get all staff members assigned to this client
        $clientUsers = $client->users()
            ->where('status', 'active')
            ->get()
            ->map(function ($clientUser) {
                return [
                    'id' => $clientUser->id,
                    'name' => $clientUser->name,
                    'staff_id' => $clientUser->staff_id,
                    'email' => $clientUser->email,
                    'mobile_number' => $clientUser->mobile_number,
                    'type' => $clientUser->type,
                    'status' => $clientUser->status,
                ];
            });

        return Inertia::render('user/clients/Show', [
            'client' => [
                'id' => $client->id,
                'parent_name' => $client->parent_name,
                'client_name' => $client->client_name,
                'client_address' => $client->client_address,
                'responsible_person' => $client->responsible_person,
                'contact_person' => $client->contact_person,
                'financial_year' => $client->financial_year,
                'audit_type' => $client->audit_type,
                'status' => $client->status,
                'created_at' => $client->created_at,
                'updated_at' => $client->updated_at,
            ],
            'users' => $clientUsers,
            'stats' => [
                'total_users' => $clientUsers->count(),
                'active_users' => $clientUsers->where('status', 'active')->count(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified client.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $user = auth()->guard('web')->user();
        
        $client = $user->clients()->findOrFail($id);
        
        return Inertia::render('user/clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified client in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $user = auth()->guard('web')->user();
        
        $client = $user->clients()->findOrFail($id);
        
        $validated = $request->validate([
            'parent_name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_address' => 'nullable|string|max:500',
            'responsible_person' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'financial_year' => 'nullable|string|max:20',
            'audit_type' => 'required|in:statutory,external',
            'status' => 'required|in:active,inactive',
        ]);

        $client->update($validated);

        return redirect()->route('user.clients.index')
            ->with('success', 'Client updated successfully');
    }
}
