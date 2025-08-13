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
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  published: boolean
  image_url?: string
}

export default function NewBlogPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "General",
    published: false,
    image_url: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<BlogFormData>>({})

  const handleInputChange = (field: keyof BlogFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author is required"
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required"
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
      const result = await apiClient.createBlog(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Blog post created successfully!")
        router.push("/admin/blogs")
      }
    } catch (error) {
      toast.error("Failed to create blog post")
      console.error("Blog creation error:", error)
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
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">Write and publish a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Write your blog post content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog post title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Brief summary of the blog post"
                    rows={3}
                    className={errors.excerpt ? "border-red-500" : ""}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-500">{errors.excerpt}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your blog post content here..."
                    rows={15}
                    className={errors.content ? "border-red-500" : ""}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">{errors.content}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>Configure blog post settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Author name"
                    className={errors.author ? "border-red-500" : ""}
                  />
                  {errors.author && (
                    <p className="text-sm text-red-500">{errors.author}</p>
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
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Projects">Projects</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange("published", checked)}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Upload a cover image for your blog post</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  bucket="blog-images"
                  path="blog-covers"
                  multiple={false}
                  maxFiles={1}
                  acceptedTypes={["image/*"]}
                  maxSize={5 * 1024 * 1024} // 5MB
                  onUploadComplete={handleImageUpload}
                  onUploadError={handleImageUploadError}
                  usageType="primary"
                  entityType="blog"
                  entityId="new"
                />
                {formData.image_url && (
                  <div className="mt-4">
                    <Label>Current Image:</Label>
                    <div className="mt-2 p-2 bg-gray-50 rounded border">
                      <img
                        src={formData.image_url}
                        alt="Blog cover"
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
            {loading ? "Creating..." : "Create Blog Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}
