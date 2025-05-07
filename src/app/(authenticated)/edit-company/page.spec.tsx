import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import EditCompanyPage from './page'
import { useAuth } from '@/contexts/AuthContext'
import { companyService } from '@/services/companyService'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/services/companyService')
jest.mock('next/navigation')

describe('EditCompanyPage', () => {
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
      render(<EditCompanyPage />)

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Company Data Fetching', () => {
    it('should fetch and display company data when user is authenticated', async () => {
      // Arrange
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(mockCompany)

      // Act
      render(<EditCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test Trading Name')).toBeInTheDocument()
        expect(screen.getByDisplayValue('12345678901234')).toBeInTheDocument()
      })
    })

    it('should redirect to register-company when no company is found', async () => {
      // Arrange
      const mockRouter = { push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
      ;(companyService.getCompanyByUserId as jest.Mock).mockResolvedValue(null)

      // Act
      render(<EditCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/register-company')
      })
    })

    it('should redirect to my-company when fetch fails', async () => {
      // Arrange
      const mockRouter = { push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
      ;(companyService.getCompanyByUserId as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

      // Act
      render(<EditCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/my-company')
      })
    })
  })

  describe('User Authentication', () => {
    it('should not fetch data when user is not authenticated', () => {
      // Arrange
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })

      // Act
      render(<EditCompanyPage />)

      // Assert
      expect(companyService.getCompanyByUserId).not.toHaveBeenCalled()
    })
  })
}) 