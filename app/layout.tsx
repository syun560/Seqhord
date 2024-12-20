import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles.css'

export const metadata: Metadata = {
    title: 'Seqhord -シーコード',
    description: 'Seqhord is simple sound programming sequencer',
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
