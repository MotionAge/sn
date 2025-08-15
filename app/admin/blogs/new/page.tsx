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
import { Save, Eye, Plus, X, Loader2, ArrowLeft } from "lucide-react"
//import FileUpload from "@/components/file-upload"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NewBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    titleEnglish: "",
    excerpt: "",
    excerptEnglish: "",
    content: "",
    contentEnglish: "",
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
    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Content, Category)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        status: action === "publish" ? "published" : "draft",
        tags,
        publishDate: action === "publish" ? new Date().toISOString() : formData.publishDate,
      }

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save blog post")
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: `Blog post ${action === "publish" ? "published" : "saved"} successfully`,
      })

      router.push("/admin/blogs")
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
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

  const addToGallery = (url: string) => {
    setFormData({
      ...formData,
      gallery: [...formData.gallery, url],
    })
  }

  const removeFromGallery = (index: number) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index)
    setFormData({ ...formData, gallery: newGallery })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">Write and publish new content</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => handleSubmit("save")} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit("publish")} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
          Publish
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="nepali" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nepali">नेपाली Content</TabsTrigger>
              <TabsTrigger value="english">English Content</TabsTrigger>
            </TabsList>

            <TabsContent value="nepali" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>नेपाली Content</CardTitle>
                  <CardDescription>नेपालीमा आफ्नो ब्लग पोस्ट लेख्नुहोस्</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">शीर्षक *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="ब्लग पोस्टको शीर्षक लेख्नुहोस्..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">सारांश</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="ब्लग पोस्टको छोटो विवरण..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">सामग्री *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="यहाँ आफ्नो पूर्ण ब्लग पोस्ट सामग्री लेख्नुहोस्..."
                      rows={15}
                      className="min-h-[400px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="english" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>English Content</CardTitle>
                  <CardDescription>Write your blog post content in English</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEnglish">Title</Label>
                    <Input
                      id="titleEnglish"
                      value={formData.titleEnglish}
                      onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                      placeholder="Enter blog post title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerptEnglish">Excerpt</Label>
                    <Textarea
                      id="excerptEnglish"
                      value={formData.excerptEnglish}
                      onChange={(e) => setFormData({ ...formData, excerptEnglish: e.target.value })}
                      placeholder="Brief description of the blog post..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentEnglish">Content</Label>
                    <Textarea
                      id="contentEnglish"
                      value={formData.contentEnglish}
                      onChange={(e) => setFormData({ ...formData, contentEnglish: e.target.value })}
                      placeholder="Write your full blog post content here..."
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
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
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
              {/* <FileUpload
                onUpload={(url) => setFormData({ ...formData, featuredImage: url })}
                accept="image/*"
                folder="blog-images"
                maxSize={5}
                label="Upload Featured Image"
                currentFile={formData.featuredImage}
              /> */}
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Add multiple images to the gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <FileUpload
                onUpload={addToGallery}
                accept="image/*"
                folder="blog-gallery"
                maxSize={5}
                label="Add to Gallery"
              /> */}

              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeFromGallery(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} size="sm" type="button">
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
