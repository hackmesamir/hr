import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import InputError from '@/components/input-error';

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Props {
  admin: Admin;
}

export default function EditAdminUser({ admin }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: admin.name || '',
    email: admin.email || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/admin-users/${admin.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Edit Admin User - ${admin.name}`} />
      
      <Sidebar currentRoute="/admin/admin-users" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Admin User</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update administrator account information</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Users
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Admin User Information
            </CardTitle>
            <CardDescription>
              Update the administrator account details
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={data.name} 
                    onChange={e => setData('name', e.target.value)} 
                    required
                    placeholder="Enter admin's full name"
                  />
                  {errors.name && <InputError message={errors.name} />}
                </div>

                <div>
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={data.email} 
                    onChange={e => setData('email', e.target.value)} 
                    required
                    placeholder="admin@example.com"
                  />
                  {errors.email && <InputError message={errors.email} />}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Change Password (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Leave these fields empty if you don't want to change the password.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="password">New Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={data.password} 
                        onChange={e => setData('password', e.target.value)} 
                        placeholder="Enter new password (optional)"
                      />
                      {errors.password && <InputError message={errors.password} />}
                    </div>

                    <div>
                      <Label htmlFor="password_confirmation">Confirm New Password</Label>
                      <Input 
                        id="password_confirmation" 
                        type="password" 
                        value={data.password_confirmation} 
                        onChange={e => setData('password_confirmation', e.target.value)} 
                        placeholder="Confirm new password"
                      />
                      {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Security Warning</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Changing credentials affects system access</li>
                  <li>• Ensure the new password is strong and secure</li>
                  <li>• Update any stored credentials if changed</li>
                  <li>• Log out all sessions after password change</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
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
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Admin User
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
