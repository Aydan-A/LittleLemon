const testimonials = [
  {
    quote:
      'Hands-down the best service in the West Loop — the chef remembered our anniversary favorites.',
    name: 'Sasha & Amir',
  },
  {
    quote: 'Effortless hospitality, thoughtful wine pairings, and the garden patio is magic.',
    name: 'Priya',
  },
  {
    quote: 'We booked the chef counter and it felt like a private show — already planning a return.',
    name: 'Marcus',
  },
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <h2>What guests say</h2>
      <ul className="testimonials">
        {testimonials.map((testimonial) => (
          <li key={testimonial.name} className="user">
            <p className="user-review">“{testimonial.quote}”</p>
            <strong>{testimonial.name}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Testimonials;
