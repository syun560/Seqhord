import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'globals.css'

export const metadata: Metadata = {
    title: 'SMML Editor Demo',
    description: 'SMML is a simple music markup language',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja" data-bs-theme="dark" suppressHydrationWarning={true}>
            <body>
                {/* <nav className="navbar navbar-dark bg-secondary shadow"> */}
                    <div className="container-fluid">
                        {/* <a className="navbar-brand" href="#">SMML Editor Demo</a>
                        <span className="navbar-text">Ver 0.1</span> */}
                    </div>
                {/* </nav> */}
                {children}
            </body>
        </html>
    )
}
