"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import Link from "next/link"

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().optional(),
  order: z.string().optional(),
})

export default function NewFaqPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      order: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError("")

    try {
      const faqData = {
        question: values.question,
        answer: values.answer,
        category: values.category || undefined,
        order: values.order ? parseInt(values.order) : undefined,
      }

      const result = await apiClient.post('/faqs', faqData)
      if (result.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        toast.success("FAQ created successfully!")
        router.push("/admin/faqs")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create FAQ"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/faqs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to FAQs
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New FAQ</h1>
          <p className="text-muted-foreground">Add a new frequently asked question and answer</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Details</CardTitle>
          <CardDescription>Fill in the details for your new FAQ</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the question" {...field} />
                    </FormControl>
                    <FormDescription>
                      The question that users frequently ask
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the answer..."
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear and comprehensive answer to the question
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="membership">Membership</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="donations">Donations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a category to organize the FAQ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The order in which this FAQ should appear (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create FAQ"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/faqs")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
