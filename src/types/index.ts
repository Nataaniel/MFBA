export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureAirport: string;
  arrivalAirport: string;
  price: number;
  flightNumber: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  idNumber: string;
  type: 'adult' | 'child' | 'infant';
}

export interface BookingDetails {
  flight: Flight;
  passengers: Passenger[];
  seatSelections?: string[];
  contactEmail: string;
  contactPhone: string;
  bookingCode?: string;
}