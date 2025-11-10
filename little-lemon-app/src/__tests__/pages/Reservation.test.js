import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reservation from '../../pages/reservation/Reservation';
import { ReservationProvider } from '../../pages/reservation/ReservationProvider';

const renderReservation = () =>
  render(
    <MemoryRouter initialEntries={['/reservation']}>
      <ReservationProvider>
        <Reservation />
      </ReservationProvider>
    </MemoryRouter>
  );

describe('Reservation flow', () => {
  test('allows progressing to the contact step after choosing a time', () => {
    renderReservation();

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    const timeButtons = screen.getAllByRole('button', { name: /seats left/i });
    fireEvent.click(timeButtons[0]);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Your plan/i)).toBeInTheDocument();
  });

  test('shows an error when trying to confirm without selecting a time', () => {
    renderReservation();

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByText(/Please choose an available time slot/i)
    ).toBeInTheDocument();
  });
});
