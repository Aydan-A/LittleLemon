import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroImage from '../../assets/restaurant-food.jpg';
import Button from '../../components/ui/button/Button';
import { useReservation } from '../reservation/ReservationProvider';

const formatDate = (dateString) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return formatter.format(new Date(`${dateString}T00:00:00`));
};

const Hero = () => {
  const { getAvailabilityForDate } = useReservation();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const availabilityToday = useMemo(
    () => getAvailabilityForDate(today, 1),
    [getAvailabilityForDate, today]
  );

  const seatsRemainingToday = useMemo(
    () =>
      availabilityToday.reduce(
        (total, slot) => total + Number(slot.remaining || 0),
        0
      ),
    [availabilityToday]
  );

  const popularSlot = useMemo(() => {
    const availableSlots = availabilityToday.filter((slot) => slot.isAvailable);
    if (availableSlots.length === 0) {
      return null;
    }
    return availableSlots.reduce((lowest, slot) =>
      slot.remaining < lowest.remaining ? slot : lowest
    );
  }, [availabilityToday]);

  const nextOpenSlot = useMemo(() => {
    const searchWindowDays = 5;
    for (let offset = 0; offset < searchWindowDays; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const dateString = date.toISOString().split('T')[0];
      const slots = getAvailabilityForDate(dateString, 2);
      const nextSlot = slots.find((slot) => slot.isAvailable);
      if (nextSlot) {
        return {
          date: dateString,
          time: nextSlot.time,
          seats: nextSlot.remaining,
          offset,
        };
      }
    }
    return null;
  }, [getAvailabilityForDate]);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="hero-tagline">Mediterranean energy, Chicago soul</p>
        <h2 className="hero-title">Little Lemon</h2>
        <p className="hero-location">Chicago · West Loop</p>
        <p className="hero-descr">
          A new multi-room dining experience inspired by our chef&rsquo;s travels along the
          Mediterranean coast. Every service is choreographed to feel like a one-night-only
          event.
        </p>

        <div className="hero-cta">
          <Link to="/reservation">
            <Button
              color="ctaButtonColor hero-button"
              text="Reserve an experience"
            />
          </Link>
          <div className="hero-availability">
            <span className="availability-label">Next opening for two</span>
            <strong>
              {nextOpenSlot
                ? `${nextOpenSlot.time}, ${
                    nextOpenSlot.offset === 0
                      ? 'tonight'
                      : formatDate(nextOpenSlot.date)
                  }`
                : 'Fully booked this week'}
            </strong>
            {nextOpenSlot ? (
              <small>{nextOpenSlot.seats} seats remaining</small>
            ) : (
              <small>Join the waitlist in the reservation flow</small>
            )}
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <img className="hero-image" src={HeroImage} alt="Chef plating the signature mezze" />
        <div className="hero-stats">
          <div>
            <span className="stat-label">Seats tonight</span>
            <strong>{seatsRemainingToday}</strong>
            <small>across {availabilityToday.length} time slots</small>
          </div>
          <div>
            <span className="stat-label">Most requested</span>
            <strong>{popularSlot ? popularSlot.time : 'Sold out'}</strong>
            <small>
              {popularSlot
                ? `${popularSlot.remaining} seats remain`
                : 'Try another evening'}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
