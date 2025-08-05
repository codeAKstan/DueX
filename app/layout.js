import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DueX - Modern Departmental Dues Management",
  description:
    "Transform your university's manual dues collection process with DueX. Eliminate spreadsheets, reduce errors by 90%, and provide transparency for students and department officials.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
