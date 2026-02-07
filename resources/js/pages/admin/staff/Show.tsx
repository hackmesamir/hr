import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import { Link } from '@inertiajs/react';

interface Staff {
  id: number;
  staff_id: string;
  name: string;
  type: string;
  father_name: string | null;
  mother_name: string | null;
  permanent_address: string | null;
  current_address: string | null;
  nid_number: string | null;
  mobile_number: string | null;
  parent_number: string | null;
  cv_upload: string | null;
  status: string;
}

interface Props {
  staff: Staff;
}

export default function ShowStaff({ staff }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Staff Details - ${staff.name}`} />
      
      <Sidebar currentRoute="/admin/staff" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View staff member information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto order-2 sm:order-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Staff List
            </Button>
            <Button asChild className="w-full sm:w-auto order-1 sm:order-2">
              <Link href={`/admin/staff/${staff.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Staff
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff ID</h3>
                    <p className="mt-1 text-base">{staff.staff_id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                    <p className="mt-1 text-base">{staff.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                    <p className="mt-1 text-base capitalize">{staff.type}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <div className="mt-1">
                      <Badge 
                        variant="default"
                        className={`${staff.status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-medium px-2 py-0.5 rounded`}
                      >
                        {staff.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Father's Name</h3>
                    <p className="mt-1 text-base">{staff.father_name || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mother's Name</h3>
                    <p className="mt-1 text-base">{staff.mother_name || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">NID Number</h3>
                    <p className="mt-1 text-base">{staff.nid_number || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CV</h3>
                    <div className="mt-1">
                      {staff.cv_upload ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/${staff.cv_upload}`} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download CV
                          </a>
                        </Button>
                      ) : (
                        <span className="text-gray-500">No CV uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Number</h3>
                <p className="mt-1 text-base">{staff.mobile_number || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent's Number</h3>
                <p className="mt-1 text-base">{staff.parent_number || '-'}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Address Information */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Permanent Address</h3>
                  <p className="mt-1 text-base whitespace-pre-wrap">{staff.permanent_address || '-'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Address</h3>
                  <p className="mt-1 text-base whitespace-pre-wrap">{staff.current_address || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
