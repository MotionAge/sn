"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Calendar, Users } from "lucide-react"

export default function NewEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    titleNepali: "",
    description: "",
    descriptionNepali: "",
    category: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    venueNepali: "",
    address: "",
    addressNepali: "",
    capacity: "",
    registrationFee: "",
    currency: "NPR",
    registrationRequired: true,
    registrationDeadline: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    featuredImage: "",
    status: "draft",
    featured: false,
  })

  const categories = [
    { value: "gurukul-admission", label: "Gurukul Admission" },
    { value: "pilgrimage", label: "Pilgrimage" },
    { value: "sanskrit-workshop", label: "Sanskrit Workshop" },
    { value: "vedic-math", label: "Vedic Mathematics" },
    { value: "cultural-program", label: "Cultural Program" },
    { value: "religious-ceremony", label: "Religious Ceremony" },
    { value: "educational-seminar", label: "Educational Seminar" },
    { value: "community-service", label: "Community Service" },
  ]

  const handleSubmit = async (action: "save" | "publish") => {
    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        status: action === "publish" ? "published" : "draft",
        capacity: Number.parseInt(formData.capacity) || 0,
        registrationFee: Number.parseFloat(formData.registrationFee) || 0,
      }

      console.log("Submitting event:", submitData)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/admin/events")
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Plan and organize new events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSubmit("save")} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit("publish")} disabled={isLoading}>
            <Calendar className="h-4 w-4 mr-2" />
            {isLoading ? "Publishing..." : "Publish Event"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="nepali">नेपाली</TabsTrigger>
            </TabsList>

            <TabsContent value="english" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details (English)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter event title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the event..."
                      rows={8}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        placeholder="Event venue..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full address..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nepali" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>कार्यक्रम विवरण (नेपाली)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleNepali">कार्यक्रमको नाम</Label>
                    <Input
                      id="titleNepali"
                      value={formData.titleNepali}
                      onChange={(e) => setFormData({ ...formData, titleNepali: e.target.value })}
                      placeholder="कार्यक्रमको नाम लेख्नुहोस्..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionNepali">विवरण</Label>
                    <Textarea
                      id="descriptionNepali"
                      value={formData.descriptionNepali}
                      onChange={(e) => setFormData({ ...formData, descriptionNepali: e.target.value })}
                      placeholder="कार्यक्रमको विवरण लेख्नुहोस्..."
                      rows={8}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueNepali">स्थान</Label>
                      <Input
                        id="venueNepali"
                        value={formData.venueNepali}
                        onChange={(e) => setFormData({ ...formData, venueNepali: e.target.value })}
                        placeholder="कार्यक्रम स्थल..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressNepali">ठेगाना</Label>
                      <Input
                        id="addressNepali"
                        value={formData.addressNepali}
                        onChange={(e) => setFormData({ ...formData, addressNepali: e.target.value })}
                        placeholder="पूरा ठेगाना..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Event</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="registrationRequired">Registration Required</Label>
                <Switch
                  id="registrationRequired"
                  checked={formData.registrationRequired}
                  onCheckedChange={(checked) => setFormData({ ...formData, registrationRequired: checked })}
                />
              </div>

              {formData.registrationRequired && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="Maximum participants"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                    <Input
                      id="registrationDeadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="registrationFee">Registration Fee</Label>
                      <Input
                        id="registrationFee"
                        type="number"
                        value={formData.registrationFee}
                        onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NPR">NPR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Contact person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+977-XXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
