import theme from './theme'

describe('Theme Configuration', () => {
  it('should have correct primary color palette', () => {
    expect(theme.palette.primary).toEqual({
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    })
  })

  it('should have correct secondary color palette', () => {
    expect(theme.palette.secondary).toEqual({
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    })
  })

  it('should have correct typography configuration', () => {
    expect(theme.typography.fontFamily).toBe('"Inter", "Helvetica", "Arial", sans-serif')
    
    // Verifica configurações dos headings
    expect(theme.typography.h1).toEqual({
      fontSize: '2.5rem',
      fontWeight: 600,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.167,
    })
    expect(theme.typography.h2).toEqual({
      fontSize: '2rem',
      fontWeight: 600,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.2,
    })
    expect(theme.typography.h3).toEqual({
      fontSize: '1.75rem',
      fontWeight: 600,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.167,
    })
    expect(theme.typography.h4).toEqual({
      fontSize: '1.5rem',
      fontWeight: 600,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.235,
    })
    expect(theme.typography.h5).toEqual({
      fontSize: '1.25rem',
      fontWeight: 600,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.334,
    })
    expect(theme.typography.h6).toEqual({
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.6,
    })
  })

  it('should have correct button style overrides', () => {
    expect(theme.components?.MuiButton?.styleOverrides?.root).toEqual({
      textTransform: 'none',
      borderRadius: 8,
    })
  })
}) 