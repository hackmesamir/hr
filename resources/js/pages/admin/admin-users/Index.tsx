import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash,
  Shield,
  Calendar
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

interface Admin {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Props {
  admins: Admin[];
}

export default function AdminUsersIndex({ admins }: Props) {
  const { props } = usePage();
  const currentUserId = (props.auth as any)?.user?.id;
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this admin user?')) {
      router.delete(`/admin/admin-users/${id}`, {
        onSuccess: () => {
          router.reload();
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Admin Users" />
      
      <Sidebar currentRoute="/admin/admin-users" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Users</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage system administrator accounts</p>
          </div>
          <Button asChild>
            <Link href="/admin/admin-users/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin User
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Administrator Accounts
            </CardTitle>
            <CardDescription>
              System administrators with access to the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {admins.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-sm text-gray-500">Administrator</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-sm">{admin.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(admin.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/admin-users/${admin.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/admin-users/${admin.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(admin.id)}
                              className="text-red-600"
                              disabled={admin.id === currentUserId}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {admin.id === currentUserId ? 'Cannot Delete Self' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No admin users</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating an admin user.</p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/admin-users/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Admin User
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
