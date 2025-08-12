// API Client for Admin Operations
const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin-key-123'

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor() {
    this.baseUrl = '/api'
    this.headers = {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_API_KEY,
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
          status: response.status,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 500,
      }
    }
  }

  // Blogs API
  async getBlogs() {
    return this.request('/blogs')
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createBlog(blogData: {
    title: string
    content: string
    author: string
    published?: boolean
  }) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    })
  }

  async updateBlog(id: string, blogData: any) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    })
  }

  async deleteBlog(id: string) {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE',
    })
  }

  // Events API
  async getEvents() {
    return this.request('/events')
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  }

  async updateEvent(id: string, eventData: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    })
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    })
  }

  // Members API
  async getMembers() {
    return this.request('/membership')
  }

  async createMember(memberData: any) {
    return this.request('/membership', {
      method: 'POST',
      body: JSON.stringify(memberData),
    })
  }

  async updateMember(id: string, memberData: any) {
    return this.request(`/membership/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    })
  }

  async deleteMember(id: string) {
    return this.request(`/membership/${id}`, {
      method: 'DELETE',
    })
  }

  // Donations API
  async getDonations() {
    return this.request('/donations')
  }

  async createDonation(donationData: any) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    })
  }

  async updateDonation(id: string, donationData: any) {
    return this.request(`/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donationData),
    })
  }

  async deleteDonation(id: string) {
    return this.request(`/donations/${id}`, {
      method: 'DELETE',
    })
  }

  // Gallery API
  async getGallery() {
    return this.request('/gallery')
  }

  async uploadImage(imageData: { filename: string; base64: string; caption?: string }) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(imageData),
    })
  }

  async deleteImage(id: string) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    })
  }

  // Library API
  async getLibrary() {
    return this.request('/library')
  }

  async createLibraryItem(itemData: any) {
    return this.request('/library', {
      method: 'POST',
      body: JSON.stringify(itemData),
    })
  }

  async updateLibraryItem(id: string, itemData: any) {
    return this.request(`/library/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    })
  }

  async deleteLibraryItem(id: string) {
    return this.request(`/library/${id}`, {
      method: 'DELETE',
    })
  }

  // Projects API
  async getProjects() {
    return this.request('/projects')
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(id: string, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Pages API
  async getPages() {
    return this.request('/pages')
  }

  async updatePage(pageData: { id: string; title: string; content: string }) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(pageData),
    })
  }

  // FAQs API
  async getFaqs() {
    return this.request('/faqs')
  }

  async createFaq(faqData: {
    question: string
    answer: string
    category?: string
    order?: number
  }) {
    return this.request('/faqs', {
      method: 'POST',
      body: JSON.stringify(faqData),
    })
  }

  async updateFaq(id: string, faqData: any) {
    return this.request(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqData),
    })
  }

  async deleteFaq(id: string) {
    return this.request(`/faqs/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
