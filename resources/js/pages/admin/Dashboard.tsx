import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

export default function AdminDashboard() {
    const logout = useForm({});
    
    function handleLogout(e: React.FormEvent) {
        e.preventDefault();
        logout.post('/admin/logout');
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Admin Dashboard" />
            
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                        <form onSubmit={handleLogout}>
                            <Button variant="outline" type="submit" size="sm" disabled={logout.processing}>
                                <LogOut className="mr-2 h-4 w-4" />
                                {logout.processing ? 'Logging out...' : 'Logout'}
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Manage system users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">0</p>
                            <div className="mt-4">
                                <Button asChild>
                                    <Link href="#">Manage Users</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Clients</CardTitle>
                            <CardDescription>Manage client accounts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">0</p>
                            <div className="mt-4">
                                <Button asChild>
                                    <Link href="#">Manage Clients</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Leaves</CardTitle>
                            <CardDescription>Manage leave requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">0</p>
                            <div className="mt-4">
                                <Button asChild>
                                    <Link href="#">Manage Leaves</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
