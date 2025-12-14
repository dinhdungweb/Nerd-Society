'use client'

import { ThemeContext } from '@/app/theme-provider'
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BuildingStorefrontIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    CubeIcon,
    HomeIcon,
    MoonIcon,
    PencilSquareIcon,
    SunIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext, useState } from 'react'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarDaysIcon },
    { name: 'Combos', href: '/admin/combos', icon: CubeIcon },
    { name: 'Locations', href: '/admin/locations', icon: BuildingStorefrontIcon },
    { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
    { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
    { name: 'Content', href: '/admin/content', icon: PencilSquareIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

// Coffee cup icon for logo
const CoffeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h15a3 3 0 013 3v1a3 3 0 01-3 3h-1.5M3 8v8a4 4 0 004 4h5a4 4 0 004-4v-3M3 8l1-4h13l1 4M7.5 8v1.5m4-1.5v1.5" />
    </svg>
)

export default function AdminSidebar() {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const themeContext = useContext(ThemeContext)
    const isDarkMode = themeContext?.isDarkMode ?? false

    return (
        <>
            {/* Mobile sidebar toggle */}
            <button
                type="button"
                className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden dark:bg-neutral-800"
                onClick={() => setSidebarOpen(true)}
            >
                <Bars3Icon className="size-6 text-neutral-600 dark:text-neutral-300" />
            </button>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform lg:translate-x-0 dark:bg-neutral-900 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-700">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary-500 text-white">
                            <CoffeeIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-neutral-900 dark:text-white">Nerd Society</span>
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Admin Panel</span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        className="rounded-lg p-1 lg:hidden dark:text-neutral-300"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <XMarkIcon className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                                            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                            }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className="size-5" />
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Bottom section */}
                <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={() => themeContext?.toggleDarkMode()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        {isDarkMode ? (
                            <>
                                <SunIcon className="size-5" />
                                Light Mode
                            </>
                        ) : (
                            <>
                                <MoonIcon className="size-5" />
                                Dark Mode
                            </>
                        )}
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <ArrowLeftOnRectangleIcon className="size-5" />
                        Đăng xuất
                    </button>
                </div>
            </aside>
        </>
    )
}
