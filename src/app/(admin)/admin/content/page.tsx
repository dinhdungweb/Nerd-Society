'use client'

import { Button } from '@/shared/Button'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface Settings {
    heroTitle: string
    heroSubtitle: string
    heroCta: string
    aboutTitle: string
    aboutContent: string
}

export default function AdminContentPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Settings>({
        heroTitle: 'Không gian học tập & làm việc dành riêng cho Gen Z',
        heroSubtitle: 'Trải nghiệm không gian Nerd Society với đầy đủ tiện nghi, wifi tốc độ cao và cafe miễn phí.',
        heroCta: 'Đặt chỗ ngay',
        aboutTitle: 'Câu chuyện của Nerd',
        aboutContent: 'Chúng mình tin rằng một không gian tốt sẽ khơi nguồn cảm hứng vô tận. Tại Nerd Society, mỗi góc nhỏ đều được chăm chút để bạn có thể tập trung tối đa.',
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (res.ok && Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error('Failed to load settings', error)
            toast.error('Không thể tải cấu hình')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (key: keyof Settings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            })

            if (!res.ok) throw new Error('Failed to save')

            toast.success('Đã lưu thay đổi!')
        } catch (error) {
            toast.error('Lỗi khi lưu!')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Đang tải...</div>

    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Quản lý nội dung Landing Page</h1>
                <p className="text-neutral-500">Chỉnh sửa các đoạn văn bản trên trang chủ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-neutral-200">

                {/* HERO SECTION */}
                <div className="pt-6">
                    <h2 className="mb-4 text-lg font-medium text-neutral-900">Hero Section (Phần đầu trang)</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Tiêu đề chính</label>
                            <input
                                type="text"
                                value={settings.heroTitle}
                                onChange={e => handleChange('heroTitle', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Mô tả phụ</label>
                            <textarea
                                rows={3}
                                value={settings.heroSubtitle}
                                onChange={e => handleChange('heroSubtitle', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Nút hành động (CTA)</label>
                            <input
                                type="text"
                                value={settings.heroCta}
                                onChange={e => handleChange('heroCta', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>

                {/* ABOUT SECTION */}
                <div className="pt-6">
                    <h2 className="mb-4 text-lg font-medium text-neutral-900">About Section (Giới thiệu)</h2>
                    <div className="grid gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Tiêu đề</label>
                            <input
                                type="text"
                                value={settings.aboutTitle}
                                onChange={e => handleChange('aboutTitle', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Nội dung</label>
                            <textarea
                                rows={5}
                                value={settings.aboutContent}
                                onChange={e => handleChange('aboutContent', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" loading={saving} disabled={saving} color="primary">
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    )
}
