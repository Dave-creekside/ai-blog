import type React from "react"
import { requireAuth } from "@/lib/auth"
import { signOut } from "./auth-actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, LogOut, Database } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip auth check for login page
  const isLoginPage = children.props?.childProp?.segment === "login"

  if (!isLoginPage) {
    // This will redirect to login if not authenticated
    await requireAuth()
  } else {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="mb-8">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            Clockwork<span className="text-purple-500">.earth</span>
          </Link>
          <div className="text-sm text-gray-400 mt-1">Admin Dashboard</div>
        </div>

        <nav className="space-y-2 flex-1">
          <Link href="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/articles"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Articles</span>
          </Link>
          <Link
            href="/admin/migrations"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors"
          >
            <Database className="h-4 w-4" />
            <span>Migrations</span>
          </Link>
        </nav>

        <form action={signOut}>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
