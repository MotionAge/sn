"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Save, Download, Upload } from "lucide-react"

export default function CertificateTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("membership")
  const [isEditing, setIsEditing] = useState(false)

  const [templates, setTemplates] = useState({
    membership: {
      name: "Membership Certificate",
      description: "Certificate issued to new members",
      headerText: "Sanatan Dharma Bigyan Samaj Nepal",
      titleText: "Certificate of Membership",
      bodyText:
        "This is to certify that {memberName} has been accepted as a {membershipType} member of Sanatan Dharma Bigyan Samaj Nepal.",
      footerText: "Issued on {issueDate}",
      serialFormat: "CERT-M-{year}-{number}",
      backgroundColor: "#ffffff",
      primaryColor: "#f97316",
      textColor: "#1f2937",
      fontSize: "12",
      fontFamily: "Arial",
      logoUrl: "/placeholder.svg?height=80&width=80",
      signatureUrl: "/placeholder.svg?height=60&width=120",
      sealUrl: "/placeholder.svg?height=80&width=80",
    },
    donation: {
      name: "Donation Receipt",
      description: "Receipt for donations received",
      headerText: "Sanatan Dharma Bigyan Samaj Nepal",
      titleText: "Donation Receipt",
      bodyText:
        "We gratefully acknowledge the donation of {currency} {amount} received from {donorName} for {purpose}.",
      footerText: "Thank you for your generous contribution. Issued on {issueDate}",
      serialFormat: "REC-D-{year}-{number}",
      backgroundColor: "#ffffff",
      primaryColor: "#059669",
      textColor: "#1f2937",
      fontSize: "12",
      fontFamily: "Arial",
      logoUrl: "/placeholder.svg?height=80&width=80",
      signatureUrl: "/placeholder.svg?height=60&width=120",
      sealUrl: "/placeholder.svg?height=80&width=80",
    },
    event: {
      name: "Event Participation Certificate",
      description: "Certificate for event participants",
      headerText: "Sanatan Dharma Bigyan Samaj Nepal",
      titleText: "Certificate of Participation",
      bodyText:
        "This is to certify that {participantName} has successfully participated in {eventTitle} held on {eventDate}.",
      footerText: "We appreciate your participation. Issued on {issueDate}",
      serialFormat: "CERT-E-{year}-{number}",
      backgroundColor: "#ffffff",
      primaryColor: "#3b82f6",
      textColor: "#1f2937",
      fontSize: "12",
      fontFamily: "Arial",
      logoUrl: "/placeholder.svg?height=80&width=80",
      signatureUrl: "/placeholder.svg?height=60&width=120",
      sealUrl: "/placeholder.svg?height=80&width=80",
    },
    course: {
      name: "Course Completion Certificate",
      description: "Certificate for course completion",
      headerText: "Sanatan Dharma Bigyan Samaj Nepal",
      titleText: "Certificate of Completion",
      bodyText:
        "This is to certify that {studentName} has successfully completed the {courseName} course with {grade} grade.",
      footerText: "Congratulations on your achievement. Issued on {issueDate}",
      serialFormat: "CERT-C-{year}-{number}",
      backgroundColor: "#ffffff",
      primaryColor: "#8b5cf6",
      textColor: "#1f2937",
      fontSize: "12",
      fontFamily: "Arial",
      logoUrl: "/placeholder.svg?height=80&width=80",
      signatureUrl: "/placeholder.svg?height=60&width=120",
      sealUrl: "/placeholder.svg?height=80&width=80",
    },
  })

  const currentTemplate = templates[selectedTemplate as keyof typeof templates]

  const handleSave = () => {
    console.log("Saving template:", selectedTemplate, currentTemplate)
    setIsEditing(false)
    // API call would go here
  }

  const handlePreview = () => {
    console.log("Generating preview for:", selectedTemplate)
    // Generate PDF preview
  }

  const CertificatePreview = ({ template }: { template: any }) => (
    <div
      className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col justify-between"
      style={{
        backgroundColor: template.backgroundColor,
        color: template.textColor,
        fontFamily: template.fontFamily,
        fontSize: `${template.fontSize}px`,
      }}
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img src={template.logoUrl || "/placeholder.svg"} alt="Logo" className="h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: template.primaryColor }}>
          {template.headerText}
        </h1>
        <h2 className="text-xl font-semibold mb-4">{template.titleText}</h2>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-lg leading-relaxed">{template.bodyText}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div className="text-center">
          <img src={template.signatureUrl || "/placeholder.svg"} alt="Signature" className="h-12 w-24 mb-2" />
          <div className="border-t border-gray-400 pt-1">
            <p className="text-sm">Authorized Signature</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm mb-4">{template.footerText}</p>
          <p className="text-xs text-gray-500">Serial: {template.serialFormat}</p>
        </div>
        <div className="text-center">
          <img src={template.sealUrl || "/placeholder.svg"} alt="Seal" className="h-16 w-16 mb-2" />
          <p className="text-xs">Official Seal</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certificate Templates</h1>
          <p className="text-muted-foreground">Design and manage certificate and receipt templates</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Types</CardTitle>
              <CardDescription>Select a template to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(templates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTemplate(key)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Upload Signature
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Upload Seal
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit Template: {currentTemplate.name}</span>
                <Badge variant="outline">{selectedTemplate}</Badge>
              </CardTitle>
              <CardDescription>Customize the template design and content</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="headerText">Header Text</Label>
                      <Input
                        id="headerText"
                        value={currentTemplate.headerText}
                        onChange={(e) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, headerText: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="titleText">Title Text</Label>
                      <Input
                        id="titleText"
                        value={currentTemplate.titleText}
                        onChange={(e) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, titleText: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bodyText">Body Text</Label>
                      <Textarea
                        id="bodyText"
                        value={currentTemplate.bodyText}
                        onChange={(e) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, bodyText: e.target.value },
                          })
                        }
                        rows={4}
                        placeholder="Use placeholders like {memberName}, {amount}, {date}"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input
                        id="footerText"
                        value={currentTemplate.footerText}
                        onChange={(e) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, footerText: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serialFormat">Serial Number Format</Label>
                      <Input
                        id="serialFormat"
                        value={currentTemplate.serialFormat}
                        onChange={(e) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, serialFormat: e.target.value },
                          })
                        }
                        placeholder="e.g., CERT-M-{year}-{number}"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={currentTemplate.backgroundColor}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [selectedTemplate]: { ...currentTemplate, backgroundColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={currentTemplate.backgroundColor}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [selectedTemplate]: { ...currentTemplate, backgroundColor: e.target.value },
                            })
                          }
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={currentTemplate.primaryColor}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [selectedTemplate]: { ...currentTemplate, primaryColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={currentTemplate.primaryColor}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [selectedTemplate]: { ...currentTemplate, primaryColor: e.target.value },
                            })
                          }
                          placeholder="#f97316"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="textColor"
                          type="color"
                          value={currentTemplate.textColor}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [selectedTemplate]: { ...currentTemplate, textColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={currentTemplate.textColor}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [selectedTemplate]: { ...currentTemplate, textColor: e.target.value },
                            })
                          }
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select
                        value={currentTemplate.fontSize}
                        onValueChange={(value) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, fontSize: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10px</SelectItem>
                          <SelectItem value="12">12px</SelectItem>
                          <SelectItem value="14">14px</SelectItem>
                          <SelectItem value="16">16px</SelectItem>
                          <SelectItem value="18">18px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select
                        value={currentTemplate.fontFamily}
                        onValueChange={(value) =>
                          setTemplates({
                            ...templates,
                            [selectedTemplate]: { ...currentTemplate, fontFamily: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <CertificatePreview template={currentTemplate} />
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Preview
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Placeholders */}
      <Card>
        <CardHeader>
          <CardTitle>Available Placeholders</CardTitle>
          <CardDescription>Use these placeholders in your template content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium mb-2">Member Placeholders</h4>
              <div className="space-y-1 text-sm">
                <Badge variant="outline">{"{memberName}"}</Badge>
                <Badge variant="outline">{"{memberId}"}</Badge>
                <Badge variant="outline">{"{membershipType}"}</Badge>
                <Badge variant="outline">{"{joinDate}"}</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Donation Placeholders</h4>
              <div className="space-y-1 text-sm">
                <Badge variant="outline">{"{donorName}"}</Badge>
                <Badge variant="outline">{"{amount}"}</Badge>
                <Badge variant="outline">{"{currency}"}</Badge>
                <Badge variant="outline">{"{purpose}"}</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Event Placeholders</h4>
              <div className="space-y-1 text-sm">
                <Badge variant="outline">{"{participantName}"}</Badge>
                <Badge variant="outline">{"{eventTitle}"}</Badge>
                <Badge variant="outline">{"{eventDate}"}</Badge>
                <Badge variant="outline">{"{venue}"}</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">General Placeholders</h4>
              <div className="space-y-1 text-sm">
                <Badge variant="outline">{"{issueDate}"}</Badge>
                <Badge variant="outline">{"{serialNumber}"}</Badge>
                <Badge variant="outline">{"{year}"}</Badge>
                <Badge variant="outline">{"{number}"}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
