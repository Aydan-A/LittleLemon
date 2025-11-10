import { FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './confirmReservation.css';
import { useReservation } from './ReservationProvider';

const seatingLabelMap = {
  indoor: 'Dining room',
  patio: 'Garden patio',
  chef: 'Chef counter',
};

const occasionLabelMap = {
  Dinner: 'Dinner out',
  Birthday: 'Birthday celebration',
  Anniversary: 'Anniversary',
  Business: 'Business meeting',
  Celebration: 'Special celebration',
};

function ConfirmedReservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { upcomingReservations } = useReservation();
  const reservation = location.state?.reservation ?? null;

  const secondaryReservations = upcomingReservations
    .filter((entry) => !reservation || entry.id !== reservation.id)
    .slice(0, 4);

  return (
    <main className="confirmation-page">
      <section className="confirmation-shell">
        <header className="confirmation-header">
          <div className="confirmation-icon">
            <FaCheckCircle aria-hidden="true" />
          </div>
          <div>
            <h1>Reservation confirmed</h1>
            <p>
              We saved your table and sent the plan to your inbox. Arrive a few minutes
              early so we can welcome your party in style.
            </p>
          </div>
        </header>

        {reservation ? (
          <div className="confirmation-grid">
            <section className="confirmation-card highlight">
              <h2>Your evening</h2>
              <dl>
                <div>
                  <dt>Date</dt>
                  <dd>{reservation.date}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{reservation.time}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{reservation.guests}</dd>
                </div>
                <div>
                  <dt>Occasion</dt>
                  <dd>{occasionLabelMap[reservation.occasion] ?? reservation.occasion}</dd>
                </div>
                <div>
                  <dt>Seating</dt>
                  <dd>{seatingLabelMap[reservation.seating] ?? reservation.seating}</dd>
                </div>
                <div>
                  <dt>Host</dt>
                  <dd>{reservation.name}</dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>
                    {reservation.email}
                    <br />
                    {reservation.phone}
                  </dd>
                </div>
              </dl>
              {reservation.specialRequests ? (
                <div className="confirmation-note">
                  <h3>Special requests</h3>
                  <p>{reservation.specialRequests}</p>
                </div>
              ) : null}
            </section>

            <section className="confirmation-card">
              <h2>Flow of the night</h2>
              <p>We stagger arrivals to keep service smooth. Here are the parties around you.</p>
              <ul>
                {secondaryReservations.map((entry) => (
                  <li key={entry.id}>
                    <div className="reservation-time">
                      <span>{entry.time}</span>
                      <span>{entry.date}</span>
                    </div>
                    <div>
                      <strong>{entry.name}</strong>
                      <small>
                        {entry.guests}{' '}
                        {entry.guests === 1 ? 'guest' : 'guests'} · {entry.occasion}
                      </small>
                    </div>
                  </li>
                ))}
                {secondaryReservations.length === 0 ? (
                  <li className="empty-state">
                    You&rsquo;re the star of the hour&mdash;no other parties overlap with
                    your arrival.
                  </li>
                ) : null}
              </ul>
            </section>
          </div>
        ) : (
          <section className="confirmation-card empty">
            <h2>No reservation loaded</h2>
            <p>
              We couldn&rsquo;t find the reservation details. It may have been opened in a
              new tab or refreshed.
            </p>
            <div className="confirmation-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => navigate('/')}
              >
                Return home
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => navigate('/reservation')}
              >
                Plan a new visit
              </button>
            </div>
          </section>
        )}

        <footer className="confirmation-actions">
          <button type="button" className="btn ghost" onClick={() => navigate('/')}>
            Back to home
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => navigate('/reservation')}
          >
            Book another table
          </button>
        </footer>
      </section>
    </main>
  );
}

export default ConfirmedReservation;
