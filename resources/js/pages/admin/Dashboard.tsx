import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Admin Dashboard" />
            
            <Sidebar currentRoute="/admin/dashboard" />

            <main className="md:ml-64 min-h-screen transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome to the HR Management System</p>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">24</span>
                        <span className="text-xs text-green-500 mt-1">+4.6% from last month</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Clients</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">12</span>
                        <span className="text-xs text-green-500 mt-1">+2.1% from last month</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Leaves</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">7</span>
                        <span className="text-xs text-red-500 mt-1">+3 new requests</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Attendance</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">18</span>
                        <span className="text-xs text-gray-500 mt-1">75% of total staff</span>
                    </div>
                </div>
                
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
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
