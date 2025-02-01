import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles.css'

export const metadata: Metadata = {
    metadataBase: new URL("https://seqhord.com"),
    title: 'Seqhord',
    description: 'Seqhord（シーコード）はブラウザで動く音楽プログラミング環境です',
    icons: {
        icon: "/images/icon.png",
    },
    openGraph: {
        type: "website",
        title: 'Seqhord',
        description: 'Seqhord（シーコード）はブラウザで動く音楽プログラミング環境です',
        siteName: "Seqhord",
        url: "https://seqhord.com",
        images: {
            url: "https://seqhord.com/images/icon.png",
            type: "image/png"
        }
    },
    twitter: {
        card: 'summary',
        title: 'Seqhord',
        description: 'Seqhord（シーコード）はブラウザで動く音楽プログラミング環境です',
        creator: '@keymon561',
        images: ['https://seqhord.com/images/icon.png'], // Must be an absolute URL
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
