"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { Badge } from "@/components/ui/badge"
import { Plus, ImageIcon, Edit, Trash2, Eye, EyeOff } from "lucide-react"

interface HeroSlide {
  id: string
  title: string
  description: string
  ctaText: string
  ctaUrl: string
  orderIndex: number
  isActive: boolean
  imageUrl?: string
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: "1",
      title: "Welcome to SDB Nepal",
      description: "Promoting Sanatan Dharma values and culture in Nepal",
      ctaText: "Learn More",
      ctaUrl: "/about",
      orderIndex: 1,
      isActive: true,
      imageUrl: "/placeholder.svg"
    }
  ])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ctaText: "",
    ctaUrl: "",
    orderIndex: 1,
    isActive: true
  })

  const handleCreateSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      ...formData
    }
    setSlides([...slides, newSlide])
    setFormData({
      title: "",
      description: "",
      ctaText: "",
      ctaUrl: "",
      orderIndex: slides.length + 1,
      isActive: true
    })
    setIsCreateModalOpen(false)
  }

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      description: slide.description,
      ctaText: slide.ctaText,
      ctaUrl: slide.ctaUrl,
      orderIndex: slide.orderIndex,
      isActive: slide.isActive
    })
  }

  const handleUpdateSlide = () => {
    if (!editingSlide) return
    setSlides(slides.map(slide => 
      slide.id === editingSlide.id 
        ? { ...editingSlide, ...formData }
        : slide
    ))
    setEditingSlide(null)
    setFormData({
      title: "",
      description: "",
      ctaText: "",
      ctaUrl: "",
      orderIndex: 1,
      isActive: true
    })
  }

  const handleDeleteSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id))
  }

  const toggleSlideStatus = (id: string) => {
    setSlides(slides.map(slide => 
      slide.id === id 
        ? { ...slide, isActive: !slide.isActive }
        : slide
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hero Slides Management</h1>
          <p className="text-muted-foreground">Manage the main carousel slides on your homepage</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Hero Slide</DialogTitle>
              <DialogDescription>
                Add a new slide to your homepage carousel with image, text, and call-to-action.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Slide Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter slide title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Text</Label>
                  <Input
                    id="ctaText"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">CTA URL</Label>
                  <Input
                    id="ctaUrl"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    placeholder="/page-url"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderIndex">Order</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Slide Image</Label>
                <FileUpload
                  bucket="hero-images"
                  entityType="hero_slide"
                  entityId={`temp-${Date.now()}`}
                  usageType="primary"
                  onUploadComplete={(files) => {
                    console.log('Image uploaded:', files)
                  }}
                  onUploadError={(error) => {
                    console.error('Upload failed:', error)
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Upload a high-quality image for the slide (max 5MB, JPG/PNG)
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSlide}>
                  Create Slide
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <Card key={slide.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              {slide.imageUrl ? (
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={slide.isActive ? "default" : "secondary"}>
                  {slide.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">{slide.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {slide.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Order: {slide.orderIndex}</span>
                  <span>CTA: {slide.ctaText}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleSlideStatus(slide.id)}
                >
                  {slide.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditSlide(slide)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteSlide(slide.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSlide && (
        <Dialog open={!!editingSlide} onOpenChange={() => setEditingSlide(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Hero Slide</DialogTitle>
              <DialogDescription>
                Update the slide information and image.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Slide Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter slide title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ctaText">CTA Text</Label>
                  <Input
                    id="edit-ctaText"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-ctaUrl">CTA URL</Label>
                  <Input
                    id="edit-ctaUrl"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    placeholder="/page-url"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-orderIndex">Order</Label>
                  <Input
                    id="edit-orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="edit-isActive">Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Update Image</Label>
                <FileUpload
                  bucket="hero-images"
                  entityType="hero_slide"
                  entityId={editingSlide.id}
                  usageType="primary"
                  onUploadComplete={(files) => {
                    console.log('Image updated:', files)
                  }}
                  onUploadError={(error) => {
                    console.error('Upload failed:', error)
                  }}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingSlide(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSlide}>
                  Update Slide
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
