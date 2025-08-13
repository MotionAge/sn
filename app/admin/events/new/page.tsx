"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { ArrowLeft, Save, AlertCircle, Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface EventFormData {
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  category: string
  is_paid: boolean
  price?: number
  max_participants?: number
  is_active: boolean
  image_url?: string
}

export default function NewEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    category: "General",
    is_paid: false,
    price: 0,
    max_participants: 100,
    is_active: true,
    image_url: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [K in keyof EventFormData]?: string }>({})

  const handleInputChange = (field: keyof EventFormData, value: string | boolean | number) => {
    // Type-safe value assignment
    if (field === 'price' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
    } else if (field === 'max_participants' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [K in keyof EventFormData]?: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.event_date) {
      newErrors.event_date = "Event date is required"
    }
    if (!formData.start_time) {
      newErrors.start_time = "Start time is required"
    }
    if (!formData.end_time) {
      newErrors.end_time = "End time is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    if (formData.is_paid && (!formData.price || formData.price <= 0)) {
      newErrors.price = "Price is required for paid events"
    }
    if (formData.max_participants && formData.max_participants <= 0) {
      newErrors.max_participants = "Max participants must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const eventData = {
        ...formData,
        price: formData.is_paid ? Number(formData.price) || 0 : null,
        max_participants: Number(formData.max_participants) || null
      }

      const result = await apiClient.createEvent(eventData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Event created successfully!")
        router.push("/admin/events")
      }
    } catch (error) {
      toast.error("Failed to create event")
      console.error("Event creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (files: any[]) => {
    if (files.length > 0) {
      const file = files[0]
      setFormData(prev => ({ ...prev, image_url: file.url }))
      toast.success("Image uploaded successfully!")
    }
  }

  const handleImageUploadError = (error: string) => {
    toast.error(`Image upload failed: ${error}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Plan and schedule a new event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Basic information about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter event title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your event..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date *</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => handleInputChange("event_date", e.target.value)}
                      className={errors.event_date ? "border-red-500" : ""}
                    />
                    {errors.event_date && (
                      <p className="text-sm text-red-500">{errors.event_date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange("start_time", e.target.value)}
                      className={errors.start_time ? "border-red-500" : ""}
                    />
                    {errors.start_time && (
                      <p className="text-sm text-red-500">{errors.start_time}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time *</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange("end_time", e.target.value)}
                      className={errors.end_time ? "border-red-500" : ""}
                    />
                    {errors.end_time && (
                      <p className="text-sm text-red-500">{errors.end_time}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Event location or venue"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure event options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_paid"
                    checked={formData.is_paid}
                    onCheckedChange={(checked) => handleInputChange("is_paid", checked)}
                  />
                  <Label htmlFor="is_paid">Paid Event</Label>
                </div>

                {formData.is_paid && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (NPR)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    min="1"
                    value={formData.max_participants || ""}
                    onChange={(e) => handleInputChange("max_participants", parseInt(e.target.value) || 0)}
                    placeholder="100"
                    className={errors.max_participants ? "border-red-500" : ""}
                  />
                  {errors.max_participants && (
                    <p className="text-sm text-red-500">{errors.max_participants}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active Event</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Image</CardTitle>
                <CardDescription>Upload a cover image for your event</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  bucket="event-images"
                  path="event-covers"
                  multiple={false}
                  maxFiles={1}
                  acceptedTypes={["image/*"]}
                  maxSize={5 * 1024 * 1024} // 5MB
                  onUploadComplete={handleImageUpload}
                  onUploadError={handleImageUploadError}
                  usageType="primary"
                  entityType="event"
                  entityId="new"
                />
                {formData.image_url && (
                  <div className="mt-4">
                    <Label>Current Image:</Label>
                    <div className="mt-2 p-2 bg-gray-50 rounded border">
                      <img
                        src={formData.image_url}
                        alt="Event cover"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  )
}
