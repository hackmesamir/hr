import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Briefcase,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  Building,
  ArrowLeft,
  Save,
  AlertCircle
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';
import InputError from '@/components/input-error';

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
  client: Client;
}

export default function ClientEdit({ client }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    parent_name: client.parent_name || '',
    client_name: client.client_name || '',
    client_address: client.client_address || '',
    responsible_person: client.responsible_person || '',
    contact_person: client.contact_person || '',
    financial_year: client.financial_year || '',
    audit_type: client.audit_type || 'statutory',
    status: client.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/clients/${client.id}`, {
      onSuccess: () => {
        // Success handling - redirect back to clients list
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Head title="Edit Client" />
      
      <Sidebar currentRoute="/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
            <p className="mt-1 text-sm text-gray-500">Update client information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href={`/clients/${client.id}`}>
                <Briefcase className="mr-2 h-4 w-4" />
                View Client
              </Link>
            </Button>
          </div>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
              Edit Client Information
            </CardTitle>
            <CardDescription>
              Update the details for {client.client_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parent_name">Parent Name</Label>
                    <Input
                      id="parent_name"
                      type="text"
                      value={data.parent_name}
                      onChange={e => setData('parent_name', e.target.value)}
                      placeholder="Enter parent company name"
                    />
                    {errors.parent_name && <InputError message={errors.parent_name} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="client_name">Client Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="client_name"
                      type="text"
                      value={data.client_name}
                      onChange={e => setData('client_name', e.target.value)}
                      placeholder="Enter client name"
                      required
                    />
                    {errors.client_name && <InputError message={errors.client_name} />}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="client_address">Client Address</Label>
                  <Textarea
                    id="client_address"
                    value={data.client_address}
                    onChange={e => setData('client_address', e.target.value)}
                    placeholder="Enter client address"
                    rows={3}
                  />
                  {errors.client_address && <InputError message={errors.client_address} />}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsible_person">Responsible Person</Label>
                    <Input
                      id="responsible_person"
                      type="text"
                      value={data.responsible_person}
                      onChange={e => setData('responsible_person', e.target.value)}
                      placeholder="Enter responsible person name"
                    />
                    {errors.responsible_person && <InputError message={errors.responsible_person} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      type="text"
                      value={data.contact_person}
                      onChange={e => setData('contact_person', e.target.value)}
                      placeholder="Enter contact person name"
                    />
                    {errors.contact_person && <InputError message={errors.contact_person} />}
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="financial_year">Financial Year</Label>
                    <Input
                      id="financial_year"
                      type="text"
                      value={data.financial_year}
                      onChange={e => setData('financial_year', e.target.value)}
                      placeholder="e.g., 2023-2024"
                    />
                    {errors.financial_year && <InputError message={errors.financial_year} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="audit_type">Audit Type</Label>
                    <Select value={data.audit_type} onValueChange={value => setData('audit_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="statutory">Statutory</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.audit_type && <InputError message={errors.audit_type} />}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={value => setData('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <InputError message={errors.status} />}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t">
                <div className="text-sm text-gray-500">
                  <div className="text-xs text-gray-400 mt-1">
                    Created: {new Date(client.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {processing && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Update Client
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Alert */}
        <Card className="mt-6 border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Client Name is required field</li>
                  <li>• Parent Name is the parent company</li>
                  <li>• Responsible Person manages the client</li>
                  <li>• Contact Person is the main contact</li>
                  <li>• Financial Year for audit purposes</li>
                  <li>• Audit Type determines audit scope</li>
                  <li>• Status affects client visibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
