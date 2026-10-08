import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'TAPSHOPBAR | Marketing Intelligence',description:'매출에서 의사결정까지. 탭샵바 합성 데이터 기반 인터랙티브 경영 대시보드.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
