import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Admin Dashboard',
    description: 'Nerd Society Admin Dashboard',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <AdminSidebar />

            {/* Main content */}
            <main className="lg:pl-72">
                <div className="min-h-screen p-4 pt-20 lg:p-8 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
