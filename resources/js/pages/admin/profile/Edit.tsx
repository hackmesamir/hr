import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, User } from 'lucide-react';
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

export default function ProfileEdit({ admin }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: admin.name || '',
    email: admin.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/admin/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Edit Profile" />
      
      <Sidebar currentRoute="/admin/profile" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your account details and contact information
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
                    placeholder="Enter your full name"
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
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <InputError message={errors.email} />}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your email address is used for login and notifications</li>
                  <li>• Changing your email will affect your login credentials</li>
                  <li>• Make sure to use an email you have access to</li>
                  <li>• Profile changes are logged for security purposes</li>
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
                Update Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
