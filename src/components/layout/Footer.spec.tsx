import { render, screen } from '@testing-library/react'
import Footer from './Footer'
import theme from '@/lib/theme/theme'
import { ThemeProvider } from '@mui/material/styles'

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    )
  }

  it('should render copyright text correctly', () => {
    // Arrange
    renderFooter()

    // Assert
    expect(screen.getByText(/© \d{4} SuperMEI/)).toBeInTheDocument()
  })

  it('should render social media links correctly', () => {
    // Arrange
    renderFooter()

    // Assert
    expect(screen.getByLabelText('Visite nosso LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('Visite nosso Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('Visite nosso Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('Visite nosso YouTube')).toBeInTheDocument()
  })

  it('should render developer credit correctly', () => {
    // Arrange
    renderFooter()

    // Assert
    expect(screen.getByText('Desenvolvido por Editora Finantech')).toBeInTheDocument()
  })

  it('should have correct styling', () => {
    // Arrange
    renderFooter()

    // Assert
    const footer = screen.getByRole('contentinfo')
    const styles = window.getComputedStyle(footer)
    
    expect(styles.padding).toBe('24px 16px 24px 16px')
    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)')
  })
}) 