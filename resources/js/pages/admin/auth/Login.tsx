import { useForm, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
    status?: string;
};

export default function AdminLogin({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/login');
    }

    return (
        <AuthLayout
            title="Admin Login"
            description="Enter your credentials to continue"
        >
            <Head title="Admin Login" />
            
            <Card className="w-full shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl overflow-hidden border-t border-white/20">
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="admin@example.com"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                {errors.password && <InputError message={errors.password} />}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={checked => 
                                        setData('remember', checked ? true : false)
                                    }
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-center text-sm mt-4">
                            <Link href="/login" className="text-purple-600 hover:text-blue-600 font-medium transition-colors duration-300">
                                User Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
