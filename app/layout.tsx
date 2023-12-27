import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'

export const metadata: Metadata = {
    title: 'mugic',
    description: '簡易音楽記述言語です。',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja" data-bs-theme="dark">
            <body>
                <nav className="navbar navbar-dark bg-secondary shadow">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">簡易音楽記述言語 - SMML</a>
                        <span className="navbar-text">Ver 1.0</span>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    )
}
