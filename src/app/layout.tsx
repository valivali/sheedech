import "./globals.scss"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import React from "react"

import { AuthProvider } from "@/providers/AuthProvider"
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import { UserProvider } from "@/providers/UserProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Sheedech - Bringing Our Community Together",
  description:
    "Join our community platform where neighbors connect over shared meals and meaningful moments. Host dinners, join celebrations, and strengthen bonds."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body suppressHydrationWarning={true}>
          <ReactQueryProvider>
            <UserProvider>{children}</UserProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
