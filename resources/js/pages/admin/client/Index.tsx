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
  Trash2,
  Building,
  Users
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

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
  clients: Client[];
  deletedClients?: Client[];
}

export default function ClientIndex({ clients, deletedClients = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const [clientToPermanentDelete, setClientToPermanentDelete] = useState<number | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  
  // Filter clients based on search term
  const filteredClients = clients ? clients.filter(client => 
    (client.parent_name && client.parent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.client_name && client.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.responsible_person && client.responsible_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.financial_year && client.financial_year.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.audit_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  // Filter deleted clients based on search term
  const filteredDeletedClients = deletedClients ? deletedClients.filter(client => 
    (client.parent_name && client.parent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.client_name && client.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.responsible_person && client.responsible_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.financial_year && client.financial_year.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.audit_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const handleDeleteClick = (id: number) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };
  
  const handlePermanentDeleteClick = (id: number) => {
    setClientToPermanentDelete(id);
    setPermanentDeleteDialogOpen(true);
  };
  
  const handlePermanentDeleteClose = () => {
    setPermanentDeleteDialogOpen(false);
    setClientToPermanentDelete(null);
  };
  
  const handleRestore = (id: number) => {
    if (confirm('Are you sure you want to restore this client?')) {
      router.post(`/admin/clients/${id}/restore`);
    }
  };
  
  const toggleArchive = () => {
    setShowArchive(!showArchive);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Client Management" />
      
      <Sidebar currentRoute="/admin/clients" />

      <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {showArchive ? 'Archived Clients' : 'Client Management'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {showArchive ? 'View and manage deactivated clients' : 'View and manage clients'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!showArchive && (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/admin/clients/create" className="gap-1 flex items-center justify-center">
                  <UserPlus className="h-4 w-4" />
                  Add Client
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={toggleArchive} className="w-full sm:w-auto">
              <Archive className="h-4 w-4 mr-2" />
              {showArchive ? 'Active Clients' : 'Archive'}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>
                {showArchive ? 'Deactivated Clients' : 'Active Clients'}
              </CardTitle>
              <CardDescription>
                {showArchive 
                  ? 'Clients that have been deactivated and can be restored'
                  : 'Currently active clients'
                }
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by name, email, phone, or address..."
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
                    <TableHead>Client Name</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead className="hidden md:table-cell">Responsible Person</TableHead>
                    <TableHead className="hidden lg:table-cell">Audit Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showArchive ? (
                    filteredDeletedClients.length > 0 ? (
                      filteredDeletedClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.client_name || '-'}</TableCell>
                          <TableCell>{client.parent_name || '-'}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.responsible_person || '-'}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="capitalize">
                              {client.audit_type}
                            </Badge>
                          </TableCell>
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
                                <DropdownMenuItem onClick={() => handleRestore(client.id)}>
                                  <RotateCcw className="mr-2 h-4 w-4" /> Restore
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePermanentDeleteClick(client.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No deactivated clients found
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.client_name || '-'}</TableCell>
                          <TableCell>{client.parent_name || '-'}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.responsible_person || '-'}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="capitalize">
                              {client.audit_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="default"
                              className={`${
                                client.status.toLowerCase() === 'active' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                              } text-xs font-medium px-2 py-0.5 rounded`}
                            >
                              {client.status}
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
                                  <Link href={`/admin/clients/${client.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/clients/${client.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/clients/${client.id}/assign-users`}>
                                    <Users className="mr-2 h-4 w-4" /> Assign Users
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(client.id)}>
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No clients found
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing {showArchive ? filteredDeletedClients.length : filteredClients.length} of {showArchive ? deletedClients?.length || 0 : clients?.length || 0} results
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
        {clientToDelete && (
          <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            onClose={handleDeleteClose}
            title="Deactivate Client"
            description="Are you sure you want to deactivate this client? This will hide them from the listing but can be restored later."
            itemId={clientToDelete}
            deleteEndpoint={`/admin/clients/${clientToDelete}`}
          />
        )}
        
        {/* Permanent Delete Confirmation Dialog */}
        {clientToPermanentDelete && (
          <DeleteConfirmDialog
            isOpen={permanentDeleteDialogOpen}
            onClose={handlePermanentDeleteClose}
            title="Delete Client Permanently"
            description="Are you sure you want to permanently delete this client? This action cannot be undone and all data will be lost."
            itemId={clientToPermanentDelete}
            deleteEndpoint={`/admin/clients/${clientToPermanentDelete}/force-delete`}
          />
        )}
      </main>
    </div>
  );
}
