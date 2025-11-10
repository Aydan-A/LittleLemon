import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAPI } from '../../utils/fakeAPI';
import './reservation.css';
import { useReservation } from './ReservationProvider';

const MAX_GUESTS = 12;
const MIN_GUESTS = 1;

const STEP_CONFIG = [
  {
    id: 'details',
    title: 'Your Details',
    subtitle: 'Tell us when you are coming and who is joining you.',
  },
  {
    id: 'time',
    title: 'Select A Time',
    subtitle: 'Choose from live availability that updates with every booking.',
  },
  {
    id: 'confirm',
    title: 'Review & Confirm',
    subtitle: 'Add your contact details and lock in the reservation.',
  },
];

const seatingOptions = [
  { value: 'indoor', label: 'Dining room' },
  { value: 'patio', label: 'Garden patio' },
  { value: 'chef', label: 'Chef counter' },
];

const occasionOptions = [
  { value: 'Dinner', label: 'Dinner out' },
  { value: 'Birthday', label: 'Birthday celebration' },
  { value: 'Anniversary', label: 'Anniversary' },
  { value: 'Business', label: 'Business meeting' },
  { value: 'Celebration', label: 'Special celebration' },
];

const seatingLabelMap = seatingOptions.reduce((map, option) => {
  map[option.value] = option.label;
  return map;
}, {});

const occasionLabelMap = occasionOptions.reduce((map, option) => {
  map[option.value] = option.label;
  return map;
}, {});

const classNames = (...tokens) => tokens.filter(Boolean).join(' ');

function Reservation() {
  const {
    getAvailabilityForDate,
    bookReservation,
    hasCapacity,
    upcomingReservations,
  } = useReservation();
  const navigate = useNavigate();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    date: today,
    guests: 2,
    occasion: 'Dinner',
    seating: 'indoor',
    specialRequests: '',
    time: '',
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const availability = useMemo(
    () => getAvailabilityForDate(formData.date, formData.guests),
    [getAvailabilityForDate, formData.date, formData.guests]
  );

  const selectedSlot = useMemo(
    () => availability.find((slot) => slot.time === formData.time),
    [availability, formData.time]
  );

  const validateStep = (currentStep) => {
    const nextErrors = {};

    if (currentStep === 0) {
      if (!formData.date) {
        nextErrors.date = 'Choose a date to continue.';
      }
      if (formData.guests < MIN_GUESTS || formData.guests > MAX_GUESTS) {
        nextErrors.guests = `We can host between ${MIN_GUESTS} and ${MAX_GUESTS} guests per table.`;
      }
    }

    if (currentStep === 1) {
      if (!formData.time) {
        nextErrors.time = 'Please choose an available time slot.';
      }
    }

    if (currentStep === 2) {
      if (!formData.name.trim()) {
        nextErrors.name = 'Add the name for the reservation.';
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
        nextErrors.email = 'Enter a valid email so we can send the confirmation.';
      }
      if (!formData.phone.trim()) {
        nextErrors.phone = 'Add a contact number in case we need to reach you.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToNext = () => {
    if (!validateStep(stepIndex)) {
      return;
    }

    if (stepIndex === STEP_CONFIG.length - 1) {
      handleSubmit();
      return;
    }

    setStatusMessage('');
    setStepIndex((prev) => prev + 1);
  };

  const goToPrevious = () => {
    setStatusMessage('');
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!formData.time) {
      setErrors((prev) => ({ ...prev, time: 'Choose a time to confirm.' }));
      setStepIndex(1);
      return;
    }

    if (!hasCapacity(formData.date, formData.time, formData.guests)) {
      setStatusMessage('That time slot just filled up. Please pick another.');
      setStepIndex(1);
      return;
    }

    const result = bookReservation(formData);

    if (!result.success) {
      setStatusMessage('We could not confirm that slot. Please choose a different time.');
      setStepIndex(1);
      return;
    }

    submitAPI(result.reservation);
    navigate('/confirmation', { state: { reservation: result.reservation } });
  };

  const handleFieldChange = (field) => (event) => {
    const value =
      field === 'guests' ? Number(event.target.value) : event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'date' ? { time: '' } : null),
    }));

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setSelectedTime = (time) => {
    setFormData((prev) => ({ ...prev, time }));
    setErrors((prev) => ({ ...prev, time: undefined }));
  };

  const isLastStep = stepIndex === STEP_CONFIG.length - 1;

  return (
    <main className="reservation-page">
      <section className="reservation-shell">
        <header className="reservation-hero">
          <h1>Plan Your Evening</h1>
          <p>
            A smarter reservation flow that reacts to real-time capacity. Share a few
            details and we&rsquo;ll hold the perfect table for you.
          </p>
        </header>

        <div className="reservation-layout">
          <section className="step-column">
            <ol className="stepper" aria-label="Reservation progress">
              {STEP_CONFIG.map((step, index) => (
                <li
                  key={step.id}
                  className={classNames(
                    'stepper-item',
                    index === stepIndex && 'is-active',
                    index < stepIndex && 'is-complete'
                  )}
                >
                  <span className="step-index" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className="step-copy">
                    <h2>{step.title}</h2>
                    <p>{step.subtitle}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="step-panels">
              {stepIndex === 0 && (
                <div className="step-panel" aria-live="polite">
                  <div className="field-grid">
                    <label className="field">
                      <span className="field-label">Date</span>
                      <input
                        type="date"
                        value={formData.date}
                        min={today}
                        onChange={handleFieldChange('date')}
                      />
                      {errors.date ? (
                        <span className="field-error">{errors.date}</span>
                      ) : null}
                    </label>

                    <label className="field">
                      <span className="field-label">Guests</span>
                      <input
                        type="range"
                        min={MIN_GUESTS}
                        max={MAX_GUESTS}
                        value={formData.guests}
                        onChange={handleFieldChange('guests')}
                      />
                      <div className="range-readout">
                        <input
                          type="number"
                          min={MIN_GUESTS}
                          max={MAX_GUESTS}
                          value={formData.guests}
                          onChange={handleFieldChange('guests')}
                        />
                        <span>
                          {formData.guests}{' '}
                          {formData.guests === 1 ? 'guest' : 'guests'}
                        </span>
                      </div>
                      {errors.guests ? (
                        <span className="field-error">{errors.guests}</span>
                      ) : (
                        <small>
                          We can comfortably host up to {MAX_GUESTS} guests at a single
                          table.
                        </small>
                      )}
                    </label>
                  </div>

                  <label className="field">
                    <span className="field-label">Occasion</span>
                    <select
                      value={formData.occasion}
                      onChange={handleFieldChange('occasion')}
                    >
                      {occasionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <fieldset className="field">
                    <legend className="field-label">Preferred seating</legend>
                    <div className="seating-options">
                      {seatingOptions.map((option) => (
                        <label key={option.value} className="chip">
                          <input
                            type="radio"
                            name="seating"
                            value={option.value}
                            checked={formData.seating === option.value}
                            onChange={handleFieldChange('seating')}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="field">
                    <span className="field-label">Special requests</span>
                    <textarea
                      value={formData.specialRequests}
                      placeholder="Let us know about dietary needs, celebrations, or accessibility requests."
                      onChange={handleFieldChange('specialRequests')}
                      rows={3}
                    />
                  </label>
                </div>
              )}

              {stepIndex === 1 && (
                <div className="step-panel">
                  <header className="panel-header">
                    <h3>Available tables on {formData.date}</h3>
                    <p>
                      Select a time to reserve {formData.guests}{' '}
                      {formData.guests === 1 ? 'seat' : 'seats'}.
                    </p>
                  </header>
                  <div className="time-grid">
                    {availability.length === 0 ? (
                      <p className="empty-state">
                        Choose a date to see the latest availability.
                      </p>
                    ) : (
                      availability.map((slot) => (
                        <button
                          type="button"
                          key={slot.time}
                          className={classNames(
                            'time-slot',
                            slot.time === formData.time && 'is-selected'
                          )}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.isAvailable}
                        >
                          <span className="time-slot-time">{slot.time}</span>
                          <span className="time-slot-capacity">
                            {slot.isAvailable
                              ? `${slot.remaining} seats left`
                              : 'Fully booked'}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  {errors.time ? <p className="field-error">{errors.time}</p> : null}
                </div>
              )}

              {stepIndex === 2 && (
                <div className="step-panel">
                  <header className="panel-header">
                    <h3>Who should we expect?</h3>
                    <p>
                      Share your contact info so we can send confirmations and reminders.
                    </p>
                  </header>
                  <div className="field-grid">
                    <label className="field">
                      <span className="field-label">Name</span>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleFieldChange('name')}
                        placeholder="Name for the reservation"
                      />
                      {errors.name ? (
                        <span className="field-error">{errors.name}</span>
                      ) : null}
                    </label>
                    <label className="field">
                      <span className="field-label">Email</span>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleFieldChange('email')}
                        placeholder="name@example.com"
                      />
                      {errors.email ? (
                        <span className="field-error">{errors.email}</span>
                      ) : null}
                    </label>
                    <label className="field">
                      <span className="field-label">Phone</span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleFieldChange('phone')}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone ? (
                        <span className="field-error">{errors.phone}</span>
                      ) : null}
                    </label>
                  </div>
                  <div className="panel-note">
                    We&rsquo;ll only contact you if your table is affected by last-minute
                    changes.
                  </div>
                </div>
              )}
            </div>

            <div className="step-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={goToPrevious}
                disabled={stepIndex === 0}
              >
                Back
              </button>
              <button type="button" className="btn primary" onClick={goToNext}>
                {isLastStep ? 'Confirm reservation' : 'Continue'}
              </button>
            </div>
            {statusMessage ? (
              <p className="form-status" role="alert">
                {statusMessage}
              </p>
            ) : null}
          </section>

          <aside className="summary-column">
            <section className="summary-card">
              <h2>Your plan</h2>
              <dl>
                <div>
                  <dt>Date</dt>
                  <dd>{formData.date}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{formData.guests}</dd>
                </div>
                <div>
                  <dt>Occasion</dt>
                  <dd>{occasionLabelMap[formData.occasion] ?? formData.occasion}</dd>
                </div>
                <div>
                  <dt>Seating</dt>
                  <dd>{seatingLabelMap[formData.seating] ?? 'Dining room'}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{formData.time || 'Not selected'}</dd>
                </div>
              </dl>
              {selectedSlot ? (
                <p className="summary-note">
                  {selectedSlot.remaining} seats remain for this time slot.
                </p>
              ) : (
                <p className="summary-note">Pick a time to see remaining seats.</p>
              )}
              {formData.specialRequests.trim() ? (
                <div className="summary-requests">
                  <h3>Special requests</h3>
                  <p>{formData.specialRequests}</p>
                </div>
              ) : null}
            </section>

            <section className="upcoming-card">
              <h2>Tonight&rsquo;s flow</h2>
              <p>
                Here&rsquo;s a peek at other upcoming parties so you can plan your
                arrival.
              </p>
              <ul>
                {upcomingReservations.slice(0, 4).map((reservation) => (
                  <li key={reservation.id}>
                    <div className="upcoming-time">
                      <span>{reservation.time}</span>
                      <span>{reservation.date}</span>
                    </div>
                    <div>
                      <strong>{reservation.name}</strong>
                      <small>
                        {reservation.guests}{' '}
                        {reservation.guests === 1 ? 'guest' : 'guests'} ·{' '}
                        {reservation.occasion}
                      </small>
                    </div>
                  </li>
                ))}
                {upcomingReservations.length === 0 ? (
                  <li className="empty-state">
                    You&rsquo;re the first booking for this week!
                  </li>
                ) : null}
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Reservation;
