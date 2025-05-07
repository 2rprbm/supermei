import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from './page'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock do Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
  auth: {},
}))

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('should render all required elements when page loads', () => {
    // Arrange
    render(<LoginPage />)

    // Assert
    expect(screen.getByText('SuperMEI')).toBeInTheDocument()
    expect(screen.getByText('Faça login para continuar')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('should toggle password visibility when clicking the visibility button', () => {
    // Arrange
    render(<LoginPage />)
    const passwordInput = screen.getByLabelText('Senha')
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })

    // Assert - Initial state
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Act - Show password
    fireEvent.click(toggleButton)

    // Assert - Password visible
    expect(passwordInput).toHaveAttribute('type', 'text')

    // Act - Hide password
    fireEvent.click(toggleButton)

    // Assert - Password hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should update form fields when user types', () => {
    // Arrange
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Assert
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should show error message when credentials are invalid', async () => {
    // Arrange
    ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/invalid-credential'
    })
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })

    // Act
    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos')).toBeInTheDocument()
    })
  })

  it('should redirect to home when credentials are valid', async () => {
    // Arrange
    const mockUser = {
      user: {
        email: 'test@example.com'
      }
    }
    ;(signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUser)
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123')
      expect(mockRouter.push).toHaveBeenCalledWith('/home')
    })
  })

  it('should clear form fields when clicking cancel button', () => {
    // Arrange
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })

    // Act - Fill form and click cancel
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(cancelButton)

    // Assert
    expect(emailInput).toHaveValue('')
    expect(passwordInput).toHaveValue('')
  })

  it('should clear error message when clicking cancel button', async () => {
    // Arrange
    ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/invalid-credential'
    })
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })

    // Act - Submit invalid credentials and then cancel
    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos')).toBeInTheDocument()
    })
    fireEvent.click(cancelButton)

    // Assert
    expect(screen.queryByText('E-mail ou senha incorretos')).not.toBeInTheDocument()
  })

  it('should show error message when too many attempts', async () => {
    // Arrange
    ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/too-many-requests'
    })
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Muitas tentativas de login. Tente novamente mais tarde.')).toBeInTheDocument()
    })
  })

  it('should show generic error message when an unexpected error occurs', async () => {
    // Arrange
    ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Unexpected error'))
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login. Tente novamente.')).toBeInTheDocument()
    })
  })
}) 