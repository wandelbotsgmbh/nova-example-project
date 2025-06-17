import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"
import { getExposedRuntimeEnv } from "../../runtimeEnv"

export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout env={getExposedRuntimeEnv()}>{children}</ClientLayout>
      </body>
    </html>
  )
}
