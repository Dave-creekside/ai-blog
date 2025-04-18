import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // If the request is for a PDF file
  if (pathname.endsWith(".pdf")) {
    // Clone the request URL
    const url = request.nextUrl.clone()

    // Add headers for PDF viewing
    const response = NextResponse.next()
    response.headers.set("Content-Type", "application/pdf")
    response.headers.set("Content-Disposition", "inline")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  // Handle PDF proxy requests
  if (pathname === "/api/pdf-proxy") {
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths ending with .pdf
    "/(.*\\.pdf)",
    // Match the PDF proxy API route
    "/api/pdf-proxy",
  ],
}
