<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientController extends Controller
{
    /**
     * Display a listing of clients.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $clients = Client::select('id', 'parent_name', 'client_name', 'client_address', 'responsible_person', 'contact_person', 'financial_year', 'audit_type', 'status')
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();
            
        $deletedClients = Client::select('id', 'parent_name', 'client_name', 'client_address', 'responsible_person', 'contact_person', 'financial_year', 'audit_type', 'status')
            ->onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();
            
        return Inertia::render('admin/client/Index', [
            'clients' => $clients,
            'deletedClients' => $deletedClients
        ]);
    }

    /**
     * Show the form for creating a new client.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/client/Create');
    }

    /**
     * Store a newly created client in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_address' => 'nullable|string|max:1000',
            'responsible_person' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'financial_year' => 'nullable|string|max:50',
            'audit_type' => 'required|in:statutory,external',
            'status' => 'required|in:active,inactive',
        ]);

        Client::create($validated);

        return redirect()->route('admin.clients.index')
            ->with('success', 'Client created successfully');
    }

    /**
     * Show the form for assigning users to a client.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function assignUsers($id)
    {
        $client = Client::findOrFail($id);
        $assignedUsers = $client->users()->get();
        $availableUsers = \App\Models\User::whereNull('deleted_at')
            ->whereNotIn('id', $assignedUsers->pluck('id'))
            ->select('id', 'name', 'staff_id', 'mobile_number', 'type', 'status')
            ->get();
            
        return Inertia::render('admin/client/AssignUsers', [
            'client' => $client,
            'assignedUsers' => $assignedUsers,
            'availableUsers' => $availableUsers
        ]);
    }

    /**
     * Assign users to a client.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeAssignments(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);
        
        $client->users()->sync($validated['user_ids']);
        
        return redirect()->route('admin.clients.show', $id)
            ->with('success', 'Users assigned to client successfully');
    }

    /**
     * Remove user assignment from a client.
     *
     * @param  int  $clientId
     * @param  int  $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeAssignment($clientId, $userId)
    {
        $client = Client::findOrFail($clientId);
        $client->users()->detach($userId);
        
        return redirect()->back()
            ->with('success', 'User removed from client successfully');
    }

    /**
     * Display the specified client.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $client = Client::with('users')->findOrFail($id);
        
        return Inertia::render('admin/client/Show', [
            'client' => $client
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
        $client = Client::findOrFail($id);
        
        return Inertia::render('admin/client/Edit', [
            'client' => $client
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
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'parent_name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_address' => 'nullable|string|max:1000',
            'responsible_person' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'financial_year' => 'nullable|string|max:50',
            'audit_type' => 'required|in:statutory,external',
            'status' => 'required|in:active,inactive',
        ]);

        $client->update($validated);

        return redirect()->route('admin.clients.index')
            ->with('success', 'Client updated successfully');
    }

    /**
     * Restore the specified client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore($id)
    {
        $client = Client::withTrashed()->findOrFail($id);
        $client->restore();

        return redirect()->route('admin.clients.index')
            ->with('success', 'Client restored successfully');
    }

    /**
     * Permanently delete the specified client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete($id)
    {
        $client = Client::withTrashed()->findOrFail($id);
        $client->forceDelete();

        return redirect()->route('admin.clients.index')
            ->with('success', 'Client deleted permanently');
    }

    /**
     * Remove the specified client from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return redirect()->route('admin.clients.index')
            ->with('success', 'Client deactivated successfully');
    }
}
