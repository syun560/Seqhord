import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Seqhord Docs -シーコード',
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
