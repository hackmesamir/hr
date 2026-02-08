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
  Edit,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Shield,
  FileText
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';

interface ClientUser {
  id: number;
  name: string;
  email: string;
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
  created_at: string;
  updated_at: string;
}

interface Props {
  client: Client;
  users: ClientUser[];
  stats: {
    total_users: number;
    active_users: number;
  };
}

export default function ClientShow({ client, users, stats }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAuditTypeColor = (auditType: string) => {
    switch (auditType) {
      case 'statutory':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'external':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Head title={`${client.client_name} - Client Details`} />
      
      <Sidebar currentRoute="/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.client_name}</h1>
            <p className="mt-2 text-gray-600">Client details and information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href={`/clients/${client.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Client
              </Link>
            </Button>
          </div>
        </div>

        {/* Status and Type Badges */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Badge className={getStatusColor(client.status)}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
          <Badge className={getAuditTypeColor(client.audit_type)}>
            <FileText className="mr-1 h-3 w-3" />
            {client.audit_type.charAt(0).toUpperCase() + client.audit_type.slice(1)} Audit
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_users}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Financial Year</p>
                  <p className="text-2xl font-bold text-purple-600">{client.financial_year || 'N/A'}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                Client Information
              </CardTitle>
              <CardDescription>
                Basic details about the client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Client Name</p>
                <p className="text-gray-900">{client.client_name}</p>
              </div>
              
              {client.parent_name && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Parent Company</p>
                  <p className="text-gray-900">{client.parent_name}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Audit Type</p>
                <Badge className={getAuditTypeColor(client.audit_type)}>
                  {client.audit_type.charAt(0).toUpperCase() + client.audit_type.slice(1)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Financial Year</p>
                <p className="text-gray-900">{client.financial_year || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-green-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                People associated with this client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Responsible Person</p>
                <div className="flex items-center text-gray-900">
                  <User className="h-4 w-4 mr-2" />
                  <span>{client.responsible_person || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Person</p>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{client.contact_person || 'Not specified'}</span>
                </div>
              </div>
              
              {client.client_address && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <div className="flex items-start text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{client.client_address}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timestamps */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(client.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last Updated: {formatDate(client.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
