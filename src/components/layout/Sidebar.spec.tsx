import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from './Sidebar'
import theme from '@/lib/theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import { useRouter, usePathname } from 'next/navigation'
import { useMediaQuery } from '@mui/material'

// Mock do Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock do useMediaQuery
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}))

describe('Sidebar Component', () => {
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
  }

  const mockRouter = {
    push: jest.fn(),
  }

  const renderSidebar = (props = defaultProps) => {
    return render(
      <ThemeProvider theme={theme}>
        <Sidebar {...props} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(usePathname as jest.Mock).mockReturnValue('/home')
  })

  it('should render menu items correctly', () => {
    // Arrange
    renderSidebar()

    // Assert
    expect(screen.getByText('Minha Empresa')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should call onClose when menu button is clicked', () => {
    // Arrange
    renderSidebar()

    // Act
    const menuButton = screen.getByTestId('MenuIcon').closest('button')
    fireEvent.click(menuButton!)

    // Assert
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should highlight active menu item', () => {
    // Arrange
    ;(usePathname as jest.Mock).mockReturnValue('/home')
    renderSidebar()

    // Assert
    const activeItem = screen.getByText('Dashboard').closest('a')
    const styles = window.getComputedStyle(activeItem!)
    expect(styles.color).toBe('rgb(25, 118, 210)')
  })

  it('should have correct navigation links', () => {
    // Arrange
    renderSidebar()

    // Assert
    const minhaEmpresaLink = screen.getByText('Minha Empresa').closest('a')
    expect(minhaEmpresaLink).toHaveAttribute('href', '/my-company')

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('href', '/home')
  })

  it('should show menu descriptions', () => {
    // Arrange
    renderSidebar()

    // Assert
    expect(screen.getByText('Gerencie os dados da sua empresa')).toBeInTheDocument()
    expect(screen.getByText('Visão geral do seu negócio')).toBeInTheDocument()
  })
}) 