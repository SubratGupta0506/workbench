// src/app/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { Shield, Users, Key, ArrowRight, User } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Ambient background decorative glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none dark:bg-emerald-500/3" />

      {/* Top Navbar */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight select-none">
              Workbench
            </span>
          </div>
          <Link
            href="/roles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity"
          >
            Go to Admin Panel
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-20 flex flex-col justify-center gap-16 relative z-10">
        <div className="space-y-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            {/* Developer Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider mx-auto md:mx-0 select-none">
              <User size={12} />
              Developed by Subrat
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.05] max-w-lg">
              Next-Gen <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">RBAC</span> Admin Control
            </h1>

            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-lg">
              A highly secure, full-stack design prototype to easily manage custom roles, configure granular permission matrices, and audit user permissions instantly.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/roles"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 hover:shadow-indigo-600/15 active:scale-[0.98] transition-all"
              >
                Launch Dashboard
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/users"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-semibold text-foreground hover:bg-muted active:scale-[0.98] transition-all"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Interactive visual preview mockup */}
          <div className="w-full md:w-[380px] bg-card border border-border rounded-2xl p-5 shadow-xl shadow-indigo-500/5 relative overflow-hidden select-none">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Workbench Preview
              </span>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="bg-background/80 border border-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                    PM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Project Manager</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">8 permissions</div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="bg-background/85 border border-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    AD
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Billing Admin</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">2 permissions</div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Role Builder */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 hover:shadow-lg hover:border-border/80 transition-all duration-300 group">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/10 group-hover:scale-105 transition-transform">
              <Shield size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">Custom Role Builder</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Create new roles and map granular actions (create, edit, delete) across 5 standard resources in a permissions matrix.
              </p>
            </div>
          </div>

          {/* Card 2: Multi-Role Assignment */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 hover:shadow-lg hover:border-border/80 transition-all duration-300 group">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/10 group-hover:scale-105 transition-transform">
              <Users size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">Multiple Role Assignments</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Assign and unassign multiple concurrent roles to users, with live badge updates and an intuitive select workflow.
              </p>
            </div>
          </div>

          {/* Card 3: Union Merging */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 hover:shadow-lg hover:border-border/80 transition-all duration-300 group">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/10 group-hover:scale-105 transition-transform">
              <Key size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">Union Permission Merging</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Automatically resolves overlapping rights by taking the union of assigned permissions, indicating which role granted each rule.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
          <span>&copy; 2026 Workbench. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span>Assignment Project by</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Subrat</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
