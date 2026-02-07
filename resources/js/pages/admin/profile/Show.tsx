import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Shield, 
  Mail, 
  Calendar, 
  User, 
  Key,
  Clock,
  CheckCircle
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface Admin {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  admin: Admin;
}

export default function ProfileShow({ admin }: Props) {
  const { props } = usePage();
  const flash = props.flash as any;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="My Profile" />
      
      <Sidebar currentRoute="/admin/profile" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        {/* Success Message */}
        {flash?.success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">{flash.success}</p>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings and security</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/admin/profile/change-password">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                    <p className="mt-1 text-base font-medium">{admin.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                    <div className="mt-1 flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="text-base">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Verification</h3>
                    <div className="mt-1">
                      {admin.email_verified_at ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Clock className="mr-1 h-3 w-3" />
                          Not Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</h3>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Shield className="mr-1 h-3 w-3" />
                        System Administrator
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</h3>
                    <p className="mt-1 text-base font-mono">#{admin.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Account Permissions</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Full access to admin dashboard</li>
                  <li>• Manage staff members and clients</li>
                  <li>• Approve/reject leave requests</li>
                  <li>• Manage other admin users</li>
                  <li>• System configuration and settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Your account timeline and history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</h3>
                <p className="mt-1 text-base">{formatDateTime(admin.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                <p className="mt-1 text-base">{formatDateTime(admin.updated_at)}</p>
              </div>
              
              {admin.email_verified_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Verified</h3>
                  <p className="mt-1 text-base">{formatDateTime(admin.email_verified_at)}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Age</h3>
                <p className="mt-1 text-base">
                  {Math.floor((Date.now() - new Date(admin.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
