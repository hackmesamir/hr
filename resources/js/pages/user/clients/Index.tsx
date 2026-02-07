import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  Building,
  Eye,
  Edit,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';

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
  created_at: string;
  updated_at: string;
  users_count: number;
}

interface Props {
  clients: Client[];
  stats: {
    total_clients: number;
    active_clients: number;
    inactive_clients: number;
  };
}

export default function ClientsIndex({ clients, stats }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Head title="My Clients" />
      
      <Sidebar currentRoute="/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
            <p className="mt-2 text-gray-600">View your assigned clients</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_clients}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_clients}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Clients</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactive_clients}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
              Assigned Clients
            </CardTitle>
            <CardDescription>
              Clients you are working with
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients.length > 0 ? (
              <div className="space-y-4">
                {clients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{client.client_name}</h3>
                        <p className="text-sm text-gray-500">{client.audit_type.charAt(0).toUpperCase() + client.audit_type.slice(1)}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{client.client_name}</span>
                          </div>
                          {client.contact_person && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{client.contact_person}</span>
                            </div>
                          )}
                          {client.client_address && (
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                              <span>{client.client_address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={
                          client.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                        }>
                          {client.status}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{client.users_count} members</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/clients/${client.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/clients/${client.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned clients</h3>
                <p className="text-gray-500 mb-4">
                  You haven't been assigned to any clients yet.
                </p>
                <p className="text-sm text-gray-400">
                  Contact your administrator to get client assignments.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
