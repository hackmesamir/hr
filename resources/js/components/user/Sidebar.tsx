import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Clock,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentRoute?: string;
}

export default function Sidebar({ currentRoute = '/dashboard' }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useForm({});
  const { props } = usePage();
  
  // Check if user has marked attendance today
  const todayAttendance = (props as any).todayAttendance;
  const hasAttendanceToday = todayAttendance && todayAttendance.check_in_time;

  function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    logout.post('/logout');
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/attendance', label: 'Attendance', icon: Clock, needsAttention: !hasAttendanceToday },
    { href: '/clients', label: 'My Clients', icon: Briefcase },
    { href: '/leave/apply', label: 'Apply Leave', icon: FileText },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-white shadow-md"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-600 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-700 border-b border-blue-800">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-white" />
              <span className="text-white font-bold text-lg">Employee Portal</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {links.map((link) => {
              const isActive = currentRoute === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : link.needsAttention
                      ? 'text-yellow-300 bg-yellow-600 hover:bg-yellow-700 hover:text-white animate-pulse'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon className="mr-3 h-5 w-5" />
                  {link.label}
                  {link.needsAttention && (
                    <span className="ml-auto w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {(props.auth as any)?.user?.name || 'Employee'}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  {(props.auth as any)?.user?.email || 'employee@company.com'}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className={`w-full flex items-center justify-center text-white border-white/20 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm transition-colors ${
                currentRoute === '/profile' ? 'bg-white/10 border-white/30' : ''
              }`}
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-blue-700">
            <form onSubmit={handleLogout}>
              <Button 
                variant="outline" 
                type="submit" 
                disabled={logout.processing}
                className="w-full flex items-center justify-center text-white bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logout.processing ? 'Logging out...' : 'Logout'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
