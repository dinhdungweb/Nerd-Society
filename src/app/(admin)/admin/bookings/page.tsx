import { prisma } from '@/lib/prisma'
import {
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

async function getBookings() {
    return prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true, phone: true } },
            location: { select: { name: true } },
            combo: { select: { name: true, duration: true } },
            payment: { select: { status: true, method: true } },
        },
    })
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    CHECKED_IN: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    COMPLETED: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    NO_SHOW: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
}

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    CHECKED_IN: 'Đã check-in',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    NO_SHOW: 'Không đến',
}

export default async function BookingsPage() {
    const bookings = await getBookings()

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Quản lý Booking</h1>
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                        Xem và quản lý tất cả đặt lịch
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <ClockIcon className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {bookings.filter(b => b.status === 'PENDING').length}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Chờ xác nhận</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <CheckCircleIcon className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {bookings.filter(b => b.status === 'CONFIRMED').length}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Đã xác nhận</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircleIcon className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {bookings.filter(b => b.status === 'CHECKED_IN').length}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Đang sử dụng</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <XCircleIcon className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {bookings.filter(b => b.status === 'CANCELLED').length}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Đã hủy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900">
                {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-200 text-left text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                                    <th className="px-6 py-4 font-medium">Mã booking</th>
                                    <th className="px-6 py-4 font-medium">Khách hàng</th>
                                    <th className="px-6 py-4 font-medium">Cơ sở</th>
                                    <th className="px-6 py-4 font-medium">Combo</th>
                                    <th className="px-6 py-4 font-medium">Ngày/Giờ</th>
                                    <th className="px-6 py-4 font-medium">Tổng tiền</th>
                                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                                    <th className="px-6 py-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            {booking.bookingCode}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-neutral-900 dark:text-white">{booking.user.name}</p>
                                                <p className="text-neutral-500 dark:text-neutral-400">{booking.user.phone || booking.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-neutral-600 dark:text-neutral-300">
                                            {booking.location.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-neutral-600 dark:text-neutral-300">
                                            {booking.combo.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-neutral-600 dark:text-neutral-300">
                                            <div>
                                                <p>{new Date(booking.date).toLocaleDateString('vi-VN')}</p>
                                                <p className="text-neutral-500 dark:text-neutral-400">{booking.startTime} - {booking.endTime}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[booking.status]}`}>
                                                {statusLabels[booking.status]}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Link
                                                href={`/admin/bookings/${booking.id}`}
                                                className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                                            >
                                                <EyeIcon className="size-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <ClockIcon className="mx-auto size-12 text-neutral-300 dark:text-neutral-600" />
                        <p className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">Chưa có booking nào</p>
                        <p className="mt-1 text-neutral-500 dark:text-neutral-400">Các booking sẽ xuất hiện ở đây</p>
                    </div>
                )}
            </div>
        </div>
    )
}
