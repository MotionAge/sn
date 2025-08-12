"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<{
    blogs?: { success: boolean; data?: any; error?: string }
    events?: { success: boolean; data?: any; error?: string }
    members?: { success: boolean; data?: any; error?: string }
    donations?: { success: boolean; data?: any; error?: string }
    gallery?: { success: boolean; data?: any; error?: string }
    library?: { success: boolean; data?: any; error?: string }
    projects?: { success: boolean; data?: any; error?: string }
    faqs?: { success: boolean; data?: any; error?: string }
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async (endpoint: string) => {
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'x-admin-key': 'admin-key-123'
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || 'Unknown error' }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Network error' }
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults({})

    const results = {
      blogs: await testApi('/blogs'),
      events: await testApi('/events'),
      members: await testApi('/membership'),
      donations: await testApi('/donations'),
      gallery: await testApi('/gallery'),
      library: await testApi('/library'),
      projects: await testApi('/projects'),
      faqs: await testApi('/faqs'),
    }

    setTestResults(results)
    setIsLoading(false)
  }

  const getStatusIcon = (success?: boolean) => {
    if (success === undefined) return null
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Connection Test</h1>
        <p className="text-muted-foreground">Test the connection to all API endpoints</p>
      </div>

      <Button onClick={runAllTests} disabled={isLoading}>
        {isLoading ? "Testing..." : "Run All Tests"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.blogs?.success)}
              Blogs API
            </CardTitle>
            <CardDescription>Test /api/blogs endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.blogs ? (
              testResults.blogs.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.blogs.data?.length || 0} blogs
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.blogs.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.events?.success)}
              Events API
            </CardTitle>
            <CardDescription>Test /api/events endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.events ? (
              testResults.events.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.events.data?.length || 0} events
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.events.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.members?.success)}
              Members API
            </CardTitle>
            <CardDescription>Test /api/membership endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.members ? (
              testResults.members.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.members.data?.length || 0} members
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.members.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.donations?.success)}
              Donations API
            </CardTitle>
            <CardDescription>Test /api/donations endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.donations ? (
              testResults.donations.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.donations.data?.length || 0} donations
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.donations.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.gallery?.success)}
              Gallery API
            </CardTitle>
            <CardDescription>Test /api/gallery endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.gallery ? (
              testResults.gallery.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.gallery.data?.length || 0} gallery items
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.gallery.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.library?.success)}
              Library API
            </CardTitle>
            <CardDescription>Test /api/library endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.library ? (
              testResults.library.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.library.data?.length || 0} library items
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.library.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.projects?.success)}
              Projects API
            </CardTitle>
            <CardDescription>Test /api/projects endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.projects ? (
              testResults.projects.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.projects.data?.length || 0} projects
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.projects.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResults.faqs?.success)}
              FAQs API
            </CardTitle>
            <CardDescription>Test /api/faqs endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.faqs ? (
              testResults.faqs.success ? (
                <div className="text-sm text-green-600">
                  ✅ Success! Found {testResults.faqs.data?.length || 0} FAQs
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.faqs.error}</AlertDescription>
                </Alert>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Not tested yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(testResults).map(([endpoint, result]) => (
                <div key={endpoint} className="flex items-center justify-between">
                  <span className="capitalize">{endpoint}</span>
                  <span className={result?.success ? "text-green-600" : "text-red-600"}>
                    {result?.success ? "✅ Connected" : "❌ Failed"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
