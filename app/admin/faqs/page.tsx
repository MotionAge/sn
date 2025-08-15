"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, HelpCircle, Eye, Edit, Trash2 } from "lucide-react"

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const faqs = [
    {
      id: "FAQ001",
      question: "सदस्यता कसरी लिने?",
      answer: "सदस्यता लिनको लागि हाम्रो वेबसाइटमा रजिस्ट्रेशन गर्नुहोस् र आवश्यक कागजातहरू पेश गर्नुहोस्।",
      category: "Membership",
      language: "Nepali",
      views: 1247,
      helpful: 89,
      status: "Published",
      lastUpdated: "2024-01-15",
    },
    {
      id: "FAQ002",
      question: "How to register for events?",
      answer: "You can register for events through our website's events section or contact our coordinators directly.",
      category: "Events",
      language: "English",
      views: 892,
      helpful: 67,
      status: "Published",
      lastUpdated: "2024-01-10",
    },
    {
      id: "FAQ003",
      question: "दान कसरी गर्ने?",
      answer: "तपाईं हाम्रो वेबसाइटको दान सेक्शनबाट eSewa, Khalti वा बैंक ट्रान्सफरमार्फत दान गर्न सक्नुहुन्छ।",
      category: "Donations",
      language: "Nepali",
      views: 654,
      helpful: 45,
      status: "Published",
      lastUpdated: "2024-01-08",
    },
    {
      id: "FAQ004",
      question: "What are the membership benefits?",
      answer: "Members get access to exclusive content, priority event registration, and digital certificates.",
      category: "Membership",
      language: "English",
      views: 423,
      helpful: 32,
      status: "Draft",
      lastUpdated: "2024-01-05",
    },
  ]

  const stats = [
    { title: "Total FAQs", value: "47", icon: HelpCircle },
    { title: "Published", value: "42", icon: Eye },
    { title: "Total Views", value: "15,847", icon: Eye },
    { title: "Categories", value: "8", icon: HelpCircle },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Membership":
        return "bg-blue-100 text-blue-800"
      case "Events":
        return "bg-green-100 text-green-800"
      case "Donations":
        return "bg-purple-100 text-purple-800"
      case "Library":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions and answers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs Management */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Manage FAQs to help users find answers quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                <SelectItem value="library">Library</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FAQs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question & Answer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">{faq.question}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {faq.language}
                          </Badge>
                          <span>Updated: {faq.lastUpdated}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(faq.category)}>{faq.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Eye className="h-3 w-3 mr-1" />
                          {faq.views.toLocaleString()} views
                        </div>
                        <div className="text-xs text-muted-foreground">{faq.helpful} found helpful</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(faq.status)}>{faq.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
