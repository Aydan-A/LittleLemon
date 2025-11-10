export function submitAPI(reservation) {
  // Mimic a network roundtrip so tests can mock deterministic behavior.
  console.log('Submitting reservation', reservation);
  return true;
}

export function fetchAPI(date) {
  const baseSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
  const random = Array.from(date).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return baseSlots.filter((_, index) => (index + random) % 2 === 0);
}
