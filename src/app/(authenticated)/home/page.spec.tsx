import { render, screen } from '@testing-library/react'
import HomePage from './page'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/lib/theme/theme'

describe('HomePage Component', () => {
  const renderHomePage = () => {
    return render(
      <ThemeProvider theme={theme}>
        <HomePage />
      </ThemeProvider>
    )
  }

  it('should render welcome message correctly', () => {
    // Arrange & Act
    renderHomePage()

    // Assert
    expect(screen.getByText('Bem-vindo ao SuperMEI')).toBeInTheDocument()
    expect(screen.getByText('Sua plataforma completa de gestão para MEIs')).toBeInTheDocument()
  })

  it('should render feature sections correctly', () => {
    // Arrange & Act
    renderHomePage()

    // Assert
    expect(screen.getByText('Gestão Simplificada')).toBeInTheDocument()
    expect(screen.getByText('Controle Total')).toBeInTheDocument()
  })

  it('should render feature descriptions correctly', () => {
    // Arrange & Act
    renderHomePage()

    // Assert
    expect(screen.getByText(/Controle suas finanças, documentos e obrigações fiscais em um só lugar/)).toBeInTheDocument()
    expect(screen.getByText(/Acompanhe seus resultados e tome decisões baseadas em dados reais/)).toBeInTheDocument()
  })

  it('should have correct styling for feature sections', () => {
    // Arrange & Act
    renderHomePage()

    // Assert
    const papers = screen.getAllByText(/Gestão Simplificada|Controle Total/).map(el => el.closest('.MuiPaper-root'))
    papers.forEach(paper => {
      expect(paper).toHaveStyle({
        padding: '24px',
        height: '100%',
        color: 'white',
      })
    })
  })

  it('should be responsive', () => {
    // Arrange & Act
    renderHomePage()

    // Assert
    const gridContainer = screen.getByText('Gestão Simplificada').closest('.MuiGrid-container')
    expect(gridContainer).toHaveClass('MuiGrid-container')
    expect(gridContainer).toHaveClass('MuiGrid-spacing-xs-3')
  })
}) 