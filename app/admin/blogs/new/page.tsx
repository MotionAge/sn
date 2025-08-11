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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, Upload, X, Plus } from "lucide-react"

export default function NewBlogPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    titleNepali: "",
    excerpt: "",
    excerptNepali: "",
    content: "",
    contentNepali: "",
    category: "",
    status: "draft",
    featured: false,
    publishDate: "",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
    gallery: [] as string[],
  })

  const categories = [
    { value: "press-release", label: "Press Release" },
    { value: "past-events", label: "Past Events" },
    { value: "gallery", label: "Gallery" },
    { value: "voting-polls", label: "Voting/Polls" },
    { value: "promotions", label: "Promotions" },
    { value: "announcements", label: "Announcements" },
    { value: "news", label: "News" },
  ]

  const handleSubmit = async (action: "save" | "publish") => {
    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        status: action === "publish" ? "published" : "draft",
        tags,
        publishDate: action === "publish" ? new Date().toISOString() : formData.publishDate,
      }

      // API call would go here
      console.log("Submitting blog post:", submitData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      router.push("/admin/blogs")
    } catch (error) {
      console.error("Error saving blog post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">Write and publish new content</p>
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
            <Eye className="h-4 w-4 mr-2" />
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="english">English Content</TabsTrigger>
              <TabsTrigger value="nepali">नेपाली Content</TabsTrigger>
            </TabsList>

            <TabsContent value="english" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>English Content</CardTitle>
                  <CardDescription>Write your blog post content in English</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter blog post title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the blog post..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your full blog post content here..."
                      rows={15}
                      className="min-h-[400px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nepali" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>नेपाली Content</CardTitle>
                  <CardDescription>नेपालीमा आफ्नो ब्लग पोस्ट लेख्नुहोस्</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleNepali">शीर्षक</Label>
                    <Input
                      id="titleNepali"
                      value={formData.titleNepali}
                      onChange={(e) => setFormData({ ...formData, titleNepali: e.target.value })}
                      placeholder="ब्लग पोस्टको शीर्षक लेख्नुहोस्..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerptNepali">सारांश</Label>
                    <Textarea
                      id="excerptNepali"
                      value={formData.excerptNepali}
                      onChange={(e) => setFormData({ ...formData, excerptNepali: e.target.value })}
                      placeholder="ब्लग पोस्टको छोटो विवरण..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentNepali">सामग्री</Label>
                    <Textarea
                      id="contentNepali"
                      value={formData.contentNepali}
                      onChange={(e) => setFormData({ ...formData, contentNepali: e.target.value })}
                      placeholder="यहाँ आफ्नो पूर्ण ब्लग पोस्ट सामग्री लेख्नुहोस्..."
                      rows={15}
                      className="min-h-[400px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Post</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {formData.featuredImage && (
                  <div className="relative">
                    <img
                      src={formData.featuredImage || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, featuredImage: "" })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
