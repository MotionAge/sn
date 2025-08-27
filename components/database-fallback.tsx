import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DatabaseFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Connection Unavailable</AlertTitle>
        <AlertDescription>
          The database connection is not configured. Please set up your Supabase environment variables to enable full
          functionality.
        </AlertDescription>
      </Alert>
    </div>
  )
}
