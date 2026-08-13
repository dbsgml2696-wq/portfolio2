import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hero title with developer name', () => {
  render(<App />);
  const logoElements = screen.getAllByText(/KIM YOONHEE/i);
  expect(logoElements.length).toBeGreaterThan(0);
});

test('renders navigation links', () => {
  render(<App />);
  expect(screen.getByText('WORKS')).toBeInTheDocument();
  expect(screen.getByText('ABOUT')).toBeInTheDocument();
  expect(screen.getByText('CONTACT')).toBeInTheDocument();
});