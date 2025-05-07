import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import RegisterCompanyPage from './page'
import { useAuth } from '@/contexts/AuthContext'
import { companyService } from '@/services/companyService'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/services/companyService')
jest.mock('next/navigation')

describe('RegisterCompanyPage', () => {
  const mockUser = { uid: 'user123' }
  const mockCompanyData = {
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
    size: 'MEI'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false })
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Loading State', () => {
    it('should show loading spinner when auth is loading', () => {
      // Arrange
      ;(useAuth as jest.Mock).mockReturnValue({ user: null, loading: true })

      // Act
      render(<RegisterCompanyPage />)

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should show loading spinner when checking user', () => {
      // Arrange
      ;(useAuth as jest.Mock).mockReturnValue({ user: null, loading: false })

      // Act
      render(<RegisterCompanyPage />)

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Authentication', () => {
    it('should redirect to login when user is not authenticated', async () => {
      // Arrange
      const mockRouter = { push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
      ;(useAuth as jest.Mock).mockReturnValue({ user: null, loading: false })

      // Act
      render(<RegisterCompanyPage />)

      // Assert
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
      })
    })
  })
}) 