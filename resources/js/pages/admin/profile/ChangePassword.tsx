import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Key, Shield, AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import InputError from '@/components/input-error';

export default function ChangePassword() {
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/admin/profile/change-password', {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Change Password" />
      
      <Sidebar currentRoute="/admin/profile" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Change Password</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your account password for security</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Password Security
            </CardTitle>
            <CardDescription>
              Choose a strong, unique password to protect your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Current Password <span className="text-red-500">*</span></Label>
                  <Input 
                    id="current_password" 
                    type="password" 
                    value={data.current_password} 
                    onChange={e => setData('current_password', e.target.value)} 
                    required
                    placeholder="Enter your current password"
                  />
                  {errors.current_password && <InputError message={errors.current_password} />}
                </div>

                <div>
                  <Label htmlFor="password">New Password <span className="text-red-500">*</span></Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={data.password} 
                    onChange={e => setData('password', e.target.value)} 
                    required
                    placeholder="Enter your new password"
                  />
                  {errors.password && <InputError message={errors.password} />}
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Confirm New Password <span className="text-red-500">*</span></Label>
                  <Input 
                    id="password_confirmation" 
                    type="password" 
                    value={data.password_confirmation} 
                    onChange={e => setData('password_confirmation', e.target.value)} 
                    required
                    placeholder="Confirm your new password"
                  />
                  {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Security Notice
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• You will be logged out after changing your password</li>
                    <li>• Use a strong, unique password that you haven't used before</li>
                    <li>• Avoid using common words, names, or sequential characters</li>
                    <li>• Consider using a password manager for better security</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Password Requirements
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains at least one uppercase letter</li>
                    <li>• Contains at least one lowercase letter</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>
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
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
