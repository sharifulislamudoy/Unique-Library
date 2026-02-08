import Link from "next/link";
import { Home, Store, Monitor, Smartphone, TrendingDown, LogOut } from "lucide-react";
import LogoutButton from "./logout-button";

export default function DashboardLayout({ children }) {
  const menuItems = [
    { href: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { href: "/dashboard/dokan-sells", icon: <Store className="w-5 h-5" />, label: "Dokan Sells" },
    { href: "/dashboard/computer-sells", icon: <Monitor className="w-5 h-5" />, label: "Computer Sells" },
    { href: "/dashboard/bkash-sells", icon: <Smartphone className="w-5 h-5" />, label: "Bkash Sells" },
    { href: "/dashboard/dokan-khoroch", icon: <TrendingDown className="w-5 h-5" />, label: "Dokan Khoroch" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="w-11/12 mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="w-11/12 mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sky-800 rounded-xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-sky-100 rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all duration-200">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}