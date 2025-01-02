import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles.css'

export const metadata: Metadata = {
    title: 'Seqhord -シーコード',
    description: 'Seqhordはブラウザで動く音楽プログラミング環境です',
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
