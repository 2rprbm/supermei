import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(),
}))

// Mock Firebase instance
jest.mock('@/lib/firebase', () => ({
  auth: {},
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading } = useAuth()
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? 'logged-in' : 'logged-out'}</div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide initial loading state', () => {
    // Arrange
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      return () => {}
    })

    // Act
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Assert
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-out')
  })

  it('should update state when user logs in', async () => {
    // Arrange
    const mockUser = { uid: '123', email: 'test@example.com' } as User
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser)
      return () => {}
    })

    // Act
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Assert
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-in')
  })

  it('should update state when user logs out', async () => {
    // Arrange
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null)
      return () => {}
    })

    // Act
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Assert
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-out')
  })

  it('should handle auth state changes', async () => {
    // Arrange
    let authCallback: ((user: User | null) => void) | null = null
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authCallback = callback
      return () => {}
    })

    // Act
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Assert initial state
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-out')

    // Simulate login
    await act(async () => {
      authCallback?.({ uid: '123', email: 'test@example.com' } as User)
    })

    // Assert logged in state
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-in')

    // Simulate logout
    await act(async () => {
      authCallback?.(null)
    })

    // Assert logged out state
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-out')
  })

  it('should cleanup subscription on unmount', () => {
    // Arrange
    const unsubscribe = jest.fn()
    ;(onAuthStateChanged as jest.Mock).mockImplementation(() => unsubscribe)

    // Act
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    unmount()

    // Assert
    expect(unsubscribe).toHaveBeenCalled()
  })

}) 