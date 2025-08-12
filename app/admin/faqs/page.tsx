"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Download, Plus, HelpCircle, AlertCircle } from "lucide-react"
import { useFaqs } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import Link from "next/link"

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  order?: number
  created_at: string
  updated_at: string
}

export default function FaqsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { data: faqs, loading, error, execute: fetchFaqs } = useFaqs<FAQ[]>()

  // Memoize fetchFaqs to avoid unnecessary re-renders
  const fetchFaqsCallback = useCallback(() => {
    fetchFaqs()
  }, [fetchFaqs])

  useEffect(() => {
    fetchFaqsCallback()
  }, [fetchFaqsCallback])

  const handleDeleteFaq = async (id: string) => {
    try {
      const result = await apiClient.deleteFaq(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("FAQ deleted successfully")
        fetchFaqsCallback() // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete FAQ")
    }
  }

  const filteredFaqs = faqs?.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || 
                          (faq.category && faq.category.toLowerCase() === categoryFilter)
    return matchesSearch && matchesCategory
  }) || []

  const stats = [
    { 
      title: "Total FAQs", 
      value: faqs?.length?.toString() || "0", 
      icon: HelpCircle 
    },
    { 
      title: "Categories", 
      value: faqs ? new Set(faqs.map(f => f.category).filter(Boolean)).size.toString() : "0", 
      icon: HelpCircle 
    },
    { 
      title: "This Month", 
      value: faqs?.filter(f => {
        const createdDate = new Date(f.created_at)
        const thisMonth = new Date()
        return createdDate.getMonth() === thisMonth.getMonth() && 
               createdDate.getFullYear() === thisMonth.getFullYear()
      }).length?.toString() || "0", 
      icon: HelpCircle 
    },
    { 
      title: "Updated", 
      value: faqs?.filter(f => {
        const updatedDate = new Date(f.updated_at)
        const thisMonth = new Date()
        return updatedDate.getMonth() === thisMonth.getMonth() && 
               updatedDate.getFullYear() === thisMonth.getFullYear()
      }).length?.toString() || "0", 
      icon: HelpCircle 
    },
  ]

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800"
    
    switch (category.toLowerCase()) {
      case "general":
        return "bg-blue-100 text-blue-800"
      case "membership":
        return "bg-green-100 text-green-800"
      case "events":
        return "bg-purple-100 text-purple-800"
      case "donations":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load FAQs: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={fetchFaqs} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions and answers</p>
        </div>
        <Button asChild>
          <Link href="/admin/faqs/new">
            <Plus className="h-4 w-4 mr-2" />
            New FAQ
          </Link>
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
          <CardTitle>FAQs List</CardTitle>
          <CardDescription>Manage all frequently asked questions and answers</CardDescription>
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
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* FAQs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[300px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[40px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-[60px]" />
                          <Skeleton className="h-8 w-[60px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredFaqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || categoryFilter !== "all" 
                          ? "No FAQs match your filters" 
                          : "No FAQs found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFaqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell>
                        <div className="font-medium">{faq.question}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {faq.answer}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{faq.order || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(faq.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
