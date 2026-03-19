// src/__tests__/App.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders the main application layout', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    // Check for a key element in your AppLayout
    const layoutElement = screen.getByRole('main');
    expect(layoutElement).toBeInTheDocument();
  });
});
