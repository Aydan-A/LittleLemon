import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReservation } from '../reservation/ReservationProvider';

const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const LiveFeed = () => {
  const { upcomingReservations, getAvailabilityForDate } = useReservation();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todaysAvailability = useMemo(
    () => getAvailabilityForDate(today, 2),
    [getAvailabilityForDate, today]
  );

  const seatsLeftTonight = useMemo(
    () =>
      todaysAvailability.reduce(
        (total, slot) => total + Number(slot.remaining || 0),
        0
      ),
    [todaysAvailability]
  );

  const immediateOpenings = todaysAvailability
    .filter((slot) => slot.isAvailable)
    .slice(0, 3);

  return (
    <section className="live-feed">
      <div className="live-feed-header">
        <h2>Live reservation feed</h2>
        <p>
          A peek inside tonight&rsquo;s book — see who&rsquo;s joining us and the times that are
          still open.
        </p>
      </div>

      <div className="live-feed-body">
        <div className="live-feed-stats">
          <article className="stat-card">
            <span className="stat-eyebrow">Seats remaining tonight</span>
            <strong>{seatsLeftTonight}</strong>
            <small>Spread across {todaysAvailability.length} time slots</small>
          </article>
          <article className="stat-card">
            <span className="stat-eyebrow">Quick openings</span>
            {immediateOpenings.length > 0 ? (
              <ul className="stat-list">
                {immediateOpenings.map((slot) => (
                  <li key={slot.time}>
                    <strong>{formatTime(slot.time)}</strong>
                    <small>{slot.remaining} seats left</small>
                  </li>
                ))}
              </ul>
            ) : (
              <small>Tonight is fully committed — try another day.</small>
            )}
          </article>
        </div>

        <ul className="live-feed-list">
          {upcomingReservations.slice(0, 6).map((reservation) => (
            <li key={reservation.id}>
              <div className="live-feed-time">
                <span>{formatTime(reservation.time)}</span>
                <span>{reservation.date}</span>
              </div>
              <div className="live-feed-details">
                <strong>{reservation.name}</strong>
                <small>
                  {reservation.guests}{' '}
                  {reservation.guests === 1 ? 'guest' : 'guests'} ·{' '}
                  {reservation.occasion}
                </small>
                <small className="live-feed-meta">
                  {reservation.seating === 'chef'
                    ? 'Chef counter'
                    : reservation.seating === 'patio'
                    ? 'Garden patio'
                    : 'Dining room'}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="live-feed-link">
        <Link to="/reservation">Plan your table →</Link>
      </div>
    </section>
  );
};

export default LiveFeed;
