import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import InputError from '@/components/input-error';

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

export default function EditStaff({ staff }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    staff_id: staff.staff_id || '',
    name: staff.name || '',
    type: staff.type || 'employee',
    father_name: staff.father_name || '',
    mother_name: staff.mother_name || '',
    permanent_address: staff.permanent_address || '',
    current_address: staff.current_address || '',
    nid_number: staff.nid_number || '',
    mobile_number: staff.mobile_number || '',
    parent_number: staff.parent_number || '',
    password: '',
    status: staff.status || 'active',
    cv_upload: null as File | null,
  });

  const [sameAsPermAddress, setSameAsPermAddress] = useState(false);

  useEffect(() => {
    // Check if addresses are the same initially
    if (staff.permanent_address && staff.current_address && 
        staff.permanent_address === staff.current_address) {
      setSameAsPermAddress(true);
    }
  }, [staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/staff/${staff.id}`, {
      forceFormData: true,
      onSuccess: () => {
        // Reset password field only
        setData('password', '');
        setData('cv_upload', null);
      },
    });
  };

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsPermAddress(e.target.checked);
    if (e.target.checked) {
      setData('current_address', data.permanent_address);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Edit Staff - ${staff.name}`} />
      
      <Sidebar currentRoute="/admin/staff" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Staff</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update staff member information</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff List
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>Update the details for {staff.name}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="staff_id">Staff ID <span className="text-red-500">*</span></Label>
                    <Input 
                      id="staff_id" 
                      value={data.staff_id} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('staff_id', e.target.value)} 
                      required
                    />
                    {errors.staff_id && <InputError message={errors.staff_id} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      value={data.name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)} 
                      required
                    />
                    {errors.name && <InputError message={errors.name} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                    <Select 
                      value={data.type} 
                      onValueChange={value => setData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <InputError message={errors.type} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                    <Select 
                      value={data.status} 
                      onValueChange={value => setData('status', value)}
                    >
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
                  
                  <div>
                    <Label htmlFor="password">Password (leave blank to keep current)</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={data.password} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)} 
                    />
                    <p className="text-xs text-gray-500 mt-1">Only fill this if you want to change the password</p>
                    {errors.password && <InputError message={errors.password} />}
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="father_name">Father's Name</Label>
                    <Input 
                      id="father_name" 
                      value={data.father_name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('father_name', e.target.value)} 
                    />
                    {errors.father_name && <InputError message={errors.father_name} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="mother_name">Mother's Name</Label>
                    <Input 
                      id="mother_name" 
                      value={data.mother_name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('mother_name', e.target.value)} 
                    />
                    {errors.mother_name && <InputError message={errors.mother_name} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="nid_number">NID Number</Label>
                    <Input 
                      id="nid_number" 
                      value={data.nid_number} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nid_number', e.target.value)} 
                    />
                    {errors.nid_number && <InputError message={errors.nid_number} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="mobile_number">Mobile Number</Label>
                    <Input 
                      id="mobile_number" 
                      value={data.mobile_number} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('mobile_number', e.target.value)} 
                    />
                    {errors.mobile_number && <InputError message={errors.mobile_number} />}
                  </div>
                  
                  <div>
                    <Label htmlFor="parent_number">Parent's Number</Label>
                    <Input 
                      id="parent_number" 
                      value={data.parent_number} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('parent_number', e.target.value)} 
                    />
                    {errors.parent_number && <InputError message={errors.parent_number} />}
                  </div>

                  <div>
                    <Label htmlFor="cv_upload">CV Upload</Label>
                    <Input 
                      id="cv_upload" 
                      type="file" 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] || null;
                        setData('cv_upload', file);
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                    <div className="mt-2 space-y-1">
                      {staff.cv_upload ? (
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-green-700 font-medium">Current CV:</span>
                            <span className="text-sm text-gray-600">{staff.cv_upload.split('/').pop()}</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/${staff.cv_upload}`, '_blank')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No CV uploaded yet</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Upload CV in PDF or Word format (Max: 20MB)
                      </p>
                    </div>
                    {errors.cv_upload && <InputError message={errors.cv_upload} />}
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="permanent_address">Permanent Address</Label>
                  <Textarea 
                    id="permanent_address" 
                    value={data.permanent_address} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setData('permanent_address', e.target.value);
                      if (sameAsPermAddress) {
                        setData('current_address', e.target.value);
                      }
                    }} 
                  />
                  {errors.permanent_address && <InputError message={errors.permanent_address} />}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="same_address"
                    checked={sameAsPermAddress}
                    onChange={handleSameAddressChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="same_address" className="text-sm font-normal">
                    Current address is same as permanent address
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="current_address">Current Address</Label>
                  <Textarea 
                    id="current_address" 
                    value={data.current_address} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('current_address', e.target.value)} 
                    disabled={sameAsPermAddress}
                  />
                  {errors.current_address && <InputError message={errors.current_address} />}
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
                Update Staff
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
