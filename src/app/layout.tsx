import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Looki Looki',
    description: 'Eye gazing practice online',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-theme="dark">
            <body>{children}</body>
        </html>
    )
}
