import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
    BanknotesIcon,
    CalendarDaysIcon,
    ClockIcon,
    UsersIcon,
} from '@heroicons/react/24/outline'

async function getStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
        totalBookings,
        todayBookings,
        pendingBookings,
        totalCustomers,
    ] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({
            where: {
                createdAt: { gte: today },
            },
        }),
        prisma.booking.count({
            where: { status: 'PENDING' },
        }),
        prisma.user.count({
            where: { role: 'CUSTOMER' },
        }),
    ])

    // Calculate revenue (simplified)
    const payments = await prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
    })

    return {
        totalBookings,
        todayBookings,
        pendingBookings,
        totalCustomers,
        totalRevenue: payments._sum.amount || 0,
    }
}

async function getRecentBookings() {
    return prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } },
            location: { select: { name: true } },
            combo: { select: { name: true } },
        },
    })
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    CHECKED_IN: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    COMPLETED: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    CHECKED_IN: 'Đã check-in',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
}



export default async function AdminDashboard() {
    const stats = await getStats()
    const recentBookings = await getRecentBookings()

    const statCards = [
        {
            name: 'Tổng doanh thu',
            value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue),
            change: '+12.5%', // Fake trend
            trend: 'up',
            icon: BanknotesIcon,
            color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
        },
        {
            name: 'Booking hôm nay',
            value: stats.todayBookings.toString(),
            change: '+2',
            trend: 'up',
            icon: CalendarDaysIcon,
            color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
        },
        {
            name: 'Chờ xác nhận',
            value: stats.pendingBookings.toString(),
            change: '-1',
            trend: 'down',
            icon: ClockIcon,
            color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
        },
        {
            name: 'Tổng khách hàng',
            value: stats.totalCustomers.toString(),
            change: '+5',
            trend: 'up',
            icon: UsersIcon,
            color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Tổng quan</h1>
                <div className="mt-1 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <span>{format(new Date(), 'EEEE, d MMMM yyyy', { locale: vi })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:translate-y-[-2px] hover:shadow-lg dark:bg-neutral-900 dark:shadow-none"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`rounded-xl p-3 ${stat.color}`}>
                                <stat.icon className="size-6" />
                            </div>
                            {stat.trend === 'up' ? (
                                <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            ) : (
                                <span className="flex items-center text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.name}</p>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:bg-neutral-900 dark:shadow-none border border-neutral-100 dark:border-neutral-800">
                <div className="border-b border-neutral-100 px-8 py-6 dark:border-neutral-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Booking gần đây</h2>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">Xem tất cả</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                <th className="px-8 py-4">Mã booking</th>
                                <th className="px-8 py-4">Khách hàng</th>
                                <th className="px-8 py-4">Dịch vụ</th>
                                <th className="px-8 py-4">Trạng thái</th>
                                <th className="px-8 py-4 text-right">Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <tr key={booking.id} className="text-sm hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="whitespace-nowrap px-8 py-4 font-medium text-neutral-900 dark:text-white">
                                            {booking.bookingCode}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                                    {booking.user.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-neutral-900 dark:text-white">{booking.user.name}</p>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{booking.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div>
                                                <p className="font-medium text-neutral-900 dark:text-white">{booking.combo.name}</p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{booking.location.name}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                                booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                                                    booking.status === 'COMPLETED' ? 'bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700' :
                                                        'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-blue-500' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-500' :
                                                        booking.status === 'COMPLETED' ? 'bg-neutral-500' :
                                                            'bg-red-500'
                                                    }`} />
                                                {statusLabels[booking.status]}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-4 text-right font-medium text-neutral-900 dark:text-white">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                        Chưa có dữ liệu đặt lịch
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
