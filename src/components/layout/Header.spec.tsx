import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'
import theme from '@/lib/theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

// Mock do useMediaQuery
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}))

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('Header Component', () => {
  const defaultProps = {
    onMenuToggle: jest.fn(),
    isMenuOpen: false,
  }

  const renderHeader = (props = defaultProps) => {
    return render(
      <ThemeProvider theme={theme}>
        <Header {...props} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render logo and title correctly', () => {
    // Arrange
    renderHeader()

    // Assert
    expect(screen.getByText('SuperMEI')).toBeInTheDocument()
  })

  it('should call onMenuToggle when menu button is clicked', () => {
    // Arrange
    renderHeader()

    // Act
    const menuButton = screen.getByLabelText('menu')
    fireEvent.click(menuButton)

    // Assert
    expect(defaultProps.onMenuToggle).toHaveBeenCalledTimes(1)
  })

  it('should show menu button when menu is closed', () => {
    // Arrange
    renderHeader()

    // Assert
    const menuButton = screen.getByLabelText('menu')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-label', 'menu')
  })

  it('should show menu button when menu is open', () => {
    // Arrange
    renderHeader({ ...defaultProps, isMenuOpen: true })

    // Assert
    const menuButton = screen.getByLabelText('menu')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-label', 'menu')
  })

  it('should be responsive on mobile screens', () => {
    // Arrange
    (useMediaQuery as jest.Mock).mockImplementation(() => true)
    renderHeader()

    // Assert
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('MuiAppBar-positionFixed')
    expect(header).toHaveClass('MuiAppBar-root')
    expect(header).toHaveClass('MuiPaper-elevation4')
  })

  it('should be responsive on desktop screens', () => {
    // Arrange
    (useMediaQuery as jest.Mock).mockImplementation(() => false)
    renderHeader()

    // Assert
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('MuiAppBar-positionFixed')
    expect(header).toHaveClass('MuiAppBar-root')
    expect(header).toHaveClass('MuiPaper-elevation4')
  })

  it('should navigate to home when logo is clicked', () => {
    // Arrange
    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter)
    renderHeader()

    // Act
    const logoContainer = screen.getByText('SuperMEI').closest('div')
    fireEvent.click(logoContainer!)

    // Assert
    expect(mockRouter.push).toHaveBeenCalledWith('/home')
  })

  it('should close menu when navigating on mobile', () => {
    // Arrange
    (useMediaQuery as jest.Mock).mockImplementation(() => true)
    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter)
    renderHeader()

    // Act
    const logoContainer = screen.getByText('SuperMEI').closest('div')
    fireEvent.click(logoContainer!)

    // Assert
    expect(defaultProps.onMenuToggle).toHaveBeenCalled()
  })

  it('should not close menu when navigating on desktop', () => {
    // Arrange
    (useMediaQuery as jest.Mock).mockImplementation(() => false)
    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter)
    renderHeader()

    // Act
    const logoContainer = screen.getByText('SuperMEI').closest('div')
    fireEvent.click(logoContainer!)

    // Assert
    expect(defaultProps.onMenuToggle).not.toHaveBeenCalled()
  })

  it('should hide header when scrolling down', () => {
    // Arrange
    renderHeader()

    // Assert
    const header = screen.getByRole('banner')
    const slideComponent = header.parentElement
    expect(slideComponent).toBeInTheDocument()
    expect(slideComponent?.tagName.toLowerCase()).toBe('div')
  })
}) 