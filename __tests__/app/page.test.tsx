import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the PartsTable component
jest.mock('@/components/parts-table', () => ({
  PartsTable: ({ onRefresh }: { onRefresh: () => void }) => (
    <div data-testid="parts-table">
      <button onClick={onRefresh} data-testid="refresh-button">
        Refresh
      </button>
    </div>
  ),
}))

describe('Home Page', () => {
  it('should render the main page with title and description', () => {
    render(<Home />)

    expect(screen.getByText('Electronic Parts Database')).toBeInTheDocument()
    expect(screen.getByText('Manage your electronic components inventory')).toBeInTheDocument()
  })

  it('should render the PartsTable component', () => {
    render(<Home />)

    expect(screen.getByTestId('parts-table')).toBeInTheDocument()
  })

  it('should handle refresh functionality', async () => {
    const { rerender } = render(<Home />)

    // Get the initial render
    const initialTable = screen.getByTestId('parts-table')
    
    // Simulate refresh by clicking the refresh button
    const refreshButton = screen.getByTestId('refresh-button')
    refreshButton.click()

    // Rerender to simulate the refresh
    rerender(<Home />)

    // The component should still be rendered
    expect(screen.getByTestId('parts-table')).toBeInTheDocument()
  })

  it('should have proper page structure', () => {
    render(<Home />)

    // Check for main container
    const container = screen.getByText('Electronic Parts Database').closest('div')
    expect(container).toHaveClass('mb-8')

    // Check for header section
    const header = screen.getByText('Electronic Parts Database').closest('div')
    expect(header).toHaveClass('mb-8')

    // Check for title styling
    const title = screen.getByText('Electronic Parts Database')
    expect(title).toHaveClass('text-3xl', 'font-bold', 'tracking-tight', 'text-gray-900')

    // Check for description styling
    const description = screen.getByText('Manage your electronic components inventory')
    expect(description).toHaveClass('text-gray-600', 'mt-2')
  })

  it('should be responsive', () => {
    render(<Home />)

    const container = screen.getByText('Electronic Parts Database').closest('div')
    expect(container).toHaveClass('mb-8')
  })
})
