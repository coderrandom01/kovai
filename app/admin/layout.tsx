// app/admin/layout.tsx
'use client'
import '@/app/globals.css';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-800">
        <div className="flex flex-col md:flex-row h-screen">
          {/* Mobile Header */}
          <MobileHeader />

          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            <header className="text-2xl font-semibold mb-6">Admin Panel</header>
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

// Separate Sidebar component
function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 bg-brand text-white flex-col p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6"><Link href={'/'}>Kovai Guppies</Link></h2>
      <nav className="flex flex-col gap-2">
        <Link href="/admin/categories" className="hover:bg-white/10 rounded px-3 py-2">Categories</Link>
        <Link href="/admin/listings" className="hover:bg-white/10 rounded px-3 py-2">All Listings</Link>
        <Link href="/admin/addlisting/new" className="hover:bg-white/10 rounded px-3 py-2">Add Listing</Link>
      </nav>
    </aside>
  );
}

// Mobile responsive header with toggle
function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden bg-brand text-white flex items-center justify-between p-4">
        <h2 className="text-xl font-bold"><Link href={'/'}>Kovai Guppies</Link></h2>
        <button onClick={() => setOpen(!open)} className="text-white text-2xl">
          ☰
        </button>
      </header>

      {open && (
        <div className="md:hidden bg-brand text-white flex flex-col p-4 space-y-2">
          <Link href="/admin/categories" className="hover:bg-white/10 rounded px-3 py-2">Categories</Link>
          <Link href="/admin/listings" className="hover:bg-white/10 rounded px-3 py-2">All Listings</Link>
          <Link href="/admin/addlisting/new" className="hover:bg-white/10 rounded px-3 py-2">Add Listing</Link>
        </div>
      )}
    </>
  );
}
