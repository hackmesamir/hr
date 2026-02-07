import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, UserPlus, FileText } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import { Link } from '@inertiajs/react';

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
  users?: User[];
}

interface Props {
  client: Client;
}

export default function ShowClient({ client }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Client Details - ${client.client_name || client.parent_name}`} />
      
      <Sidebar currentRoute="/admin/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Client Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View client information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
            <Button asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href={`/admin/clients/${client.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Client
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto order-3">
              <Link href={`/admin/clients/${client.id}/assign-users`}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Users
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent Name</h3>
                    <p className="mt-1 text-base">{client.parent_name || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Business Name</h3>
                    <p className="mt-1 text-base">{client.client_name || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <div className="mt-1">
                      <Badge 
                        variant="default"
                        className={`${
                          client.status.toLowerCase() === 'active' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        } text-xs font-medium px-2 py-0.5 rounded`}
                      >
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsible Person</h3>
                    <p className="mt-1 text-base">{client.responsible_person || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</h3>
                    <p className="mt-1 text-base">{client.contact_person || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Financial Year</h3>
                    <p className="mt-1 text-base">{client.financial_year || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Audit Type</h3>
                    <div className="mt-1">
                      <Badge variant="outline" className="capitalize">
                        {client.audit_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Business Name</h3>
                  <p className="mt-1 text-base">{client.client_name || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent Company</h3>
                  <p className="mt-1 text-base">{client.parent_name || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Address Information */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Business Address</h3>
                <p className="mt-1 text-base whitespace-pre-wrap">{client.client_address || '-'}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Assigned Users */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Assigned Staff Members
                <Badge variant="default" className="ml-2 bg-blue-500 text-white">
                  {client.users?.length || 0}
                </Badge>
              </CardTitle>
              <CardDescription>
                Staff members assigned to this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {client.users && client.users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {client.users.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-500">ID: {user.staff_id}</p>
                          <p className="text-sm text-gray-500">{user.mobile_number || 'No phone'}</p>
                          <p className="text-sm text-gray-500">Type: {user.type}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-500">Status:</span>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No staff members assigned to this client
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
