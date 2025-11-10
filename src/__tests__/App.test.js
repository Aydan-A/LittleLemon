import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('renders text on home page', () => {
  render(
    <MemoryRouter>
        <App />
    </MemoryRouter>
    );
  const liveFeedHeading = screen.getByText(/Live reservation feed/i);
  expect(liveFeedHeading).toBeInTheDocument();
});
