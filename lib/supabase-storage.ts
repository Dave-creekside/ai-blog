import { supabaseAdmin } from "./supabase-server"
import { v4 as uuidv4 } from "uuid"

const BUCKET_NAME = "pdf-articles"

// Initialize storage bucket if it doesn't exist
export async function initializeStorage() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()

  if (!buckets?.find((bucket) => bucket.name === BUCKET_NAME)) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: true, // Make files publicly accessible
      fileSizeLimit: 10485760, // 10MB limit
      allowedMimeTypes: ["application/pdf"],
    })

    if (error) {
      console.error("Error creating storage bucket:", error)
    }
  }
}

// Upload PDF file to Supabase storage
export async function uploadPDF(file: File): Promise<{ path: string; url: string } | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET_NAME).upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return null
    }

    const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return {
      path: filePath,
      url: data.publicUrl,
    }
  } catch (error) {
    console.error("Error in uploadPDF:", error)
    return null
  }
}

// Delete PDF file from Supabase storage
export async function deletePDF(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deletePDF:", error)
    return false
  }
}

// Extract file path from public URL
export function getFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    return pathParts[pathParts.length - 1]
  } catch (error) {
    console.error("Error extracting file path from URL:", error)
    return null
  }
}
