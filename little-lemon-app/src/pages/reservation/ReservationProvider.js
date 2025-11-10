import { useContext, createContext, useReducer, useMemo, useCallback } from 'react';

const DEFAULT_TIME_SLOTS = [
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
];

const CAPACITY_PER_SLOT = 18;

const ReservationContext = createContext(null);

const initialState = createInitialState();

function createInitialState() {
    return {
        reservations: createSeedReservations(),
        capacityPerSlot: CAPACITY_PER_SLOT,
    };
}

function createSeedReservations() {
    const today = new Date();
    return [
        {
            id: 'seed-1',
            date: normalizeDate(addDays(today, 0)),
            time: '19:00',
            guests: 4,
            occasion: 'Chef tasting',
            seating: 'indoor',
            specialRequests: 'Window seating if available',
            name: 'Elena',
            email: 'elena@example.com',
            phone: '(312) 555-0198',
            createdAt: Date.now() - 1000 * 60 * 60 * 24,
        },
        {
            id: 'seed-2',
            date: normalizeDate(addDays(today, 1)),
            time: '20:30',
            guests: 2,
            occasion: 'Anniversary',
            seating: 'patio',
            specialRequests: 'Rose on the table',
            name: 'Marcus',
            email: 'marcus@example.com',
            phone: '(312) 555-0152',
            createdAt: Date.now() - 1000 * 60 * 60 * 20,
        },
        {
            id: 'seed-3',
            date: normalizeDate(addDays(today, 2)),
            time: '18:30',
            guests: 6,
            occasion: 'Family dinner',
            seating: 'indoor',
            specialRequests: 'High chair for toddler',
            name: 'Priya',
            email: 'priya@example.com',
            phone: '(312) 555-0137',
            createdAt: Date.now() - 1000 * 60 * 60 * 8,
        },
    ];
}

function reservationReducer(state, action) {
    switch (action.type) {
        case 'BOOK_RESERVATION': {
            return {
                ...state,
                reservations: [...state.reservations, action.payload],
            };
        }
        case 'CANCEL_RESERVATION': {
            return {
                ...state,
                reservations: state.reservations.filter(
                    (reservation) => reservation.id !== action.payload
                ),
            };
        }
        case 'RESET_RESERVATIONS': {
            return createInitialState();
        }
        default:
            return state;
    }
}

function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
}

function normalizeDate(date) {
    if (!date) {
        return '';
    }
    if (typeof date === 'string') {
        return date;
    }
    return date.toISOString().split('T')[0];
}

function createReservationId() {
    return `reservation-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
}

function calculateRemainingSeats(reservations, date, time, capacityPerSlot) {
    const seatsTaken = reservations
        .filter((reservation) => reservation.date === date && reservation.time === time)
        .reduce((total, reservation) => total + Number(reservation.guests || 0), 0);

    return Math.max(capacityPerSlot - seatsTaken, 0);
}

function sortByDateTime(a, b) {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
}

export function useReservation() {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
}

export function ReservationProvider({ children }) {
    const [state, dispatch] = useReducer(reservationReducer, initialState);

    const getAvailabilityForDate = useCallback(
        (date, guests = 1) => {
            const normalizedDate = normalizeDate(date);
            if (!normalizedDate) {
                return [];
            }

            return DEFAULT_TIME_SLOTS.map((time) => {
                const remaining = calculateRemainingSeats(
                    state.reservations,
                    normalizedDate,
                    time,
                    state.capacityPerSlot
                );
                return {
                    time,
                    remaining,
                    isAvailable: remaining >= guests,
                };
            });
        },
        [state.reservations, state.capacityPerSlot]
    );

    const hasCapacity = useCallback(
        (date, time, guests) => {
            const availability = getAvailabilityForDate(date, guests);
            return availability.some(
                (slot) => slot.time === time && slot.remaining >= guests
            );
        },
        [getAvailabilityForDate]
    );

    const bookReservation = useCallback(
        (reservation) => {
            const normalizedDate = normalizeDate(reservation.date);
            const normalizedReservation = {
                ...reservation,
                id: reservation.id ?? createReservationId(),
                date: normalizedDate,
                createdAt: Date.now(),
            };

            if (
                !normalizedReservation.time ||
                !hasCapacity(normalizedDate, normalizedReservation.time, normalizedReservation.guests)
            ) {
                return {
                    success: false,
                    reason: 'NO_CAPACITY',
                };
            }

            dispatch({
                type: 'BOOK_RESERVATION',
                payload: normalizedReservation,
            });

            return {
                success: true,
                reservation: normalizedReservation,
            };
        },
        [hasCapacity]
    );

    const cancelReservation = useCallback((reservationId) => {
        dispatch({
            type: 'CANCEL_RESERVATION',
            payload: reservationId,
        });
    }, []);

    const resetReservations = useCallback(() => {
        dispatch({ type: 'RESET_RESERVATIONS' });
    }, []);

    const upcomingReservations = useMemo(() => {
        return [...state.reservations].sort(sortByDateTime);
    }, [state.reservations]);

    const contextValue = useMemo(
        () => ({
            reservations: state.reservations,
            capacityPerSlot: state.capacityPerSlot,
            bookReservation,
            cancelReservation,
            resetReservations,
            getAvailabilityForDate,
            hasCapacity,
            upcomingReservations,
        }),
        [
            state.reservations,
            state.capacityPerSlot,
            bookReservation,
            cancelReservation,
            resetReservations,
            getAvailabilityForDate,
            hasCapacity,
            upcomingReservations,
        ]
    );

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
}
