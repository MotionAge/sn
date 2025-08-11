"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Calendar, MapPin, Clock, DollarSign } from "lucide-react"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  dietaryRestrictions: z.string().optional(),
  medicalConditions: z.string().optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  motivation: z.string().min(10, "Please share your motivation (at least 10 characters)"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  paymentMethod: z.enum(["esewa", "khalti", "stripe"]).optional(),
})

export default function EventRegistrationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  // Mock event data - in production, this would be fetched based on eventId
  const getEventDetails = (id: string) => {
    const events: Record<string, any> = {
      "gurukul-short-term": {
        title: "Gurukul Short Term Course (3 months)",
        description: "Intensive course covering basic Sanskrit, Vedic mathematics, and moral values.",
        date: "2024-08-15",
        time: "9:00 AM - 12:00 PM",
        location: "SDB Gurukul Campus, Kathmandu",
        price: 15000,
        currency: "NPR",
        isPaid: true,
      },
      "sanskrit-beginner": {
        title: "Beginner Sanskrit Online Course",
        description: "Learn basic Sanskrit alphabets, pronunciation, and simple verses.",
        date: "2024-07-20",
        time: "6:00 PM - 8:00 PM",
        location: "Online (Zoom)",
        price: 0,
        currency: "NPR",
        isPaid: false,
      },
      "vedic-mathematics": {
        title: "Vedic Mathematics Workshop",
        description: "Learn ancient calculation techniques for modern applications.",
        date: "2024-07-25",
        time: "2:00 PM - 5:00 PM",
        location: "Online (Google Meet)",
        price: 0,
        currency: "NPR",
        isPaid: false,
      },
    }

    return events[id] || events["sanskrit-beginner"]
  }

  const eventDetails = getEventDetails(eventId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      emergencyContact: "",
      emergencyContactName: "",
      dietaryRestrictions: "",
      medicalConditions: "",
      experience: "beginner",
      motivation: "",
      agreeTerms: false,
      paymentMethod: eventDetails.isPaid ? "esewa" : undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")

    try {
      // In a real application, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful registration
      setIsSuccess(true)

      // In production, this would:
      // 1. Register the participant
      // 2. Process payment if required
      // 3. Send confirmation email
      // 4. Generate certificate if applicable
    } catch (err) {
      setError("An error occurred while registering. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isSuccess) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Registration Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <p className="mb-4">
              Thank you for registering for <strong>{eventDetails.title}</strong>!
            </p>
            <p className="mb-4">You will receive a confirmation email with event details and further instructions.</p>
            {eventDetails.isPaid && (
              <p className="mb-4 text-sm text-gray-600">Payment confirmation and receipt will be sent separately.</p>
            )}
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <a href="/events">View More Events</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      {/* Event Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-600">{eventDetails.title}</CardTitle>
          <CardDescription>{eventDetails.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              <span>{formatDate(eventDetails.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-600" />
              <span>{eventDetails.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-orange-600" />
              <span>{eventDetails.location}</span>
            </div>
            {eventDetails.isPaid && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-orange-600" />
                <span>
                  {eventDetails.currency} {eventDetails.price.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Event Registration</CardTitle>
          <CardDescription>Please fill out all required information to register for this event.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-600">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
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

                  <FormField
                    control={form.control}
                    name="phone"
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
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-600">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter emergency contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter emergency contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-600">Additional Information</h3>

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="beginner" />
                            </FormControl>
                            <FormLabel className="font-normal">Beginner</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="intermediate" />
                            </FormControl>
                            <FormLabel className="font-normal">Intermediate</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="advanced" />
                            </FormControl>
                            <FormLabel className="font-normal">Advanced</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join this event?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please share your motivation for joining this event"
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
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Any dietary restrictions or allergies" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Any medical conditions we should be aware of" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Method (if paid event) */}
              {eventDetails.isPaid && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-600">Payment Information</h3>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="esewa" />
                              </FormControl>
                              <FormLabel className="font-normal">eSewa</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="khalti" />
                              </FormControl>
                              <FormLabel className="font-normal">Khalti</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="stripe" />
                              </FormControl>
                              <FormLabel className="font-normal">Credit/Debit Card (Stripe)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the terms and conditions</FormLabel>
                      <FormDescription>
                        By checking this box, you agree to abide by the event rules and SDB Nepal's policies.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? "Registering..." : eventDetails.isPaid ? "Register & Pay" : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
