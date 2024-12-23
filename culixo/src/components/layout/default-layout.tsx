"use client"

import { Navbar } from "./navbar"

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        {children}
      </div>
    </>
  )
}