"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Globe, MapPin, Users, Building } from "lucide-react"

export default function GlobalPresencePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")

  const branches = [
    {
      id: "GP001",
      name: "SDB Nepal - Kathmandu",
      country: "Nepal",
      city: "Kathmandu",
      address: "Pashupatinath Area, Kathmandu",
      coordinator: "राम बहादुर शर्मा",
      phone: "+977-1-4567890",
      email: "kathmandu@sdbnepal.org",
      members: 245,
      established: "2020",
      status: "Active",
    },
    {
      id: "GP002",
      name: "SDB Nepal - Pokhara",
      country: "Nepal",
      city: "Pokhara",
      address: "Lakeside, Pokhara",
      coordinator: "सीता देवी पौडेल",
      phone: "+977-61-567890",
      email: "pokhara@sdbnepal.org",
      members: 156,
      established: "2021",
      status: "Active",
    },
    {
      id: "GP003",
      name: "SDB USA - New York",
      country: "USA",
      city: "New York",
      address: "Jackson Heights, NY",
      coordinator: "Rajesh Sharma",
      phone: "+1-718-567-8900",
      email: "newyork@sdbusa.org",
      members: 89,
      established: "2022",
      status: "Active",
    },
    {
      id: "GP004",
      name: "SDB UK - London",
      country: "UK",
      city: "London",
      address: "Southall, London",
      coordinator: "Priya Patel",
      phone: "+44-20-7890-1234",
      email: "london@sdbuk.org",
      members: 67,
      established: "2023",
      status: "Planning",
    },
  ]

  const stats = [
    { title: "Total Branches", value: "12", icon: Building },
    { title: "Countries", value: "6", icon: Globe },
    { title: "Total Members", value: "1,247", icon: Users },
    { title: "Active Branches", value: "10", icon: MapPin },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Planning":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Global Presence</h1>
          <p className="text-muted-foreground">Manage international branches and coordinators</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
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

      {/* Branches Management */}
      <Card>
        <CardHeader>
          <CardTitle>International Branches</CardTitle>
          <CardDescription>Manage branches and coordinators worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="nepal">Nepal</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branches Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Coordinator</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-muted-foreground">Est. {branch.established}</div>
                        <div className="text-xs text-muted-foreground">ID: {branch.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {branch.country}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {branch.city}
                        </div>
                        <div className="text-xs text-muted-foreground">{branch.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{branch.coordinator}</div>
                        <div className="text-sm text-muted-foreground">{branch.email}</div>
                        <div className="text-xs text-muted-foreground">{branch.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span className="font-medium">{branch.members}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(branch.status)}>{branch.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-3 w-3 mr-1" />
                          Members
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
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
