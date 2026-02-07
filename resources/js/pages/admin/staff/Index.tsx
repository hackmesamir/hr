import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash, 
  UserPlus,
  Filter,
  Eye,
  RotateCcw,
  Archive,
  Trash2
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

// Staff data will come from the database via props

interface Staff {
  id: number;
  staff_id: string;
  name: string;
  type: string;
  status: string;
  father_name?: string;
  mother_name?: string;
  permanent_address?: string;
  current_address?: string;
  nid_number?: string;
  mobile_number?: string;
  parent_number?: string;
  cv_upload?: string;
}

interface Props {
  staff: Staff[];
  deletedStaff?: Staff[];
}

export default function StaffIndex({ staff, deletedStaff = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const [staffToPermanentDelete, setStaffToPermanentDelete] = useState<number | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  
  // Filter staff members based on search term
  const filteredStaff = staff ? staff.filter(staffMember => 
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staffMember.mobile_number && staffMember.mobile_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (staffMember.nid_number && staffMember.nid_number.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];
  
  // Filter deleted staff members based on search term
  const filteredDeletedStaff = deletedStaff ? deletedStaff.filter(staffMember => 
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staffMember.mobile_number && staffMember.mobile_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (staffMember.nid_number && staffMember.nid_number.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];
  
  const handleDeleteClick = (id: number) => {
    setStaffToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setStaffToDelete(null);
  };
  
  const handlePermanentDeleteClick = (id: number) => {
    setStaffToPermanentDelete(id);
    setPermanentDeleteDialogOpen(true);
  };
  
  const handlePermanentDeleteClose = () => {
    setPermanentDeleteDialogOpen(false);
    setStaffToPermanentDelete(null);
  };
  
  const handleRestore = (id: number) => {
    if (confirm('Are you sure you want to restore this staff member?')) {
      router.post(`/admin/staff/${id}/restore`);
    }
  };
  
  const toggleArchive = () => {
    setShowArchive(!showArchive);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Staff Management" />
      
      <Sidebar currentRoute="/admin/staff" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {showArchive ? 'Archived Staff' : 'Staff Management'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {showArchive ? 'View and manage deactivated staff members' : 'View and manage staff members'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!showArchive && (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/admin/staff/create" className="gap-1 flex items-center justify-center">
                  <UserPlus className="h-4 w-4" />
                  Add Staff
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={toggleArchive} className="w-full sm:w-auto">
              <Archive className="h-4 w-4 mr-2" />
              {showArchive ? 'Active Staff' : 'Archive'}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>
                {showArchive ? 'Deactivated Staff Members' : 'Active Staff Members'}
              </CardTitle>
              <CardDescription>
                {showArchive 
                  ? 'Staff members that have been deactivated and can be restored'
                  : 'Currently active staff members'
                }
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={`Search by name, ID, type, mobile, or NID...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <Button variant="outline" size="sm" disabled>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Mobile Number</TableHead>
                    <TableHead className="hidden lg:table-cell">NID Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showArchive ? (
                    filteredDeletedStaff.length > 0 ? (
                      filteredDeletedStaff.map((staffMember) => (
                        <TableRow key={staffMember.id}>
                          <TableCell className="font-medium">{staffMember.staff_id}</TableCell>
                          <TableCell>{staffMember.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{staffMember.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{staffMember.mobile_number || '-'}</TableCell>
                          <TableCell className="hidden lg:table-cell">{staffMember.nid_number || '-'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="default"
                              className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded"
                            >
                              Deactivated
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRestore(staffMember.id)}>
                                  <RotateCcw className="mr-2 h-4 w-4" /> Restore
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePermanentDeleteClick(staffMember.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No deactivated staff members found
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    filteredStaff.length > 0 ? (
                      filteredStaff.map((staffMember) => (
                        <TableRow key={staffMember.id}>
                          <TableCell className="font-medium">{staffMember.staff_id}</TableCell>
                          <TableCell>{staffMember.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{staffMember.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{staffMember.mobile_number || '-'}</TableCell>
                          <TableCell className="hidden lg:table-cell">{staffMember.nid_number || '-'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="default"
                              className={`${
                                staffMember.status.toLowerCase() === 'active' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                              } text-xs font-medium px-2 py-0.5 rounded`}
                            >
                              {staffMember.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/staff/${staffMember.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/staff/${staffMember.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(staffMember.id)}>
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No staff members found
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing {showArchive ? filteredDeletedStaff.length : filteredStaff.length} of {showArchive ? deletedStaff?.length || 0 : staff?.length || 0} results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Delete Confirmation Dialog */}
        {staffToDelete && (
          <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            onClose={handleDeleteClose}
            title="Deactivate Staff Member"
            description="Are you sure you want to deactivate this staff member? This will hide them from the listing but can be restored later."
            itemId={staffToDelete}
            deleteEndpoint={`/admin/staff/${staffToDelete}`}
          />
        )}
        
        {/* Permanent Delete Confirmation Dialog */}
        {staffToPermanentDelete && (
          <DeleteConfirmDialog
            isOpen={permanentDeleteDialogOpen}
            onClose={handlePermanentDeleteClose}
            title="Delete Staff Member Permanently"
            description="Are you sure you want to permanently delete this staff member? This action cannot be undone and all data will be lost."
            itemId={staffToPermanentDelete}
            deleteEndpoint={`/admin/staff/${staffToPermanentDelete}/force-delete`}
          />
        )}
      </main>
    </div>
  );
}
