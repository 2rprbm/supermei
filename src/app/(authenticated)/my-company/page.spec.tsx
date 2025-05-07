import { render, screen, waitFor } from '@testing-library/react'
import MyCompanyPage from './page'
import { useAuth } from '@/contexts/AuthContext'
import { companyService } from '@/services/companyService'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/services/companyService')
jest.mock('next/navigation')

describe('MyCompanyPage', () => {
  const mockUser = { uid: 'user123' }
  const mockCompany = {
    id: 'company123',
    userId: 'user123',
    cnpj: '12345678901234',
    name: 'Test Company',
    tradingName: 'Test Trading Name',
    stateRegistration: {
      number: '123456789',
      isExempt: false
    },
    municipalRegistration: '987654321',
    address: {
      cep: '12345-678',
      street: 'Test Street',
      number: '123',
      complement: 'Test Complement',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'SP'
    },
    contact: {
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      whatsapp: '(11) 99999-9999',
      website: 'https://test.com'
    },
    size: 'MEI',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
  })

  describe('Loading State', () => {
    it('should show loading spinner when fetching company data', () => {
      // Arrange
      ;(companyService.getCompanyByUserId as jest.Mock).mockImplementation(() => new Promise(() => {}))

      // Act
      render(<MyCompanyPage />)

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('No Company State', () => {
    it('should show welcome message and register button when no company is found', async () => {
      // Arrange
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(null)

      // Act
      render(<MyCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Bem-vindo ao SuperMEI!')).toBeInTheDocument()
        expect(screen.getByText('Parece que você ainda não cadastrou sua empresa. Vamos começar?')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Cadastrar Minha Empresa' })).toBeInTheDocument()
      })
    })

    it('should redirect to register-company when register button is clicked', async () => {
      // Arrange
      const mockRouter = { push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(null)

      // Act
      render(<MyCompanyPage />)
      const registerButton = await screen.findByRole('button', { name: 'Cadastrar Minha Empresa' })
      registerButton.click()

      // Assert
      expect(mockRouter.push).toHaveBeenCalledWith('/register-company')
    })
  })

  describe('Company Display', () => {
    it('should display company information when company is found', async () => {
      // Arrange
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(mockCompany)

      // Act
      render(<MyCompanyPage />)

      // Assert
      await waitFor(() => {
        // General Information
        expect(screen.getByText('Informações Gerais')).toBeInTheDocument()
        expect(screen.getByText('12345678901234')).toBeInTheDocument() // CNPJ
        expect(screen.getByText('Test Company')).toBeInTheDocument() // Company Name
        expect(screen.getByText('Test Trading Name')).toBeInTheDocument() // Trading Name
        expect(screen.getByText('MEI')).toBeInTheDocument() // Size
        expect(screen.getByText('123456789')).toBeInTheDocument() // State Registration
        expect(screen.getByText('987654321')).toBeInTheDocument() // Municipal Registration

        // Address
        expect(screen.getByText('Endereço')).toBeInTheDocument()
        expect(screen.getByText('12345-678')).toBeInTheDocument() // CEP
        expect(screen.getByText('Test Street')).toBeInTheDocument() // Street
        expect(screen.getByText('123')).toBeInTheDocument() // Number
        expect(screen.getByText('Test Complement')).toBeInTheDocument() // Complement
        expect(screen.getByText('Test Neighborhood')).toBeInTheDocument() // Neighborhood
        expect(screen.getByText('Test City')).toBeInTheDocument() // City
        expect(screen.getByText('SP')).toBeInTheDocument() // State

        // Contact
        expect(screen.getByText('Contato')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument() // Email
        expect(screen.getByText('https://test.com')).toBeInTheDocument() // Website
        const phoneNumbers = screen.getAllByText('(11) 99999-9999')
        expect(phoneNumbers).toHaveLength(2) // Phone and WhatsApp
      })
    })

    it('should show edit button and redirect to edit-company when clicked', async () => {
      // Arrange
      const mockRouter = { push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(mockCompany)

      // Act
      render(<MyCompanyPage />)
      const editButton = await screen.findByRole('button', { name: 'Editar' })
      editButton.click()

      // Assert
      expect(mockRouter.push).toHaveBeenCalledWith('/edit-company')
    })

    it('should display dash for empty values', async () => {
      // Arrange
      const companyWithEmptyValues = {
        ...mockCompany,
        tradingName: '',
        contact: {
          ...mockCompany.contact,
          website: '',
          whatsapp: ''
        },
        address: {
          ...mockCompany.address,
          complement: ''
        }
      }
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(companyWithEmptyValues)

      // Act
      render(<MyCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(screen.getAllByText('—')).toHaveLength(4) // Empty values should show dash (tradingName, website, whatsapp, complement)
      })
    })

    it('should show "Isento" for exempt state registration', async () => {
      // Arrange
      const companyWithExemptRegistration = {
        ...mockCompany,
        stateRegistration: {
          ...mockCompany.stateRegistration,
          isExempt: true
        }
      }
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(companyWithExemptRegistration)

      // Act
      render(<MyCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Isento')).toBeInTheDocument()
      })
    })
  })
}) 