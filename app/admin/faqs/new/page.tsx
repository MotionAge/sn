"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface FaqFormData {
  question: string
  answer: string
  category: string
  order: number
}

export default function NewFaqPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FaqFormData>({
    question: "",
    answer: "",
    category: "General",
    order: 1
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FaqFormData>>({})

  const handleInputChange = (field: keyof FaqFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FaqFormData> = {}

    if (!formData.question.trim()) {
      newErrors.question = "Question is required"
    }
    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required"
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }
    if (formData.order <= 0) {
      newErrors.order = "Order must be greater than 0"
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
      const result = await apiClient.createFaq(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("FAQ created successfully!")
        router.push("/admin/faqs")
      }
    } catch (error) {
      toast.error("Failed to create FAQ")
      console.error("FAQ creation error:", error)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold">Create New FAQ</h1>
          <p className="text-muted-foreground">Add a new frequently asked question</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>FAQ Details</CardTitle>
            <CardDescription>Fill in the question and answer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                placeholder="Enter the frequently asked question"
                className={errors.question ? "border-red-500" : ""}
              />
              {errors.question && (
                <p className="text-sm text-red-500">{errors.question}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => handleInputChange("answer", e.target.value)}
                placeholder="Provide a clear and helpful answer"
                rows={6}
                className={errors.answer ? "border-red-500" : ""}
              />
              {errors.answer && (
                <p className="text-sm text-red-500">{errors.answer}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="Membership">Membership</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Donations">Donations</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
                  placeholder="1"
                  className={errors.order ? "border-red-500" : ""}
                />
                {errors.order && (
                  <p className="text-sm text-red-500">{errors.order}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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
            {loading ? "Creating..." : "Create FAQ"}
          </Button>
        </div>
      </form>
    </div>
  )
}
