import { Link } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X
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
  
  function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    logout.post('/admin/logout');
  }

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/staff', label: 'Staff', icon: Users },
    { href: '/admin/clients', label: 'Clients', icon: Briefcase },
    { href: '/admin/leaves', label: 'Leaves', icon: Calendar },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
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
            {links.map((link) => {
              const isActive = currentRoute === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center px-4 py-3 text-sm rounded-md transition-colors
                    ${isActive 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/80 hover:bg-white/5 hover:text-white'}
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleLogout}>
              <Button 
                variant="outline" 
                type="submit" 
                disabled={logout.processing}
                className="w-full flex items-center justify-center text-white border-white/20 hover:bg-white/10 hover:text-white"
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
