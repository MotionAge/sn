"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

const formSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  registrationDate: z.string().min(1, "Registration date is required"),
})

export default function CheckMembership() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    status: "active" | "expired" | "not-found"
    message: string
    startDate?: string
    endDate?: string
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: "",
      registrationDate: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    try {
      // In a real application, this would call an API endpoint
      // For demo purposes, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response based on input
      // In production, this would check against the database
      if (values.serialNumber === "12345") {
        setResult({
          status: "active",
          message: "✅ Congratulations, you are a member from Jan 15, 2024 to Jan 14, 2025",
          startDate: "Jan 15, 2024",
          endDate: "Jan 14, 2025",
        })
      } else if (values.serialNumber === "54321") {
        setResult({
          status: "expired",
          message: "Your membership has expired on Dec 31, 2023",
          startDate: "Jan 1, 2023",
          endDate: "Dec 31, 2023",
        })
      } else {
        setResult({
          status: "not-found",
          message: "No membership found with the provided details",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Check Membership Status</CardTitle>
          <CardDescription>
            Enter your serial number and registration date to check your membership status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? "Checking..." : "Check Status"}
              </Button>
            </form>
          </Form>

          {result && (
            <div className="mt-6">
              {result.status === "active" && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{result.message}</AlertDescription>
                </Alert>
              )}

              {result.status === "expired" && (
                <Alert className="bg-amber-50 border-amber-200">
                  <XCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">{result.message}</AlertDescription>
                </Alert>
              )}

              {result.status === "not-found" && (
                <Alert className="bg-red-50 border-red-200">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{result.message}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
