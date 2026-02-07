import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  LogOut,
  Menu,
  X,
  Shield,
  User,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentRoute?: string;
}

export default function Sidebar({ currentRoute = '/admin/dashboard' }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useForm({});
  const { props } = usePage();
  const pendingLeavesCount = (props.pendingLeavesCount as number) || 0;
  
  function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    logout.post('/admin/logout');
  }

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/staff', label: 'Staff', icon: Users },
    { href: '/admin/clients', label: 'Clients', icon: Briefcase },
    { href: '/admin/leaves', label: 'Leaves', icon: Calendar, showBadge: true },
    { href: '/admin/attendance', label: 'Attendance', icon: Clock },
    { href: '/admin/admin-users', label: 'Admin Users', icon: Shield },
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
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-purple-800 to-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-white/10">
            <h1 className="text-xl font-bold text-white">HR Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {links.map(({ href, label, icon: Icon, showBadge }) => {
              const isActive = currentRoute === href || 
                (currentRoute?.startsWith(href) && href !== '/admin/dashboard');
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center justify-between px-4 py-3 text-sm rounded-md transition-colors
                    ${isActive 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/80 hover:bg-white/5 hover:text-white'}
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-5 w-5" />
                    {label}
                  </div>
                  {showBadge && pendingLeavesCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {pendingLeavesCount > 99 ? '99+' : pendingLeavesCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {(props.auth as any)?.user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {(props.auth as any)?.user?.email || 'admin@hr.test'}
                </p>
              </div>
            </div>
            <Link
              href="/admin/profile"
              className={`w-full flex items-center justify-center text-white border-white/20 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm transition-colors ${
                currentRoute === '/admin/profile' ? 'bg-white/10 border-white/30' : ''
              }`}
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
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
    </>
  );
}
