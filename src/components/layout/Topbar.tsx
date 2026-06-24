// src/components/layout/Topbar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Bell, HelpCircle, Sun, Moon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "@/src/components/ThemeContext"

export default function Topbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Roles", href: "/roles" },
    { label: "Users", href: "/users" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-8 h-16 flex items-center justify-between shadow-xs">
      {/* Left logo + Navigation links */}
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/10">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight select-none">
            Workbench
          </span>
        </Link>

        {/* Top Navbar items */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isHome = item.href === "/"
            const isActive = isHome 
              ? pathname === "/" 
              : item.href !== "#" && pathname.startsWith(item.href)

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs font-semibold tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? "text-foreground after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-indigo-500 after:rounded-full"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right control panel items */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-accent cursor-pointer"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="h-5 w-px bg-border" />

        {/* User Card */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
          <Avatar className="h-8 w-8 border border-border bg-indigo-750">
            <AvatarFallback className="bg-indigo-650 text-white font-bold text-xs select-none">
              SB
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col select-none">
            <span className="text-xs font-bold text-foreground leading-tight">Subrat</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Product Designer</span>
          </div>
        </div>
      </div>
    </header>
  )
}
