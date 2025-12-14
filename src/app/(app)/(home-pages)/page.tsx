import {
  AboutNerd,
  ComboSection,
  ContactNerd,
  FooterNerd,
  HeaderNerd,
  HeroNerd,
  LocationsNerd,
} from '@/components/landing'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nerd Society | Không gian học tập dành cho Gen Z',
  description:
    'Nerd Society: Cộng đồng học tập Gen Z năng động tại Hà Nội. Không gian làm việc chung, học nhóm lý tưởng, tổ chức sự kiện, workshop chuyên sâu. Kết nối, phát triển bản thân và chinh phục kiến thức cùng Nerd Society!',
  keywords: ['Nerd Society', 'cafe học tập', 'co-working space', 'Hà Nội', 'Gen Z', 'không gian làm việc'],
}

export default function Page() {
  return (
    <>
      <HeaderNerd />
      <main className="pt-20">
        <HeroNerd />
        <AboutNerd />
        <ComboSection />
        <LocationsNerd />
        <ContactNerd />
      </main>
      <FooterNerd />
    </>
  )
}
