"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { runProjectMigration } from "@/app/actions/migration-actions"
import Link from "next/link"
import { ArrowLeft, Database } from "lucide-react"

export default function MigrationsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleRunMigration = async () => {
    setIsLoading(true)
    try {
      const migrationResult = await runProjectMigration()
      setResult(migrationResult)
    } catch (error) {
      setResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">Database Migrations</h1>

      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle>Project Fields Migration</CardTitle>
          <CardDescription>
            Add the necessary fields to support the Projects feature: is_project, repository_url, and html_data_url
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">This migration will add the following columns to the articles table:</p>
          <ul className="list-disc list-inside text-gray-400 mb-4">
            <li>is_project (boolean): Flag to identify if an article is a project</li>
            <li>repository_url (text): URL to the project's repository</li>
            <li>html_data_url (text): URL to the HTML research data file</li>
          </ul>
          <p className="text-gray-400">It will also update the article_view to include these new columns.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRunMigration} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            <Database className="h-4 w-4 mr-2" />
            {isLoading ? "Running Migration..." : "Run Migration"}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Alert
          variant={result.success ? "default" : "destructive"}
          className={
            result.success
              ? "bg-green-900/20 border-green-900 text-green-300"
              : "bg-red-900/20 border-red-900 text-red-300"
          }
        >
          <AlertDescription>{result.success ? result.message : `Error: ${result.error}`}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
