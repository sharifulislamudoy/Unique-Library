import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT SIDEBAR */}
      <aside className="w-1/4 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-3">
          <Link href="/dashboard/dokan-sells" className="block p-2 rounded hover:bg-blue-100">
            Dokan Sells
          </Link>
          <Link href="/dashboard/computer-sells" className="block p-2 rounded hover:bg-blue-100">
            Computer Sells
          </Link>
          <Link href="/dashboard/bkash-sells" className="block p-2 rounded hover:bg-blue-100">
            B-Kash Sells
          </Link>
          <Link href="/dashboard/dokan-khoroch" className="block p-2 rounded hover:bg-blue-100">
            Dokan Khoroch
          </Link>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="w-3/4 p-6">{children}</main>
    </div>
  );
}
