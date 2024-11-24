import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles.css'

export const metadata: Metadata = {
    title: 'SMML Editor Demo',
    description: 'SMML is a simple music markup language',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" data-bs-theme="dark">
            <body suppressHydrationWarning={true}>
                {children}
            </body>
        </html>
    )
}
