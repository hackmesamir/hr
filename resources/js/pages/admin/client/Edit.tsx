import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
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
}

interface Props {
  client: Client;
}

export default function EditClient({ client }: Props) {
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
    put(`/admin/clients/${client.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Edit Client - ${client.client_name || client.parent_name}`} />
      
      <Sidebar currentRoute="/admin/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Client</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update client information</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Update the client details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="parent_name">Parent Name *</Label>
                  <Input
                    id="parent_name"
                    type="text"
                    value={data.parent_name}
                    onChange={(e) => setData('parent_name', e.target.value)}
                    placeholder="Enter parent company name"
                    required
                  />
                  <InputError message={errors.parent_name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Business Name *</Label>
                  <Input
                    id="client_name"
                    type="text"
                    value={data.client_name}
                    onChange={(e) => setData('client_name', e.target.value)}
                    placeholder="Enter client business name"
                    required
                  />
                  <InputError message={errors.client_name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsible_person">Responsible Person</Label>
                  <Input
                    id="responsible_person"
                    type="text"
                    value={data.responsible_person}
                    onChange={(e) => setData('responsible_person', e.target.value)}
                    placeholder="Enter responsible person name"
                  />
                  <InputError message={errors.responsible_person} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    type="text"
                    value={data.contact_person}
                    onChange={(e) => setData('contact_person', e.target.value)}
                    placeholder="Enter contact person name"
                  />
                  <InputError message={errors.contact_person} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="financial_year">Financial Year</Label>
                  <Input
                    id="financial_year"
                    type="text"
                    value={data.financial_year}
                    onChange={(e) => setData('financial_year', e.target.value)}
                    placeholder="e.g., 2024-2025"
                  />
                  <InputError message={errors.financial_year} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="audit_type">Audit Type *</Label>
                  <Select value={data.audit_type} onValueChange={(value) => setData('audit_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statutory">Statutory</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.audit_type} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.status} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_address">Client Address</Label>
                <Textarea
                  id="client_address"
                  value={data.client_address}
                  onChange={(e) => setData('client_address', e.target.value)}
                  placeholder="Enter client business address"
                  rows={3}
                />
                <InputError message={errors.client_address} />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
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
                  disabled={processing}
                  className="w-full sm:w-auto"
                >
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Client
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
