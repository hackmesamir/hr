import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, UserPlus, UserMinus, Search } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
  id: number;
  name: string;
  staff_id: string;
  mobile_number: string;
  type: string;
  status: string;
}

interface Client {
  id: number;
  parent_name: string;
  client_name: string;
  client_address: string;
  responsible_person: string;
  contact_person: string;
  financial_year: string;
  audit_type: string;
  status: string;
}

interface Props {
  client: Client;
  assignedUsers: User[];
  availableUsers: User[];
}

export default function AssignUsers({ client, assignedUsers, availableUsers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    user_ids: assignedUsers.map(user => user.id),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/clients/${client.id}/store-assignments`, {
      onSuccess: () => {
        router.visit(`/admin/clients/${client.id}`);
      }
    });
  };

  const handleUserToggle = (userId: number, checked: boolean) => {
    if (checked) {
      setData('user_ids', [...data.user_ids, userId]);
    } else {
      setData('user_ids', data.user_ids.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setData('user_ids', [...assignedUsers.map(user => user.id), ...availableUsers.map(user => user.id)]);
    } else {
      setData('user_ids', []);
    }
  };

  const isAllSelected = data.user_ids.length === assignedUsers.length + availableUsers.length;
  const isIndeterminate = data.user_ids.length > 0 && data.user_ids.length < (assignedUsers.length + availableUsers.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Assign Users - ${client.client_name}`} />
      
      <Sidebar currentRoute="/admin/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assign Users</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Assign staff members to {client.client_name}
            </p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Available Users
                <Badge variant="outline" className="ml-2">
                  {availableUsers.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Select staff members to assign to this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Select All
                    </label>
                    <Checkbox
                      checked={isAllSelected || isIndeterminate}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
                  {availableUsers.length > 0 ? (
                    availableUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={data.user_ids.includes(user.id)}
                          onCheckedChange={(checked: boolean) => handleUserToggle(user.id, checked)}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`user-${user.id}`}
                            className="text-sm font-medium cursor-pointer"
                            onClick={() => handleUserToggle(user.id, !data.user_ids.includes(user.id))}
                          >
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">ID: {user.staff_id}</div>
                            <div className="text-xs text-gray-500">{user.mobile_number || 'No phone'}</div>
                            <div className="text-xs text-gray-500">Type: {user.type}</div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">Status:</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  user.status === 'active' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }`}
                              >
                                {user.status}
                              </Badge>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No available users to assign
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing || data.user_ids.length === 0}
                    className="w-full sm:w-auto"
                  >
                    Assign Selected Users
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Currently Assigned Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Currently Assigned
                <Badge variant="default" className="ml-2 bg-blue-500 text-white">
                  {assignedUsers.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Staff members currently assigned to {client.client_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
                {assignedUsers.length > 0 ? (
                  assignedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user.staff_id}</div>
                          <div className="text-xs text-gray-500">{user.mobile_number || 'No phone'}</div>
                          <div className="text-xs text-gray-500">Type: {user.type}</div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Status:</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.delete(`/admin/clients/${client.id}/users/${user.id}`)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No users currently assigned
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
