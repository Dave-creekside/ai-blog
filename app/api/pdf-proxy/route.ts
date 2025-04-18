import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Get the PDF URL from the query parameter
    const url = request.nextUrl.searchParams.get("url")

    if (!url) {
      return new NextResponse("Missing URL parameter", { status: 400 })
    }

    console.log(`Proxying PDF from: ${url}`)

    // Fetch the PDF from the source with appropriate headers
    const response = await fetch(url, {
      headers: {
        Accept: "application/pdf,*/*",
        "User-Agent": "Mozilla/5.0 (compatible; PDFProxyBot/1.0)",
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, {
        status: response.status,
      })
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer()

    if (pdfBuffer.byteLength === 0) {
      console.error("Received empty PDF buffer")
      return new NextResponse("Received empty PDF content", { status: 500 })
    }

    console.log(`Successfully fetched PDF, size: ${pdfBuffer.byteLength} bytes`)

    // Return the PDF with the correct headers for inline viewing
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="document.pdf"',
        "Content-Length": pdfBuffer.byteLength.toString(),
        // Cache the PDF for 1 hour
        "Cache-Control": "public, max-age=3600",
        // Prevent CORS issues
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("PDF proxy error:", error)
    return new NextResponse(`Error fetching PDF: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}
