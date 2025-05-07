import { Company } from '@/types/company'

const STORAGE_KEY = 'companies'

export const companyService = {
  async createCompany(data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const companyData: Company = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    }
    const companies = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    companies.push(companyData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
    return companyData
  },

  async updateCompany(data: Company): Promise<void> {
    const companies: Company[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const idx = companies.findIndex(c => c.id === data.id)
    if (idx !== -1) {
      companies[idx] = { ...data, updatedAt: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
    }
  },

  async getCompanyByUserId(userId: string): Promise<Company | null> {
    const companies: Company[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return companies.find(c => c.userId === userId) || null
  },

  async getCompanyById(id: string): Promise<Company | null> {
    const companies: Company[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return companies.find(c => c.id === id) || null
  },

  async deleteCompany(id: string): Promise<void> {
    const companies: Company[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const filtered = companies.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },
} 