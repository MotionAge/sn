"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, BookOpen, School, Home, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"

const formSchema = z.object({
  donorName: z.string().min(2, "Name must be at least 2 characters"),
  donorEmail: z.string().email("Invalid email address"),
  donorPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  projectId: z.string().optional(),
  donationType: z.enum(["general", "gurukul", "library", "orphanage", "oldage"]),
  message: z.string().optional(),
  paymentMethod: z.enum(["esewa", "khalti", "stripe"]),
})

export default function DonatePage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const projectParam = searchParams.get("project")

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Map URL parameter to donation type
  const getDonationType = () => {
    switch (categoryParam) {
      case "general-fund":
        return "general"
      case "gurukul":
        return "gurukul"
      case "library":
        return "library"
      case "orphanage":
        return "orphanage"
      case "oldage-homes":
        return "oldage"
      default:
        return "general"
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: "",
      donorEmail: "",
      donorPhone: "",
      amount: "",
      projectId: projectParam || "",
      donationType: getDonationType(),
      message: "",
      paymentMethod: "esewa",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // In a real application, this would call an API endpoint
      // For demo purposes, we'll simulate a successful donation after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful donation
      setIsSuccess(true)

      // In production, this would:
      // 1. Process the payment through the selected gateway
      // 2. Record the donation in the database
      // 3. Generate a receipt
      // 4. Send an email with the receipt
    } finally {
      setIsLoading(false)
    }
  }

  const donationTypes = [
    { value: "general", label: "General Fund", icon: Heart, description: "Support all our initiatives" },
    { value: "gurukul", label: "Gurukul", icon: School, description: "Support traditional education" },
    { value: "library", label: "Library", icon: BookOpen, description: "Help expand our resources" },
    { value: "orphanage", label: "Orphanage", icon: Home, description: "Support children in need" },
    { value: "oldage", label: "Oldage Homes", icon: Users, description: "Support elderly care" },
  ]

  if (isSuccess) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Thank You for Your Donation!</CardTitle>
            <CardDescription className="text-center">
              Your generous contribution will help us continue our mission.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-orange-600" />
            </div>
            <p className="mb-4">
              A receipt has been sent to your email address. Thank you for supporting Sanatan Dharma Bigyan Samaj.
            </p>
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <a href="/">Return to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Make a Donation</CardTitle>
          <CardDescription>Your generous donations help us preserve and promote Sanatan Dharma values.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="donorPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount (NPR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {donationTypes.map((type) => (
                          <FormItem key={type.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={type.value} />
                            </FormControl>
                            <div className="flex items-center">
                              <type.icon className="h-4 w-4 mr-2 text-orange-600" />
                              <FormLabel className="font-normal">{type.label}</FormLabel>
                            </div>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any message you'd like to include with your donation"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormDescription>Select your preferred payment method</FormDescription>
                    <FormControl>
                      <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="esewa">eSewa</TabsTrigger>
                          <TabsTrigger value="khalti">Khalti</TabsTrigger>
                          <TabsTrigger value="stripe">Stripe</TabsTrigger>
                        </TabsList>
                        <TabsContent value="esewa" className="p-4 border rounded-md mt-2">
                          <p className="text-sm">Pay using eSewa digital wallet</p>
                        </TabsContent>
                        <TabsContent value="khalti" className="p-4 border rounded-md mt-2">
                          <p className="text-sm">Pay using Khalti digital wallet</p>
                        </TabsContent>
                        <TabsContent value="stripe" className="p-4 border rounded-md mt-2">
                          <p className="text-sm">Pay using credit/debit card via Stripe</p>
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? "Processing..." : "Donate Now"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
