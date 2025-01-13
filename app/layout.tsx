import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles.css'

export const metadata: Metadata = {
    title: 'Seqhord',
    description: 'Seqhordはブラウザで動く音楽プログラミング環境です',
    twitter: {
        card: 'summary_large_image',
        title: 'Seqhord',
        description: 'Seqhordはブラウザで動く音楽プログラミング環境です',
        siteId: '1467726470533754880',
        creator: '@nextjs',
        creatorId: '1467726470533754880',
        images: ['https://nextjs.org/og.png'], // Must be an absolute URL
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body suppressHydrationWarning={true}>
                {children}
            </body>
        </html>
    )
}
