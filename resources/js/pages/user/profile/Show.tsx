import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Key,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '@/components/user/Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  staff_id: string;
  mobile_number: string;
  type: string;
  status: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  user: User;
}

export default function ProfileShow({ user }: Props) {
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
    <div className="min-h-screen bg-white">
      <Head title="My Profile" />
      
      <Sidebar currentRoute="/profile" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 pt-20 md:pt-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        {/* Profile Card */}
        <Card className="max-w-2xl mx-auto">
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Personal Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Staff ID</p>
                    <p className="font-mono">{user.staff_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-medium">{user.mobile_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Account Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Employee Type</p>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {user.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <Badge className={
                      user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                    }>
                      {user.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Verification</p>
                    <Badge className={
                      user.email_verified_at ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }>
                      {user.email_verified_at ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Activity */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Account Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Account Created</p>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(user.updated_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Age</p>
                  <p className="font-medium">
                    {(() => {
                      const days = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
                      if (days === 0) return 'Today';
                      if (days === 1) return '1 day';
                      if (days < 7) return `${days} days`;
                      if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
                      if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''}`;
                      return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''}`;
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild>
                <Link href="/profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild>
                <Link href="/profile/change-password">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
