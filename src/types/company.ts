export interface Company {
  id: string
  userId: string
  cnpj: string
  name: string
  tradingName: string
  stateRegistration: {
    number: string
    isExempt: boolean
  }
  municipalRegistration: string
  address: {
    cep: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
  contact: {
    email: string
    phone: string
    whatsapp: string
    website: string
  }
  size: 'MEI' | 'ME' | 'EPP' | 'DEMAIS'
  createdAt: string
  updatedAt: string
} 